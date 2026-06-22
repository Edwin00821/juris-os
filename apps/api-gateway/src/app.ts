import { env } from "@juris-os/env/api-gateway";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { registerErrorHandlers } from "./core/http/error-handler";
import { requireAuth } from "./core/middlewares/auth.middleware";
import { aiRouter } from "./modules/ai/interface/ai.router";
import { analyticsRouter } from "./modules/analytics/interface/analytics.router";
import { casesRouter } from "./modules/cases/interface/cases.router";
import { caseDocumentsRouter } from "./modules/documents/interface/case-documents.router";
import { documentsRouter } from "./modules/documents/interface/documents.router";
import { usersRouter } from "./modules/users/interface/users.router";

const app = new Hono();

app.use(logger());

app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

registerErrorHandlers(app);

app.get("/me", requireAuth, (c) => {
	return c.json({ success: true, data: c.get("user") });
});

app.get("/", (c) => {
	return c.json({ success: true, data: { status: "ok" } });
});

app.route("/cases", casesRouter);
app.route("/cases/:caseNumber/documents", caseDocumentsRouter);
app.route("/documents", documentsRouter);
app.route("/ai", aiRouter);
app.route("/users", usersRouter);
app.route("/analytics", analyticsRouter);

export { app };
