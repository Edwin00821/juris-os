# Architecture — Juris OS

This document describes how Juris OS is structured: the api-gateway's DDD
layering, the authentication flow, the in-memory event bus, and how the AI
pieces integrate. For endpoint-level detail see [`API.md`](./API.md).

---

## 1. System overview

Three deployable units plus shared packages:

| Unit | Tech | Responsibility |
| ------ | ------ | ---------------- |
| `apps/web` | Next.js 16 / React 19 | UI, Better Auth, authenticating proxy to the API |
| `apps/api-gateway` | Hono v4 | Business logic, persistence, AI orchestration |
| `apps/motor_asignacion_ia` | FastAPI / scikit-learn | Judge-assignment recommendation engine |

The web app never talks to the database for business data — it calls the
api-gateway through an authenticating proxy. The api-gateway owns all writes to
PostgreSQL and is the only caller of the Python engine and Google Gemini.

```bash
web (Next.js)  ──proxy+JWT──►  api-gateway (Hono)  ──►  PostgreSQL
                                      │
                                      ├──►  motor_asignacion_ia (FastAPI)
                                      └──►  Google Gemini
```

---

## 2. api-gateway: modular monolith + DDD

The Hono app is a **modular monolith** following **DDD layering**. Each feature
lives under `src/modules/<name>/` with four layers, dependencies pointing inward:

```bash
modules/<name>/
  domain/             # Types, value objects — no imports from other layers
  application/
    dtos/             # Zod schemas (request) + response DTO mappers
    use-cases/        # Orchestrate domain + repository, emit domain events
  infrastructure/
    repositories/     # I<X>Repository interface + Pg<X>Repository implementation
  interface/
    <name>.router.ts      # Hono router — wires middleware + controller
    <name>.controller.ts  # Thin: reads context/query, calls use-case, returns helper
```

### **Rules**

- `domain/` imports nothing from other layers.
- `interface/` (controllers) stay thin: read `c.get("user")` / params, call a
  use-case, return a response helper. No business logic, no validation here.
- Validation happens in router middleware via `validate("json", schema)`, never
  inside a handler.
- Repositories are defined as an **interface** first (`ICaseRepository`) with a
  Drizzle-backed implementation (`PgCaseRepository`). This is the seam used by
  unit tests, which inject in-memory fakes.

### Modules

| Module | Endpoints (prefix) | Purpose |
| -------- | -------------------- | --------- |
| `cases` | `/cases` | Create, list, assign, advance status, close cases |
| `documents` | `/documents`, `/cases/:caseNumber/documents` | Attach / list / delete case documents |
| `ai` | `/ai` | Drafting copilot, document generation, judge suggestion, judge Q&A |
| `users` | `/users` | List judges (admin) |
| `analytics` | `/analytics` | Admin dashboard KPIs |

### Core utilities (`src/core/`)

- `http/response.helper.ts` — `ok()`, `created()`, `fail()`. **All JSON
  responses go through these** for a consistent envelope.
- `http/zod-validator.ts` — `validate(target, schema)` middleware. Throws
  `ZodError` on failure, handled globally.
- `http/error-handler.ts` — `registerErrorHandlers(app)` wires the global
  `onError` (maps `HTTPException` / `ZodError` to the `fail()` envelope) and
  `notFound`. Extracted so a bare test app can mount error behaviour without the
  DB-bound routers.
- `middlewares/auth.middleware.ts` — `requireAuth` (JWKS JWT verification) and
  `requireRole(...roles)`.
- `events/event-bus.ts` — the in-memory `eventBus` singleton (see §4).

### Build & deploy

- Build: `tsup src/index.ts --format esm --clean` → `dist/`.
- Local dev entry: `src/index.ts` (`@hono/node-server`, port 3000).
- Vercel entry: `api/index.ts` (`hono/vercel`), with `vercel.json` rewriting all
  routes to it.

---

## 3. Authentication flow

Auth is owned by **Better Auth**, which runs *inside the Next.js app*. The
api-gateway is a pure resource server that trusts JWTs verified against Better
Auth's JWKS.

```bash
1. Browser ──► Next.js  /api/auth/[...all]        (Better Auth, jwt() plugin, EdDSA)
2. Client calls api-client ──► /api/proxy/[...path]
3. Proxy calls auth.api.getSession(), reads the `set-auth-jwt` header,
   forwards  Authorization: Bearer <jwt>  to the api-gateway.
4. Hono requireAuth verifies the JWT via JWKS at {CORS_ORIGIN}/api/auth/jwks.
5. c.get("user")  ==  { id, email, role }
```

### **Key points**

- The proxy is the only place a token is handled; client components never see it.
- `requireAuth` populates `c.get("user")`. **Never trust a userId from the
  request body** — always use `c.get("user").id`.
- `requireRole(...roles)` runs after `requireAuth` and returns **403** if the
  authenticated role is not in the allowed set.
- Roles are `citizen | judge | admin` (lowercase, as stored by Better Auth).
- RBAC permissions are declared in `packages/auth/src/auth-permissions.ts` using
  Better Auth's `createAccessControl`.

---

## 4. Event bus (inter-module communication)

Modules **never import each other directly**. They communicate only through the
in-memory typed `eventBus` singleton (`src/core/events/event-bus.ts`):

```ts
eventBus.emit({ type: "CaseCreated", ... });
eventBus.on("CaseCreated", (event) => { ... });
```

`event-types.ts` holds the `DomainEvent` discriminated union. This keeps the
modules decoupled and makes the choreography testable (use-case tests spy on
`eventBus.emit`).

> Note: transactional-outbox / notifications / DLQ patterns are a planned
> evolution; the current event bus is in-memory only.

---

## 5. AI integration

Two distinct AI capabilities, both orchestrated by the `ai` module:

### 5.1 Judge assignment engine (`motor_asignacion_ia`)

A Python FastAPI service exposing `POST /api/v1/asignar-juez`. The api-gateway's
`suggest-judge` use-case gathers the case + candidate judges and calls this
service (base URL `MOTOR_IA_URL`). The engine combines:

1. **Heuristic filter** — a weighted score per judge:
   `specialty(0/100)*0.6 + (100 - workload_pct)*0.4`, rounded to 2 decimals;
   judges with workload > 90% are hard-filtered out.
2. **Random Forest refinement** — a trained `.pkl` model predicts estimated
   resolution time to re-rank the heuristic candidates.

It returns a winner plus ranked alternatives. See
[`apps/motor_asignacion_ia/README.md`](../apps/motor_asignacion_ia/README.md).

### 5.2 Generative copilot (Google Gemini)

The `ai` module also wraps Google Gemini (`GEMINI_API_KEY`) for:

- **draft-assist** — conversational help while a citizen drafts a lawsuit.
- **generate-document** — turn structured case data into a formatted document.
- **copilot** — judge-only Q&A grounded on a case file.

These are isolated behind service modules so they can be mocked in unit tests.

---

## 6. Database

`packages/db` exposes two entry points for the two env contexts:

- `@juris-os/db/server` → api-gateway env (Hono)
- `@juris-os/db/web` → web env (Better Auth inside Next.js)

Schemas live in `packages/db/src/schema/`:

- `auth.schema.ts` — Better Auth tables (users, sessions, accounts, jwks…)
- `case.schema.ts` — cases + enums (category, status) + the case-number sequence

Case numbers follow `CIV-2025-0001`, generated by `case-number.generator.ts`
using a PostgreSQL sequence (prefix derived from category, year, zero-padded
sequence number).

---

## 7. Web app structure

Route groups separate roles:

```bash
app/
  (app)/          # Protected layout — redirects to /sign-in without a session
    admin/        # guarded by guardAdmin()
    judge/
    citizen/
  (auth)/         # sign-in, sign-up
  api/
    auth/[...all]/    # Better Auth handler
    proxy/[...path]/  # authenticating proxy to the api-gateway
```

- **Module pattern** (`src/modules/<name>/`): `components/`, `hooks/`, `pages/`,
  `types/`. Pages under `app/` are thin shells that call a `guard*()` and render
  the module's page component.
- **Data fetching**: TanStack Query; all calls go through `src/lib/api-client.ts`
  → `/api/proxy/*` (the proxy injects the JWT).
- **Auth client**: `src/lib/auth-client.ts` (`better-auth/react` + `adminClient`).
</content>
