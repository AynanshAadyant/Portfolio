export const SEED_CONTENT_BLOCKS = {
  'home.status_pill': 'Open to Software Engineering Internships & Roles — 2026/2027',
  'home.hero.headline': 'Architecting resilient distributed backends, IoT pipelines, and intelligent interfaces.',
  'home.hero.subheadline':
    'Computer Science undergrad at MAIT with experience building serverless cloud pipelines at SAG, DRDO and high-throughput architectures.',
  'home.right_now.building': 'Distributed IoT & AI Microservices',
  'home.right_now.reading': 'Designing Data-Intensive Applications',
  'home.right_now.learning': 'Distributed Systems & Cloud Orchestration',
  'resume.bio':
    'Full-stack and backend-leaning engineer with deep experience in Node.js, TypeScript, AWS, and C++ algorithmic problem-solving.',
};

export const SEED_PROJECTS = [
  {
    slug: 'resume-ai-generator',
    title: 'ResumeAI — Custom Resume Generator',
    description:
      'AI-powered resume tailoring platform with structured ATS analysis and JSON schema inference.',
    problem:
      'Job applicants face massive rejection rates due to misaligned resumes that fail automated Applicant Tracking Systems (ATS). Manual resume tailoring per job description is slow and error-prone.',
    architecture:
      'React frontend connected via Express REST APIs with JWT-based session security. Implements Mistral AI API orchestration with strict JSON schema enforcement to parse job descriptions and output targeted, ATS-optimized content blocks directly into MongoDB.',
    architecture_diagram: `graph TD
  A[Client App - React + ShadCN] -->|JWT Auth Requests| B[Express.js REST API]
  B -->|Job Description / Profile| C[Mistral AI API]
  C -->|Structured JSON Output| B
  B -->|Persist Schemas| D[(MongoDB Cluster)]
  B -->|ATS Keyword Match Stream| A`,
    key_features: [
      {
        title: 'Structured LLM Inference Pipeline',
        code: `// Express route handling Mistral API with guaranteed JSON schemas
app.post("/api/resume/tailor", verifyJWT, async (req, res) => {
  const { resumeData, jobDescription } = req.body;
  const prompt = generateATSPrompt(resumeData, jobDescription);
  
  const response = await mistralClient.chat.complete({
    model: "mistral-small-latest",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }]
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return res.status(200).json({ success: true, data: parsed });
});`,
        language: 'typescript',
      },
      {
        title: 'ATS Keyword Match Engine',
        code: `function computeATSScore(parsedJD: string[], candidateSkills: string[]): number {
  const set = new Set(candidateSkills.map(s => s.toLowerCase()));
  const matches = parsedJD.filter(term => set.has(term.toLowerCase()));
  return Math.round((matches.length / parsedJD.length) * 100);
}`,
        language: 'typescript',
      },
    ],
    impact_metrics: {
      ats_accuracy: 'High',
      parsing_schema: 'Structured JSON',
      auth: 'JWT Sessions',
    },
    tech_tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'ShadCN', 'Mistral AI'],
    github_url: 'https://github.com/aynanshaadyant',
    live_url: '',
    thumbnail_url: '/thumbnails/resume-ai.webp',
    featured: true,
    display_order: 1,
  },
  {
    slug: 'cloud-iot-pipeline-drdo',
    title: 'Cloud-Based IoT & Telemetry Solution (SAG, DRDO)',
    description:
      'Low-latency bidirectional IoT platform utilizing MQTT, ESP32, and serverless AWS architecture.',
    problem:
      'Existing hardware telemetry prototypes suffered from high manufacturing unit costs and lacked real-time, low-latency communication for remote device monitoring and control.',
    architecture:
      'Migrated legacy hardware to ESP32 microcontrollers communicating over MQTT. Telemetry data routes through AWS IoT Core into Lambda workers and DynamoDB, streaming updates to a live web dashboard with sub-10ms latency.',
    architecture_diagram: `graph LR
  Node1[ESP32 Microcontroller] -->|MQTT Protocol| AWS1[AWS IoT Core]
  AWS1 -->|Event Trigger| AWS2[AWS Lambda Engine]
  AWS2 -->|Write Telemetry| DB[(AWS DynamoDB)]
  AWS2 -->|WebSocket / REST API Gateway| Web[Real-Time Control Dashboard]
  Web -->|Bidirectional Control| AWS1`,
    key_features: [
      {
        title: 'Bidirectional Telemetry Pipeline',
        code: `// AWS Lambda handler for high-throughput IoT Core MQTT ingestion
export const handler = async (event: any) => {
  const { deviceId, telemetry, timestamp } = event;
  
  await dynamoDb.put({
    TableName: process.env.TELEMETRY_TABLE!,
    Item: {
      deviceId,
      timestamp: timestamp || Date.now(),
      metrics: telemetry,
      latencyMs: Date.now() - timestamp
    }
  }).promise();

  return { statusCode: 200, body: "Ingested" };
};`,
        language: 'typescript',
      },
    ],
    impact_metrics: {
      latency: '<10ms',
      cost_reduction: '50-60%',
      protocol: 'MQTT',
    },
    tech_tags: ['AWS IoT Core', 'AWS Lambda', 'DynamoDB', 'ESP32', 'MQTT', 'Node.js', 'C++'],
    github_url: 'https://github.com/aynanshaadyant',
    live_url: '',
    thumbnail_url: '/thumbnails/iot-pipeline.webp',
    featured: true,
    display_order: 2,
  },
  {
    slug: 'crop-disease-detection',
    title: 'AI Crop Disease Detection System',
    description:
      'Full-stack agricultural diagnostic platform linking image uploads directly to machine learning inference services.',
    problem:
      'Farmers require immediate visual identification of crop infections to take preventative measures before yield destruction occurs.',
    architecture:
      'React frontend using Tailwind CSS for streamlined photo capture, Express.js backend handling multipart concurrent file streams, Cloudinary media buffering, and REST routing to an ML inference service with structured diagnosis logging in MongoDB.',
    architecture_diagram: `graph TD
  Client[React Client Upload] -->|Multipart Form Data| Server[Node.js / Express Gateway]
  Server -->|Image Buffer Upload| CDN[Cloudinary Media Storage]
  Server -->|Inference Query| ML[Model Diagnosis Pipeline]
  ML -->|Confidence & Disease Class| Server
  Server -->|Log Metadata & Treatment| DB[(MongoDB)]
  Server -->|JSON Result| Client`,
    key_features: [
      {
        title: 'Concurrent Image Ingestion Route',
        code: `router.post("/diagnose", upload.single("crop_image"), async (req, res) => {
  const uploadResult = await cloudinary.uploader.upload_stream(req.file.buffer);
  const prediction = await queryInferenceEngine(uploadResult.secure_url);
  
  const record = await DiagnosisLog.create({
    imageUrl: uploadResult.secure_url,
    prediction: prediction.label,
    confidence: prediction.score,
    treatment: prediction.remedyGuide
  });

  return res.json({ success: true, result: record });
});`,
        language: 'javascript',
      },
    ],
    impact_metrics: {
      throughput: 'Concurrent',
      cloud_storage: 'Cloudinary',
      inference: 'ML Vision',
    },
    tech_tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Cloudinary'],
    github_url: 'https://github.com/aynanshaadyant',
    live_url: '',
    thumbnail_url: '/thumbnails/crop-disease.webp',
    featured: true,
    display_order: 3,
  },
];

export const SEED_LEETCODE_STATS = {
  totalSolved: 600,
  easySolved: 210,
  mediumSolved: 320,
  hardSolved: 70,
  contestRating: 1600,
  streakDays: 365,
  badges: ['50-Day Badge', '100-Day Badge', '365-Day Continuous Problem Solving Badge'],
  recentSubmissions: [
    { title: 'Course Schedule II', difficulty: 'Medium', timestamp: '2 hours ago' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', timestamp: '1 day ago' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', timestamp: '2 days ago' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', timestamp: '3 days ago' },
  ],
};

export const SEED_SPOTIFY_DATA = {
  isPlaying: false,
  nowPlaying: null,
  topTracks: [
    {
      track: 'Starboy',
      artist: 'The Weeknd, Daft Punk',
      album: 'Starboy',
      albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=120&auto=format&fit=crop&q=80',
      spotifyUrl: 'https://open.spotify.com',
    },
    {
      track: 'Midnight City',
      artist: 'M83',
      album: "Hurry Up, We're Dreaming",
      albumArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80',
      spotifyUrl: 'https://open.spotify.com',
    },
    {
      track: 'Get Lucky',
      artist: 'Daft Punk ft. Pharrell Williams',
      album: 'Random Access Memories',
      albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
      spotifyUrl: 'https://open.spotify.com',
    },
  ],
};
