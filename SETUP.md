# SETUP — Juris OS

Instructions to run the project in a local environment.

---

## Prerequisites

| Tool    | Minimum version |
|---------|----------------|
| Node.js | ≥ 18           |
| npm     | bundled with Node |
| Docker  | any stable version |
| Python  | ≥ 3.11 *(only for the AI engine)* |

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Environment variables

The `.env` files **do not go at the repo root** — each app has its own.
Both apps already include a `.env.example` template; copy it and fill in the secret values.

### `apps/web/.env`

```bash
# Copy the template
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env` and fill in:

```env
NODE_ENV="development"

# Public URLs (unchanged for local dev)
NEXT_PUBLIC_SERVER_URL="http://localhost:3001"
NEXT_PUBLIC_API_GATEWAY="http://localhost:3000"

# Database — credentials come from docker-compose (unchanged for local dev)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"

# Better Auth — generate the secret with: openssl rand -base64 32
BETTER_AUTH_SECRET="<generate-a-secret-of-at-least-32-characters>"
BETTER_AUTH_URL="http://localhost:3000"

# UploadThing — get your token at https://uploadthing.com/dashboard
UPLOADTHING_TOKEN="<your-token>"
```

### `apps/api-gateway/.env`

```bash
# Copy the template
cp apps/api-gateway/.env.example apps/api-gateway/.env
```

Edit `apps/api-gateway/.env` and fill in:

```env
NODE_ENV="development"

# CORS (frontend URL)
CORS_ORIGIN="http://localhost:3001"

# Database — same credentials as docker-compose
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"

# Google Gemini — get your key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY="<your-api-key>"
```

> **Note:** `MOTOR_IA_URL` defaults to `http://localhost:8000`, so it does not need to be added unless you change the AI engine port.

---

## 3. Database

```bash
# Start the PostgreSQL container with Docker
npm run db:start

# Apply migrations
npm run db:migrate

# Seed test data (users, cases, and dashboard)
npm run db:seed:all
```

---

## 4. Run the application

```bash
# Start the frontend (Next.js) and the API Gateway (Hono) in parallel
npm run dev
```

| Service      | URL                   |
|--------------|-----------------------|
| Web (Next.js) | http://localhost:3001 |
| API Gateway  | http://localhost:3000 |

---

## 5. AI assignment engine *(optional)*

The AI engine is an independent Python microservice. It is only needed if you want to test the automatic judge-assignment feature.

```bash
cd apps/motor_asignacion_ia

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server (from the repo root)
uvicorn apps.motor_asignacion_ia.app.main:app --reload
```

The engine will be available at http://localhost:8000.

---

For more details see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and [`docs/TESTING.md`](./docs/TESTING.md).
