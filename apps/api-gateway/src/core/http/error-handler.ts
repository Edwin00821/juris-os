import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

/**
 * Registers the global `onError` and `notFound` handlers on a Hono app.
 *
 * Extracted from `app.ts` so the error-translation behaviour (ZodError → 422,
 * HTTPException → its status, anything else → 500) can be mounted on a bare app
 * in integration tests without importing the DB-bound routers.
 */
export function registerErrorHandlers(app: Hono): void {
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
			if (err.status >= 500) {
				console.error(
					`[HTTPException ${err.status}]`,
					err.message,
					err.cause ?? "",
				);
			}
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
}
