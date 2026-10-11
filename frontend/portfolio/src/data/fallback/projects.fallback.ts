import type { ProjectDocument } from '../../types';

export const FALLBACK_PROJECTS: ProjectDocument[] = [
  {
    slug: 'resumeforge',
    title: 'ResumeForge — ATS-Optimized Resume Builder',
    description:
      'Full-stack resume workstation: an interactive "compiler IDE" for career records with AI tailoring, sub-millimeter print fidelity, and a security-hardened Express backend.',
    problem:
      'Tailoring a resume to every job description is slow and error-prone, and formatting breaks between screen and PDF. Applicants needed a single source of truth for their career data that could be steered by natural language and rendered pixel-perfect every time.',
    architecture:
      'React 18 + TypeScript frontend (Profile Builder, JD ingestion workspace, Prompt Studio, print canvas) with Redux Toolkit for auth and hydrated profile state. Express 5 backend behind a defense perimeter: tiered rate limiters (global, auth, AI), CORS origin verification with credentials, JWT auth with httpOnly cookies, and Bcrypt password hashing. A Mistral AI orchestration layer — with system prompts explicitly hardened against prompt injection — returns schema-enforced JSON that the print canvas renders. MongoDB via Mongoose for persistence, Vitest for backend tests, deployed on Vercel.',
    architecture_diagram: `graph TD
  UI["React 18 SPA — Profile Builder · JD Parser · Prompt Studio · Print Canvas"] -->|Axios with credentials| RL["Tiered Rate Limiters"]
  RL --> CORS["CORS + Cookie Parser"]
  CORS --> AUTH["JWT Auth Guard"]
  AUTH --> CTRL["Domain Controllers — Auth · Profile · Resume"]
  CTRL -->|Persist Schemas| DB[(MongoDB / Mongoose)]
  CTRL -->|Injection-hardened prompts| LLM[Mistral AI Orchestrator]
  LLM -->|Structured resume JSON| CTRL
  CTRL -->|ATS-optimized content blocks| UI`,
    key_features: [
      {
        title: 'Injection-Hardened LLM Orchestration',
        code: `// Express route: schema-enforced Mistral call behind the AI rate limiter
app.post("/api/resume/tailor", verifyJWT, aiRateLimiter, async (req, res) => {
  const { resumeData, jobDescription } = req.body;
  // System prompt wraps all user content in delimiters to block prompt injection
  const prompt = generateATSPrompt(resumeData, jobDescription);

  const response = await mistralClient.chat.complete({
    model: "mistral-small-latest",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: HARDENED_SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ]
  });

  const parsed = ResumeSchema.parse(JSON.parse(response.choices[0].message.content));
  return res.status(200).json({ success: true, data: parsed });
});`,
        language: 'typescript',
      },
      {
        title: 'Tiered Defense Perimeter',
        code: `// Layered middleware: global limiter -> auth limiter -> JWT -> AI limiter
app.set("trust proxy", 1);
app.use(globalLimiter);
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authLimiter, authRoutes);      // login, refresh
app.use("/api", verifyJWT, routes);                   // protected domain routes
app.use("/api/resume", verifyJWT, aiLimiter, aiRoutes); // expensive LLM calls`,
        language: 'typescript',
      },
    ],
    impact_metrics: {
      auth: 'JWT + httpOnly cookies',
      llm_output: 'Schema-enforced JSON',
      testing: 'Vitest backend suite',
    },
    tech_tags: ['React 18', 'TypeScript', 'Redux Toolkit', 'Express 5', 'MongoDB', 'Mongoose', 'Mistral AI', 'JWT', 'Vitest', 'Vercel'],
    github_url: 'https://github.com/AynanshAadyant/resume-builder-app',
    live_url: '',
    thumbnail_url: '/thumbnails/resumeforge.webp',
    featured: true,
    display_order: 1,
  },
  {
    slug: 'jobnotifier-self-healing-scraper',
    title: 'JobNotifier — Self-Healing Job Scraping Engine',
    description:
      'Autonomous Python pipeline that scrapes job boards on a schedule, detects broken site structures, and uses an LLM to rewrite its own scraping configs — escalating to humans only when healing fails.',
    problem:
      'Scrapers die silently whenever a job board changes its markup, and nobody notices until the data is stale. Manual selector maintenance does not scale across many sites.',
    architecture:
      'Fully async Python system. Each job board is described by a JSON config (selectors, crawl delay, timeout); the scheduler fans out per-site ScrapeJobRunner executions with politeness delays. Results pass through validation before persistence. A composite healing trigger detects failures and hands truncated HTML samples to a healing orchestrator, which prompts Gemini to generate a corrected scraping config — the pipeline retries automatically. After configurable max attempts, a composite alert service (log + webhook) escalates to a human. Pydantic-settings drives all config; structured logging covers every layer; the event loop shuts down cleanly on interrupt.',
    architecture_diagram: `graph TD
      SCHED["Scheduler — per-site interval"] --> RUN["Scrape Job Runner"]
      CFG["Site JSON Configs"] --> RUN
      RUN --> FETCH["Fetch + Parse — crawl delay, timeout"]
      FETCH --> VAL{Validation}
      VAL|pass| PERSIST["Result Repository — output"]
      VAL|fail| TRIG["Composite Healing Trigger"]
      TRIG --> HEAL["LLM Healing Orchestrator — Gemini"]
      HEAL|rewritten config| CFG
      HEAL|attempts exhausted| ALERT["Alert Services — log + webhook"]
      PERSIST --> NOTIFY["Job notifications"]`,
    key_features: [
      {
        title: 'LLM Self-Healing Loop',
        code: `# Healing orchestrator: LLM regenerates a broken site config
class HealingOrchestrator:
    def __init__(self, generator: LLMConfigGenerator, max_attempts: int):
        self._generator = generator
        self._max_attempts = max_attempts

    async def heal(self, site_name: str, failing_config: dict, html_sample: str) -> Config:
        for attempt in range(self._max_attempts):
            new_config = await self._generator.regenerate(
                failing_config=failing_config,
                html_sample=html_sample[: settings.html_sample_max_chars],
            )
            if await self._validator.verify(site_name, new_config):
                return new_config
        await self._alert_service.escalate(site_name)
        raise HealingFailed(site_name)`,
        language: 'python',
      },
      {
        title: 'Pydantic-Settings Configuration',
        code: `class Settings(BaseSettings):
    """Env-first config; secrets never committed, only .env.example tracked."""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

        gemini_api_key: str = Field(description="Gemini API key for config healing")
        scrape_interval_hours: int = Field(default=6)
        max_healing_attempts: int = Field(default=3, ge=1, le=10)
        html_sample_max_chars: int = Field(default=30_000)
        default_crawl_delay: float = Field(default=2.0, ge=0)  # politeness delay
        alert_webhook_url: str | None = Field(default=None)`,
        language: 'python',
      },
    ],
    impact_metrics: {
      healing: 'LLM-driven config repair',
      retry_policy: 'Max 3 attempts → webhook escalation',
      scraping: 'Politeness-delayed, async',
    },
    tech_tags: ['Python', 'asyncio', 'Pydantic', 'Gemini API', 'Web Scraping', 'Observability', 'Pytest'],
    github_url: 'https://github.com/AynanshAadyant/job-notifier',
    live_url: '',
    thumbnail_url: '/thumbnails/jobnotifier.webp',
    featured: true,
    display_order: 2,
  },
  {
    slug: 'ecotransit',
    title: 'EcoTransit — Resilient Transit Tracking & Predictive Journey Planning',
    description:
      'Team-built microservice platform for tracking public transit in infrastructure-limited cities: universal ingestion of MQTT and GTFS-RT feeds, real-time positions, and ETA prediction — real-world data only.',
    problem:
      'Transit tracking systems assume dense GPS infrastructure that infrastructure-limited cities do not have, and existing feeds (MQTT devices, GTFS-RT) each demand custom integration code.',
    architecture:
      'A single universal ingestion pipeline serves all position sources — MQTT is the primary transport, GTFS-RT polling feeds the same engine, and neither is special-cased (ISource → IParser → IValidationRule → ISink). Strict layering per a written implementation spec: controllers only translate HTTP, services hold all business logic, repositories abstract Postgres/Redis behind interfaces, and cross-cutting code (JWT, cookies, errors, logging, geospatial math) lives in a versioned shared package. SOLID is enforced concretely: adding a BLE position source is one new class plus one line of wiring. CI on GitHub Actions; a strict personal-branch → feature-branch → PR → review workflow governs a team of three.',
    architecture_diagram: `graph LR
  subgraph SOURCES["Real Position Sources"]
    MQTT["MQTT devices — ESP32"]
    GTFS["GTFS-RT polling"]
  end
  MQTT --> ING["Universal Ingestion Engine — ISource · IParser · IValidationRule · ISink"]
  GTFS --> ING
  ING --> PS[(PostgreSQL)]
  ING --> RD[(Redis)]
  PS --> ETA["ETA / Journey Planning Service"]
  RD --> ETA
  ETA -->|REST| APP["Client apps"]`,
    key_features: [
      {
        title: 'Interface-Segregated Ingestion Contracts',
        code: `// Four narrow contracts instead of one god-interface.
// Adding a BLE source = one new class + one line of wiring.
export interface ISource { connect(): AsyncIterable<RawPacket>; }
export interface IParser { parse(raw: RawPacket): PositionReport | null; }
export interface IValidationRule { check(report: PositionReport): boolean; }
export interface ISink { write(report: PositionReport): Promise<void>; }

// The engine depends only on abstractions (Dependency Inversion):
export class IngestionEngine {
  constructor(
    private readonly source: ISource,
    private readonly parser: IParser,
    private readonly rules: IValidationRule[],
    private readonly sinks: ISink[],
  ) {}

  async run(): Promise<void> {
    for await (const raw of this.source.connect()) {
      const report = this.parser.parse(raw);
      if (report && this.rules.every((r) => r.check(report))) {
        await Promise.all(this.sinks.map((s) => s.write(report)));
      }
    }
  }
}`,
        language: 'typescript',
      },
      {
        title: 'Real-Data-Only Development Policy',
        code: `// Recorded real telemetry replaces absent feeds during development —
// no simulators, mock engines, or synthetic generators at any layer.
export class ArchiveReplaySource implements ISource {
  constructor(private readonly archive: TelemetryArchive) {}

  async *connect(): AsyncIterable<RawPacket> {
    for (const packet of await this.archive.recordedPackets()) {
      yield packet; // genuine captured GTFS-RT/MQTT telemetry
      await sleep(this.archive.originalInterPacketDelay(packet));
    }
  }
}`,
        language: 'typescript',
      },
    ],
    impact_metrics: {
      ingestion: 'Universal MQTT + GTFS-RT pipeline',
      data_policy: 'Real-world data only',
      team: '3 developers, PR-reviewed',
    },
    tech_tags: ['TypeScript', 'MQTT', 'GTFS-RT', 'PostgreSQL', 'Redis', 'Microservices', 'Monorepo', 'GitHub Actions'],
    github_url: 'https://github.com/AynanshAadyant/ecotransit',
    live_url: '',
    thumbnail_url: '/thumbnails/ecotransit.webp',
    featured: true,
    display_order: 3,
  }
];