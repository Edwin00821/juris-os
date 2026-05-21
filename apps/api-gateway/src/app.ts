import { env } from "@juris-os/env/api-gateway";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { ZodError } from "zod";

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

app.onError((err, c) => {
	if (err instanceof ZodError) {
		return c.json(
			{
				success: false,
				error: {
					code: "VALIDATION_ERROR",
					message: "Los datos enviados no son válidos.",
					issues: err.issues.map((issue) => ({
						field: issue.path.join("."),
						message: issue.message,
					})),
				},
			},
			422,
		);
	}

	if (err instanceof HTTPException) {
		return c.json(
			{
				success: false,
				error: {
					code: "HTTP_ERROR",
					message: err.message,
				},
			},
			err.status,
		);
	}

	console.error("[UnhandledError]", err);

	return c.json(
		{
			success: false,
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
			},
		},
		500,
	);
});

app.notFound((c) => {
	return c.json(
		{
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `La ruta ${c.req.method} ${c.req.path} no existe.`,
			},
		},
		404,
	);
});

app.get("/", (c) => {
	return c.json({ success: true, data: { status: "ok" } });
});

export { app };
