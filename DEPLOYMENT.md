# DEPLOYMENT — Juris OS

Information about the production environment of the application.

---

## Live application

The Juris OS platform is deployed and available at:

> **https://juris-os-web.vercel.app**

---

## Deployment platforms

| Component         | Platform | Details |
|-------------------|----------|---------|
| Frontend (web)    | Vercel   | Next.js 16 deployed as a serverless application |
| API Gateway       | Vercel   | Hono v4 exposed as serverless functions |
| AI Engine (Python)| Render   | FastAPI deployed as a web service on Render |

---

## Demo credentials

The system has three roles: **citizen**, **admin**, and **judge**.  
Demo accounts are created by running `npm run db:seed:all` locally.  
The same credentials are already active in the production environment.

| Role  | Email                   | Password         |
|-------|-------------------------|------------------|
| Admin | `admin@juris.com`       | `Admin1234!`     |
| Judge | `juez1@juris.com`       | `Juez1234!`      |
| Citizen | `ciudadano1@juris.com` | `Ciudadano1234!` |

> These are test credentials and only apply to the demo environment.

---

For technical stack details see [`README.md`](./README.md) and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
