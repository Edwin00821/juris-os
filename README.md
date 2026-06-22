# Juris OS

Juris OS is a legal case management platform. **Citizens** file lawsuits (assisted
by an AI drafting copilot), **admins** assign them to judges (assisted by an AI
assignment engine), and **judges** review, resolve, and close them.

It is a [Turborepo](https://turbo.build/) monorepo using npm workspaces, with a
TypeScript stack (Hono API + Next.js web) and a Python AI microservice.

---

## Architecture at a glance

```bash
                       ┌──────────────────────────────┐
   Browser  ───────►   │  apps/web (Next.js 16)        │
                       │  - Better Auth (JWT/EdDSA)    │
                       │  - /api/proxy/* injects JWT   │
                       └──────────────┬───────────────┘
                                      │  Authorization: Bearer <jwt>
                                      ▼
                       ┌──────────────────────────────┐
                       │  apps/api-gateway (Hono v4)   │
                       │  Modular monolith / DDD       │
                       │  - verifies JWT via JWKS      │
                       │  - cases / documents / ai /   │
                       │    users / analytics modules  │
                       └───────┬───────────────┬───────┘
                               │               │
                   ┌───────────▼──────┐   ┌────▼─────────────────────────┐
                   │  PostgreSQL      │   │ apps/motor_asignacion_ia     │
                   │  (Drizzle ORM)   │   │ FastAPI + Random Forest      │
                   └──────────────────┘   │ POST /api/v1/asignar-juez    │
                                          └──────────────────────────────┘
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full layering, auth
flow, event bus, and AI engine integration. API endpoints are in
[`docs/API.md`](./docs/API.md).

---

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TanStack Query, Tailwind, shadcn/ui |
| API | Hono v4 (modular monolith, DDD layering) |
| Auth | Better Auth (`jwt()` plugin, EdDSA) + RBAC |
| ORM / DB | Drizzle ORM + PostgreSQL |
| Validation | Zod v4 |
| AI engine | Python · FastAPI · scikit-learn (Random Forest) |
| AI copilot | Google Gemini (drafting / Q&A / document generation) |
| Tooling | Turborepo, Biome (lint/format), Vitest, Playwright, pytest |
| Deployment | Vercel (web + api-gateway serverless) |

---

## Monorepo layout

```bash
apps/
  api-gateway/          # Hono v4 REST API — DDD/modular monolith
  web/                  # Next.js 16 + React 19 frontend
  motor_asignacion_ia/  # Python FastAPI AI judge-assignment engine
packages/
  auth/    # Better Auth config, JWT plugin, RBAC permissions (@juris-os/auth)
  db/      # Drizzle ORM client + schemas + seeds (@juris-os/db)
  env/     # @t3-oss/env typed env vars (@juris-os/env)
  ui/      # Shared shadcn/ui components (@juris-os/ui)
  config/  # Shared tsconfig + Vitest bases (@juris-os/config)
  utils/   # Shared utilities (@juris-os/utils)
```

---

## Getting started

### Prerequisites

- Node.js ≥ 18 and npm
- Docker (for the PostgreSQL container)
- Python ≥ 3.11 (only for the AI assignment engine)

### Setup

```bash
# 1. Install JS/TS dependencies
npm install

# 2. Create env files (see the table below) — at minimum:
#    .env at the repo root and per-app .env files as needed.

# 3. Start the database and apply the schema
npm run db:start
npm run db:migrate
npm run db:seed:all      # seed users, cases, and dashboard data

# 4. Run web + api-gateway in parallel
npm run dev
```

- Web app: <http://localhost:3001>
- API gateway: <http://localhost:3000>

### AI assignment engine (optional, separate process)

```bash
cd apps/motor_asignacion_ia
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# from the repo root:
uvicorn apps.motor_asignacion_ia.app.main:app --reload   # http://localhost:8000
```

See [`apps/motor_asignacion_ia/README.md`](./apps/motor_asignacion_ia/README.md).

---

## Commands

Run from the repo root unless noted otherwise.

| Command | Description |
| --- | --- |
| `npm run dev` | Start web + api-gateway in parallel |
| `npm run dev:web` | Start only the Next.js frontend |
| `npm run build` | Build all packages and apps |
| `npm run check-types` | `tsc --noEmit` across all workspaces |
| `npm run check` | Biome `check --write .` (lint + format, auto-fix) |
| `npm run test` | Run the Vitest suites (DB-free) across the monorepo |
| `npm run test:coverage` | Same, with coverage |
| `npm run db:start` / `db:stop` / `db:down` | Start / stop / destroy the Postgres container |
| `npm run db:migrate` | Apply pending Drizzle migrations |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:push` | Push schema changes without migration files |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed:all` | Seed all data (auth + cases + dashboard) |

Integration tests (real Postgres) and Python tests are run per-app — see
[`docs/TESTING.md`](./docs/TESTING.md).

---

## Environment variables

| Variable | Used by | Description |
| --- | --- | --- |
| `DATABASE_URL` | db, api-gateway, web | PostgreSQL connection string |
| `CORS_ORIGIN` | api-gateway, web | Frontend origin; api-gateway also derives the JWKS endpoint from it |
| `GEMINI_API_KEY` | api-gateway | Google Gemini key for the AI copilot / document generation |
| `MOTOR_IA_URL` | api-gateway | Base URL of the Python assignment engine (default `http://localhost:8000`) |
| `BETTER_AUTH_SECRET` | web | Better Auth signing secret (≥ 32 chars) |
| `BETTER_AUTH_URL` | web | Better Auth base URL |
| `UPLOADTHING_TOKEN` | web | UploadThing token for document uploads |
| `NEXT_PUBLIC_SERVER_URL` | web | Auth client base URL |
| `NEXT_PUBLIC_API_GATEWAY` | web | Proxy target (api-gateway origin) |

---

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — DDD layering, auth flow, event bus, AI integration
- [`docs/API.md`](./docs/API.md) — api-gateway endpoints (method, route, role, payload, response)
- [`docs/TESTING.md`](./docs/TESTING.md) — how to run each test level and what it covers
- [`docs/REQUIREMENTS.md`](./docs/REQUIREMENTS.md) — functional / non-functional requirements
- [`docs/TEST_CATALOG.md`](./docs/TEST_CATALOG.md) — per-file, per-test breakdown (what each test asserts and why)
