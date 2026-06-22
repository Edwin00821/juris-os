# Test Catalog — Juris OS

A file-by-file, test-by-test breakdown: **what** each test asserts and **why**
it matters. For the higher-level view (test levels, how to run each, mocking
strategy, requirements-coverage matrix) see [`TESTING.md`](./TESTING.md).

Each test file also carries a header comment summarizing its intent, so the
"what / why / how" travels with the code as well as living here.

**Totals:** TypeScript — 51 unit (DB-free) + 10 integration (real Postgres);
Python — 33. Requirement tags (FRx / NFRx) map to [`REQUIREMENTS.md`](./REQUIREMENTS.md).

---

## TypeScript — unit tests (Vitest, no DB)

### `core/http/response.helper.test.ts` — 4 tests

Smoke test for the Vitest + Hono + ESM toolchain; also pins the response
envelope every endpoint returns. Runs the helpers through a real Hono app via
`app.request()`.

| Test | Asserts | Why |
| --- | --- | --- |
| `ok()` wraps data in the success envelope with 200 | `{ success: true, data }`, status 200 | All success responses share one shape clients can rely on |
| `ok()` attaches meta only when provided | `meta` present only when passed | Pagination/metadata is opt-in, not always emitted |
| `created()` returns 201 | status 201 + success envelope | Resource creation uses the correct HTTP semantics |
| `fail()` returns the error envelope | `{ success: false, error: { code, message } }`, given status | Errors are machine-readable (`code`) and carry the right status |

### `core/http/zod-validator.test.ts` — 3 tests (FR3)

Validation pipeline: the `validate("json")` middleware plus the global
`onError` handler, on a bare Hono app with `registerErrorHandlers`.

| Test | Asserts | Why |
| --- | --- | --- |
| passes a valid payload through | 200, handler reached | Valid input is not blocked |
| rejects an invalid payload | 422 `VALIDATION_ERROR` envelope, `{ field, message }` issues | Bad input is rejected before the handler, with a structured error |
| reports every missing required field | all missing fields listed in `issues` | Clients get the full set of problems in one round-trip |

### `core/middlewares/auth.middleware.test.ts` — 5 tests (FR1.1, FR1.2, NFR2)

`requireAuth` and `requireRole` in isolation. Env is mocked; `requireRole`
tests mount a fake authenticated user so they need no signed JWT.

| Test | Asserts | Why |
| --- | --- | --- |
| no Authorization header → 401 | 401, `success: false` | Unauthenticated requests cannot reach protected routes |
| malformed Authorization header → 401 | 401 | A non-Bearer token is rejected, not misread |
| permitted role allowed | 200 | Authorized roles are not blocked |
| forbidden role → 403 | 403, `code: FORBIDDEN` | Privilege boundaries are enforced server-side |
| any of several permitted roles allowed | 200 | Multi-role routes accept each listed role |

### `modules/cases/.../create-case.use-case.test.ts` — 2 tests (FR3)

| Test | Asserts | Why |
| --- | --- | --- |
| persists the case and maps the response DTO | OPEN, unassigned, `CRM-2025-XXXX` id, owner stored | Creation is the workflow entry point; number = traceability |
| emits `CaseCreated` | one event with creator + `aiMode: MANUAL` | Downstream modules react via the event bus, not direct calls |

### `modules/cases/.../assign-case.use-case.test.ts` — 3 tests (FR4)

| Test | Asserts | Why |
| --- | --- | --- |
| assigns a judge and emits `CaseAssigned` | judge set, event payload correct | The happy path of admin assignment |
| missing case → 404 | rejects 404, no event | Cannot assign a case that does not exist |
| already-assigned case → 409 | rejects 409, original judge untouched, no event | Assignment is one-shot; double assignment would corrupt the flow |

### `modules/cases/.../update-case-status.use-case.test.ts` — 5 tests (FR7)

| Test | Asserts | Why |
| --- | --- | --- |
| assigned judge transitions status, emits `CaseStatusChanged` | new status stored, event has prev/new | The judge's review decisions move the case forward |
| same-status call is a no-op | no event emitted | Idempotent re-submits do not spam events |
| missing case → 404 | rejects 404 | Guard against unknown cases |
| different judge → 403 | rejects 403, no event | Only the owning judge may advance the case |
| already-closed case → 409 | rejects 409 | A closed case is locked |

### `modules/cases/.../close-case.use-case.test.ts` — 4 tests (FR8)

| Test | Asserts | Why |
| --- | --- | --- |
| closes with resolution, emits `CaseClosed` | CLOSED + resolution + text stored, event correct | The terminal step records the outcome |
| missing case → 404 | rejects 404 | Guard against unknown cases |
| different judge → 403 | rejects 403, state untouched, no event | Only the owning judge may close |
| already-closed case → 409 | rejects 409, no event | Closure happens once and is irreversible |

### `modules/documents/.../create-document.use-case.test.ts` — 2 tests (FR3)

| Test | Asserts | Why |
| --- | --- | --- |
| persists the document, returns the DTO | filename/type/uploader/case, serialized `createdAt` | Documents are part of the traceable case file |
| emits `DocumentUploaded` | event has id/case/storageKey/type | Lets other modules react (e.g. future indexing) decoupled |

### `modules/documents/.../delete-document.use-case.test.ts` — 5 tests (FR3)

| Test | Asserts | Why |
| --- | --- | --- |
| missing document → 404 | rejects 404 | Guard against unknown documents |
| uploader deletes own document | removed | The author controls their upload |
| admin deletes any document | removed | Admins have full document authority |
| assigned judge deletes a case document | removed | The judge managing the case may curate its file |
| unrelated user → 403 | rejects 403, document kept | Sensitive material is protected from outsiders |

### `modules/ai/.../suggest-judge.use-case.test.ts` — 3 tests (FR4)

Engine service mocked — this verifies the seam to FastAPI, not the scoring.

| Test | Asserts | Why |
| --- | --- | --- |
| forwards case + judges, returns engine result | engine called with exact payload shape, result returned verbatim | The contract with the assignment engine is correct |
| missing case → 404 | rejects 404, engine not called | Pre-flight guard before the network hop |
| empty judge list → 404 | rejects 404, engine not called | No point asking the engine with no candidates |

### `modules/ai/.../query-copilot.use-case.test.ts` — 2 tests (FR6)

Gemini copilot service mocked.

| Test | Asserts | Why |
| --- | --- | --- |
| passes question + case documents to the copilot | service called with question + document payload | Orchestration gathers the right context |
| closed case → 409 | rejects 409, copilot not called | No copilot queries on a closed case |

### `modules/ai/.../generate-document.use-case.test.ts` — 2 tests (FR2.1)

Gemini generation service mocked.

| Test | Asserts | Why |
| --- | --- | --- |
| delegates and returns the document | service called with dto, document returned unchanged | The thin delegation contract holds |
| propagates service errors | error bubbles up | Failures are not swallowed |

### `modules/cases/.../case-number.generator.test.ts` — 4 tests (FR3)

`@juris-os/db/server` mocked so the max-sequence query is deterministic.

| Test | Asserts | Why |
| --- | --- | --- |
| starts at 0001 | first case of a category/year is `...-0001` | Sequences are year/category-scoped |
| increments + zero-pads | max 41 → `0042` | Sequential, human-readable numbering |
| maps each category to its prefix | CRM / FAM / LAB | The prefix encodes the case category |
| keeps padding past 9999 | 12344 → `12345` | Numbering does not break at five digits |

### `packages/utils/src/auth.test.ts` — 4 tests (NFR2)

argon2 password helpers, round-trip (digest not asserted — it is salted).

| Test | Asserts | Why |
| --- | --- | --- |
| produces a salted hash ≠ plaintext | hash differs, `$argon2` prefix | Passwords are never stored in clear |
| different hash each call | two hashes differ | Random salt defeats rainbow tables |
| verifies a matching password | `true` | Correct credentials authenticate |
| rejects a non-matching password | `false` | Wrong credentials are refused |

### `apps/web/src/lib/utils.test.ts` — 3 tests

Web-side Vitest smoke test on the pure `getInitials` helper (no DOM).

| Test | Asserts | Why |
| --- | --- | --- |
| empty input → empty string | `""` for undefined/empty | Defensive default for avatars |
| first letters of first two words | `"Ada Lovelace"` → `AL` | Two-initial avatar behavior |
| single-word name | `"Cher"` → `C` | Handles one-word names |

---

## TypeScript — integration test (Vitest + real Postgres)

### `modules/cases/interface/cases.lifecycle.integration.test.ts` — 10 tests (FR3/4/7/8)

The full case lifecycle through the real Hono app against a real test database,
with a forged-but-valid EdDSA JWT minted by the harness. Nothing internal is
mocked. Excluded from `npm run test`; run with `npm run test:integration`
(needs `npm run db:start`).

| Test | Asserts | Why |
| --- | --- | --- |
| unauthenticated request → 401 | 401 | The stack enforces auth end-to-end |
| citizen creates a case (FR3) | 201, OPEN, unassigned, real `CRM-` number, row persisted | Creation works through every layer + DB |
| lists the new case for its owner | case appears in the owner's list | Persistence + ownership filtering |
| non-admin assign → 403 | 403 | Role guard holds over HTTP |
| admin assigns the case (FR4) | 200, judge set, status `UNDER_REVIEW`, row updated | Assignment persists for real |
| second assignment → 409 | 409 | Conflict guard holds at the DB layer |
| unassigned judge advances → 403 | 403 | Ownership guard holds over HTTP |
| assigned judge advances (FR7) | 200, status `PENDING_RESOLUTION`, row updated | Status transition persists |
| assigned judge closes (FR8) | 200, CLOSED + resolution text persisted | Closure persists |
| close an already-closed case → 409 | 409 | Idempotency lock holds at the DB layer |

---

## Python — AI assignment engine (pytest)

### `tests/test_heuristica.py` — 11 tests (FR4)

The weighted-scoring heuristic. Score = `specialty(0/100)*0.6 +
(100 - workload_pct)*0.4`, rounded to 2 decimals; workload > 90% is excluded.

**`TestCalcularScoreJuez` (single judge, 6)**

| Test | Asserts | Why |
| --- | --- | --- |
| specialty match applies 60/40 weighting | workload 45 + match → 82.0 | The core scoring formula |
| mismatch scores only availability | mismatch → 36.0 | Specialty contributes 0 when it differs |
| hard filter excludes overloaded judge | workload 92 → 0.0 | Overloaded judges are never proposed |
| boundary exactly 90% still scored | 90.0 → 64.0 | The cutoff is strict `>`, not `>=` |
| boundary just above 90% excluded | 90.01 → 0.0 | Confirms the strict cutoff from the other side |
| score rounded to two decimals | 33.333 → 26.67 | Stable, comparable scores |

**`TestSugerirJuecesHeuristica` (ranking, 5)**

| Test | Asserts | Why |
| --- | --- | --- |
| overloaded judge filtered out | J-002 absent, 4 remain | The filter applies to the whole list |
| results sorted by score descending | scores in descending order | Best candidate surfaces first |
| best match ranked first | Family specialist (88.0) is #1 | End-to-end ranking is correct |
| each result includes a justification | non-empty justification, top one says "coincide" | Recommendations are explainable |
| empty judge list → empty | `[]` | Degenerate input is safe |

### `tests/test_ml_predict.py` — 10 tests (FR4)

The Random Forest hybrid layer. Shape/behavior tests use the real `.pkl`;
parsing/sorting tests stub the predictor to isolate the orchestration logic.

**`TestPredecirTiempoResolucion` (real model, 4)**

| Test | Asserts | Why |
| --- | --- | --- |
| returns a positive float, 2 decimals | type/`>0`/rounding | The model output is well-formed |
| match resolves no slower than mismatch | match < mismatch | Sanity-checks what the model learned |
| predictions are deterministic | same input → same output | Reproducible recommendations |
| model failed to load → 0.0 | returns 0.0 (no raise) | Graceful degradation if the `.pkl` is missing |

**`TestObtenerMejorAsignacionHibrida` (re-ranking, 6)**

| Test | Asserts | Why |
| --- | --- | --- |
| each candidate enriched with estimated time | `tiempo_estimado_dias` added, original fields kept | The hybrid step augments without losing data |
| empty candidate list → empty | `[]` | Degenerate input is safe |
| parses match flag + workload from justification | predictor called with parsed values | The orchestrator reads the heuristic's string correctly |
| default complexity 3 when omitted | predictor gets `complejidad=3` | Sensible default for incomplete cases |
| ties on score break toward lower time | faster judge ranks first | Tie-breaker prefers quicker resolution |
| higher score ranks first regardless of time | higher idoneidad wins | Score dominates the estimated time |

### `tests/test_api.py` — 12 tests (FR4)

`POST /api/v1/asignar-juez` end-to-end via FastAPI `TestClient`, replaying the
four `pruebas/*.json` payloads the backend actually sends, plus error cases.

**`TestHealthCheck` (1)** — root reports `status: online`.

**`TestAsignarJuezScenarios` (8)**

| Test | Asserts | Why |
| --- | --- | --- |
| each of 4 scenarios returns a well-formed proposal | 200, echoes `caso_id`, has `ganador` + `alternativas` with required keys | The real payloads produce a valid contract |
| winner is the specialist with low workload | `script_prueba.json` → J-004 | Specialty + availability win as designed |
| overloaded judges excluded from results | `script_prueba1.json` → J-008 (95%) absent | The cap applies through the API |
| winner outranks every alternative | winner score ≥ all alternatives | Ranking is consistent in the response |
| falls back to available non-specialists when specialists saturated | `script_prueba3.json` → non-specialist winner, not 404 | The engine degrades gracefully rather than failing |

**`TestAsignarJuezErrors` (3)**

| Test | Asserts | Why |
| --- | --- | --- |
| all judges overloaded → 404 | 404 | No assignable judge is an explicit error, not a guess |
| missing required case fields → 422 | 422 | Request validation rejects incomplete cases |
| non-numeric workload → 422 | 422 | Type validation rejects bad judge data |

---

## How to extend this catalog

When you add a test, add (or update) its file's header comment and the matching
row here. Keep the "Why" column focused on the business/quality reason, not the
mechanics — the mechanics live in the test code and `TESTING.md`.
