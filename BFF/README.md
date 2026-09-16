# Portfolio BFF (Backend For Frontend) & Headless CMS

Production-grade BFF and headless CMS tailored for personal portfolio frontends. Built on Node.js/Express and MongoDB/Mongoose with strict separation of concerns, multi-tier caching, external API telemetry aggregation (LeetCode & Spotify), and comprehensive administrative CMS endpoints.

---

## 1. Architectural Highlights

- **Separation of Concerns**:
  - **Routes (`src/routes/`)**: Pure route mapping with authentication and validation middleware attachments.
  - **Middlewares (`src/middlewares/`)**: Token/cookie authentication (`requireAdmin`), request latency & logging, uniform error envelopes.
  - **Controllers (`src/controllers/`)**: Thin request/response managers (extracts params/body, delegates to services, formats HTTP response).
  - **Services (`src/services/`)**: Orchestrates business workflows, coordinates database and caching, and interfaces with external providers.
  - **OOP Utilities (`src/utils/`)**: Encapsulates core business logic, schema transformation (`DataProcessor`), Mermaid diagram validation (`MermaidValidator`), dual-tier caching (`CacheManager`), JWT handling (`TokenManager`), secure cookie management (`CookieManager`), and RFC 5424 structured logging (`Logger`).
- **Resilience & SLA**:
  - P95 response target `< 300ms`.
  - Multi-tier caching: In-memory store (sub-millisecond) + MongoDB persistent cache + fallback seed data.
  - Never crashes or blocks if external APIs (LeetCode, Spotify) or database connections experience latency or downtime.
- **Security**:
  - All sensitive tokens, secrets, credentials, and cookie parameters configured via `.env`.
  - Supports both `Authorization: Bearer <token>` and HTTP-only signed cookies with `SameSite` and `Secure` flags.

---

## 2. Environment Variables

Create a `.env` file in the `BFF/` root (or copy from `.env.example`):

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/portfolio

# Admin Auth & Security
ADMIN_PASSWORD=your_admin_password_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
COOKIE_NAME=portfolio_admin_token

# Frontend Client URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Spotify Integration (Optional - falls back to seed data if empty)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# LeetCode Integration (Optional - falls back to seed data if empty)
LEETCODE_USERNAME=
```

---

## 3. API Reference

### 3.1 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Body: `{ "password": "..." }`. Returns `{ success: true, token, expiresIn }` and sets HTTP-only cookie. |
| `POST` | `/api/auth/logout` | Public | Clears auth cookie and invalidates session. |
| `GET` | `/api/auth/me` | Public/Admin | Checks active Bearer token or cookie session. |

### 3.2 Content Blocks (`/api/content`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/content` | Public | Returns dictionary `Record<string, string>` of all content blocks. |
| `GET` | `/api/content/:key` | Public | Returns `{ "key": "...", "value": "..." }`. |
| `PUT` | `/api/content/:key` | Admin | Upserts content block. Body: `{ "value": "..." }`. |

### 3.3 Projects & Case Studies (`/api/projects`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Public | Returns array of `ProjectDocument` sorted by `display_order` ascending. |
| `GET` | `/api/projects/:slug` | Public | Returns full project case study matching slug. |
| `POST` | `/api/projects` | Admin | Creates project (validates unique slug & Mermaid diagram). |
| `PUT` | `/api/projects/:slug` | Admin | Updates project document and invalidates cache. |
| `DELETE` | `/api/projects/:slug` | Admin | Deletes project document. |

### 3.4 LeetCode Telemetry (`/api/leetcode`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/leetcode/stats` | Public | Returns cached problem stats, contest rating, streak, and recent submissions. |
| `POST` | `/api/leetcode/sync` | Admin | Forces refresh from LeetCode GraphQL API. |

### 3.5 Spotify Integration (`/api/spotify`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/spotify/now-playing` | Public | Returns live playback status (`isPlaying`, `nowPlaying`, `topTracks`). |
| `GET` | `/api/spotify/top-tracks` | Public | Returns top rotation tracks. |
| `POST` | `/api/spotify/sync` | Admin | Refreshes Spotify top tracks and playback cache. |

### 3.6 Admin CMS Management (`/api/admin`)
*All `/api/admin/*` endpoints require `Authorization: Bearer <token>` or HTTP-only admin cookie.*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/content` | Lists all content blocks with metadata (`createdAt`, `updatedAt`). |
| `POST` | `/api/admin/content` | Creates or upserts a content block (`{ key, value }`). |
| `DELETE` | `/api/admin/content/:key` | Deletes a content block. |
| `POST` | `/api/admin/content/bulk` | Bulk upserts key-value map (`{ "key1": "val1", ... }`). |
| `GET` | `/api/admin/projects` | Lists all projects with full database metadata. |
| `POST` | `/api/admin/projects` | Creates new project with Mermaid diagram validation. |
| `PUT` | `/api/admin/projects/:slug` | Updates project document. |
| `DELETE` | `/api/admin/projects/:slug` | Deletes project document. |
| `PATCH` | `/api/admin/projects/reorder` | Reorders projects (receives `[{ slug, display_order }]`). |
| `GET` | `/api/admin/cache/status` | Inspects in-memory and database cache entries, TTL, and keys. |
| `POST` | `/api/admin/cache/clear` | Purges all in-memory and database caches. |
| `POST` | `/api/admin/cache/seed` | Seeds database from seed dataset (`{ force?: boolean }`). |
| `POST` | `/api/admin/sync/leetcode` | Forces LeetCode cache refresh. |
| `POST` | `/api/admin/sync/spotify` | Forces Spotify cache refresh. |
| `GET` | `/api/admin/system/health` | Returns system diagnostics (uptime, memory, DB status, integration status). |

---

## 4. Testing & Verification

Run the automated test suite (unit + HTTP integration tests):

```bash
npm test
```

## 5. Progress

All functionality working good. Spotify Integration held back. 
