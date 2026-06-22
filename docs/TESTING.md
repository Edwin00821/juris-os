# Testing — Juris OS

How the test suite is organized, how to run each level, what it covers, the
mocking strategy, and how to add a new test. For a file-by-file, test-by-test
breakdown of what every individual case asserts and why, see
[`TEST_CATALOG.md`](./TEST_CATALOG.md).

---

## Test levels

| Level | Stack | Runner | DB? | Count |
| ------- | ------- | -------- | ----- | ------- |
| Unit (TS) | api-gateway, web, packages | Vitest | no (mocked repos) | 51 |
| Integration (TS) | api-gateway lifecycle | Vitest | **yes** (Postgres in Docker) | 10 |
| Unit + API (Python) | motor_asignacion_ia | pytest | no | 33 |
| E2E (web) | apps/web | Playwright | seeded DB + both apps | smoke only* |

\* Phase 3 role flows (citizen / admin / judge) are planned; today only a smoke
spec is wired. See the plan for the remaining E2E work.

---

## Running the tests

### TypeScript unit tests (fast, DB-free)

From the repo root:

```bash
npm run test            # turbo test — runs every workspace's Vitest suite
npm run test:coverage   # same, with V8 coverage
```

Per workspace:

```bash
cd apps/api-gateway && npm run test          # 44 tests
cd apps/api-gateway && npm run test:watch    # watch mode
```

These never touch the database or network — repositories and AI services are
mocked. They are the suite that runs in `turbo test` and should stay fast.

### TypeScript integration tests (real Postgres)

A separate Vitest project (`vitest.integration.config.ts`) kept **out** of
`npm run test` so the default run stays DB-free. It drives the full Hono stack
against a real test database with a forged JWT.

```bash
cd apps/api-gateway
npm run db:start          # Postgres in Docker (from repo root: npm run db:start)
npm run test:integration  # 10 tests — full case lifecycle
```

The harness (`src/test-support/integration-harness.ts`) creates the
`juris_os_test` database, runs the Drizzle migrations, and stands up a local
JWKS server that mints accepted EdDSA tokens — so no production code needs a DI
seam. Env (`DATABASE_URL`, `CORS_ORIGIN`, `GEMINI_API_KEY`) is set **before** the
app is dynamically imported, so the gateway binds to the test DB and trusts the
forged tokens.

### Python tests (AI engine)

```bash
cd apps/motor_asignacion_ia
python -m venv venv && source venv/bin/activate   # first time
pip install -r requirements.txt
python -m pytest -v       # 33 tests
```

### E2E (Playwright)

```bash
cd apps/web
npx playwright test       # requires both apps running + a seeded DB (npm run db:seed:all)
```

---

## What each suite covers

### Python — `apps/motor_asignacion_ia/tests/` → FR4

- **`test_heuristica.py`** (11) — the weighted heuristic: hard filter for
  workload > 90 % (score 0), specialty match vs. mismatch, the 60/40 weighting
  (`specialty*0.6 + (100 - workload_pct)*0.4`, 2-decimal rounding), and
  candidate ordering.
- **`test_ml_predict.py`** (10) — hybrid inference: the real `.pkl` model plus a
  stubbed predictor to assert response shape and ranking.
- **`test_api.py`** (12) — `POST /api/v1/asignar-juez` via FastAPI `TestClient`,
  replaying the four `pruebas/*.json` scenarios plus error cases (404 when all
  judges are overloaded, 422 validation).

### TypeScript unit — use-cases with in-memory repositories

- **cases** (`create`, `assign`, `update-status`, `close`) → FR3/4/7/8. A shared
  `FakeCaseRepository` + `makeCase` helper in `cases/test-support.ts`;
  `eventBus.emit` is spied to assert domain events.
- **documents** (`create`, `delete`) → FR3. `FakeDocumentRepository` +
  `makeDocument` in `documents/test-support.ts`.
- **ai** (`suggest-judge` with a mock engine service; `query-copilot` and
  `generate-document` with the Gemini service mocked) → FR2.1/4/6.
- **case-number generator** (mock `@juris-os/db/server`) → FR3, asserting the
  `CIV-2025-0001` format.
- **packages/utils** — argon2 hash round-trip → NFR2.

### TypeScript core / middleware

- **auth.middleware** (5) → FR1.1/1.2, NFR2 — `requireAuth` rejects missing /
  malformed JWTs (401); `requireRole` allows permitted roles and forbids others
  (403). Env is mocked.
- **zod-validator** (3) → FR3 — invalid payload yields a **422**
  `VALIDATION_ERROR` envelope; a valid payload passes through.
- **response.helper** (4) — the `ok()` / `created()` / `fail()` envelope shape.

### TypeScript integration — `cases.lifecycle.integration.test.ts` → FR3/4/7/8

Full stack via `app.request()` against the real test DB: citizen creates → lists
→ admin assigns → judge advances → judge closes, plus the 401/403/409 guards,
asserting the persisted rows at each step.

---

## Requirements coverage

Mirrors the §2 traceability matrix of the plan, updated as tests landed.

| Req | Summary | Test level(s) | Status |
| ----- | --------- | --------------- | -------- |
| FR1.1 | Citizen registration / auth | Integration (auth middleware) | ✅ |
| FR1.2 | Role management / privilege | Unit + Integration (`requireRole`) | ✅ |
| FR2.1 | AI-assisted drafting | Unit (use-case, mock Gemini) | ✅ |
| FR2.2 | Defendant party identification | — (no defendant email) | 🟡 |
| FR3 | Case file generation + traceability | Unit (number gen) + Integration | ✅ |
| FR4 | Intelligent case assignment | Unit (heuristic/ML) + API (Python) + Integration | ✅ |
| FR5 | Multi-channel notifications | — | ❌ out of scope (not implemented) |
| FR6 | Document analysis / semantic search | Unit (mock) | 🟡 |
| FR7 | Preliminary review (admit/condition/reject) | Unit (status transitions) + Integration | ✅ |
| FR8 | Resolution issuance + closure | Unit (close use-case) + Integration | ✅ |
| FR9 | Analytics & reports | — (DTO builder pure-tested indirectly) | 🟡 |
| NFR2 | Robust auth / password hashing | Unit (argon2) + auth integration | ✅ |

**Known gaps** (reported, not silently skipped):

- **FR5 notifications** is unimplemented — the biggest functional gap.
- **FR2.2** lacks the defendant email required for notifications (depends on FR5).
- **NFR1 at-rest encryption** and **NFR6 performance** are not verifiable in code
  today; documented as targets.

---

## Mocking strategy

- **Repositories** — unit tests inject in-memory fakes (`FakeCaseRepository`,
  `FakeDocumentRepository`) through the `I<X>Repository` interface seam. No DB.
- **AI engine (`motor_asignacion_ia`)** — the `suggest-judge` use-case is tested
  with a mock engine service so no FastAPI process is needed.
- **Google Gemini** — the Gemini service module is replaced with
  `vi.mock` / `vi.hoisted` so `generate-document` / `query-copilot` never hit the
  network.
- **`@juris-os/db/server`** — mocked in the case-number generator test to assert
  formatting without a database.
- **Auth** — unit middleware tests mock env; the integration harness mints real
  EdDSA tokens against a local JWKS server (a forged-but-valid JWT).
- **Python** — `test_ml_predict.py` stubs the predictor for shape/order checks
  while still exercising the real heuristic; `test_api.py` uses FastAPI's
  `TestClient` (no live server).

---

## How to add a test

1. **Pick the level.** Business rule in a use-case → unit (mock the repo).
   Cross-layer HTTP behaviour that needs persistence → integration. AI heuristic
   → Python.
2. **Location & naming.** Co-locate next to the code under test as
   `<name>.test.ts` (Vitest) or `tests/test_<name>.py` (pytest). Integration
   tests use `*.integration.test.ts` and live behind `vitest.integration.config.ts`.
3. **Reuse the helpers.** Use the module's `test-support.ts`
   (`FakeCaseRepository` / `makeCase`, `FakeDocumentRepository` / `makeDocument`)
   rather than re-deriving fixtures.
4. **Mock at the seam.** Inject a fake repository / service; use `vi.mock` for
   external modules (Gemini, `@juris-os/db/server`). Spy `eventBus.emit` to
   assert domain events.
5. **Keep `npm run test` DB-free.** Anything needing Postgres goes in the
   integration project, not the default run.
6. **Run it.** `npm run test` (or `npm run test:integration` / `pytest`) and
   confirm green before committing.
</content>
