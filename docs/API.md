# API — Juris OS api-gateway

REST API served by `apps/api-gateway` (Hono v4). All routes are mounted at the
gateway root; in production Vercel rewrites every path to the serverless entry.

- **Base URL (local):** `http://localhost:3000`
- **Auth:** `Authorization: Bearer <jwt>` on every route except `/`. In the web
  app this header is injected by the Next.js proxy (`/api/proxy/*`); you never
  set it manually from the browser.
- **Content type:** `application/json`.

---

## Response envelope

Every JSON response uses a consistent envelope (`core/http/response.helper.ts`).

**Success** (`ok()` / `created()`):

```json
{ "success": true, "data": { ... }, "meta": { ... } }
```

`meta` is optional (used for pagination).

**Error** (`fail()` / global `onError`):

```json
{ "success": false, "error": { "code": "STRING_CODE", "message": "..." , "issues": [ ... ] } }
```

`issues` is present only for validation errors (`code: "VALIDATION_ERROR"`),
listing `{ field, message }` per failed field.

### Common status codes

| Status | When |
|--------|------|
| 200 | OK |
| 201 | Resource created |
| 401 | Missing / invalid JWT (`requireAuth`) |
| 403 | Authenticated but wrong role (`requireRole`) |
| 404 | Resource not found |
| 409 | Conflict (e.g. illegal case-status transition) |
| 422 | Zod validation failed (`VALIDATION_ERROR`) |

---

## Roles

`citizen | judge | admin` (lowercase). The **Role** column below is the role
required by `requireRole`; "any" means any authenticated user.

---

## Endpoints

### Health & identity

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/` | public | Liveness — `{ status: "ok" }` |
| GET | `/me` | any | Returns the authenticated user `{ id, email, role }` |

### Cases — `/cases`

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/cases` | any | List the caller's cases (role-scoped, paginated) |
| POST | `/cases` | any | Create a case (filed by the authenticated citizen) |
| GET | `/cases/:id` | any | Get one case by case number (e.g. `CIV-2025-0001`) |
| PATCH | `/cases/:id/assign` | admin | Assign the case to a judge |
| PATCH | `/cases/:id/status` | judge | Advance a case between active working states |
| PATCH | `/cases/:id/close` | judge | Close the case with a resolution |

**POST `/cases`** body (`createCaseSchema`):

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (required)",
  "incidentDate": "string (required)",
  "counterpartyName": "string",
  "counterpartyAddress": "string",
  "counterpartyId": "string"
}
```

**PATCH `/cases/:id/assign`** body (`assignCaseSchema`):

```json
{ "judgeId": "string (required)" }
```

**PATCH `/cases/:id/status`** body (`updateCaseStatusSchema`):

```json
{ "status": "UNDER_REVIEW | PENDING_RESOLUTION" }
```

Closing a case is a separate terminal flow (`/close`); illegal transitions
return **409**.

**PATCH `/cases/:id/close`** body (`closeCaseSchema`):

```json
{ "resolution": "admitted | conditioned | rejected", "resolutionText": "string (optional)" }
```

`resolution` defaults to `"admitted"`.

**Case response shape** (`CaseResponseDto`): `id` (case number), `uuid`,
`title`, `category`, `registrationDate`, `status`
(`OPEN | UNDER_REVIEW | PENDING_RESOLUTION | CLOSED`), `resolution`,
`resolutionText`, `judgeId`, `judgeName`, `judgeEmail`. List responses are
wrapped with `meta` carrying `totalCount` / `totalPages`.

### Documents — `/documents` and `/cases/:caseNumber/documents`

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/cases/:caseNumber/documents` | any | List documents attached to a case |
| POST | `/documents` | any | Register an uploaded document against a case |
| DELETE | `/documents/:id` | any | Delete a document |

**POST `/documents`** body (`createDocumentSchema`):

```json
{
  "caseId": "uuid (required)",
  "fileName": "string (required)",
  "fileType": "string (required)",
  "storageKey": "string (required)",
  "fileUrl": "url (required)",
  "documentType": "evidence | motion | brief | judgment | other"
}
```

`documentType` defaults to `"other"`. The file itself is uploaded via
UploadThing on the web side; this endpoint records the resulting metadata.

### AI — `/ai`

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| POST | `/ai/draft-assist` | any | Conversational help drafting a lawsuit |
| POST | `/ai/generate-document` | any | Generate a formatted document from case data |
| POST | `/ai/suggest-judge` | admin | Recommend a judge via the assignment engine |
| POST | `/ai/copilot` | judge | Q&A grounded on a case file |

**POST `/ai/draft-assist`** body (`draftAssistQuerySchema`):

```json
{
  "messages": [{ "role": "user | bot", "text": "string" }],
  "counterparty": { "name": "?", "address": "?", "id": "?" }
}
```

**POST `/ai/generate-document`** body (`generateDocumentQuerySchema`):

```json
{
  "caseData": {
    "title": "string|null", "description": "string|null", "category": "string|null",
    "incidentDate": "string|null", "counterpartyName": "string|null",
    "legalBasis": "string|null", "claims": "string|null"
  },
  "counterparty": { "name": "?", "address": "?", "id": "?" },
  "plaintiff": { "name": "?", "email": "?" }
}
```

**POST `/ai/suggest-judge`** body (`suggestJudgeQuerySchema`):

```json
{ "caseNumber": "string (required, e.g. CIV-2025-0001)" }
```

**POST `/ai/copilot`** body (`copilotQuerySchema`):

```json
{ "caseNumber": "string (required)", "question": "string (1–1000 chars)" }
```

### Users — `/users`

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/users/judges` | admin | List judges (for assignment) |

### Analytics — `/analytics`

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/analytics/dashboard` | admin | Dashboard KPIs, status distribution, monthly volume, per-judge performance |

The dashboard response (`DashboardDto`) carries `kpis` (totals, admission rate,
avg resolution days, trend %), `statusDistribution`, `monthlyVolume`, and
`judgesPerformance` (each judge tagged `optimal | alert | overloaded` by active
case count).

---

## Internal AI engine endpoint

Not part of the gateway — called server-to-server by `/ai/suggest-judge`.

| Method | Route | Service | Description |
|--------|-------|---------|-------------|
| POST | `/api/v1/asignar-juez` | `motor_asignacion_ia` (FastAPI) | Returns winner + ranked alternatives for a case given candidate judges |

Body: `{ caso: {...}, jueces: [...] }`. Returns **404** when no judge passes the
workload filter, **422** on validation errors. See
[`apps/motor_asignacion_ia/README.md`](../apps/motor_asignacion_ia/README.md).
</content>
