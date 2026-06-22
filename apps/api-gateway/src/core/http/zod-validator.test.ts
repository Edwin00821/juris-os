import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { createCaseSchema } from "../../modules/cases/application/dtos/create-case.dto";
import { registerErrorHandlers } from "./error-handler";
import { ok } from "./response.helper";
import { validate } from "./zod-validator";

/**
 * Integration test for the validation pipeline (FR3): `validate()` middleware +
 * the global `onError` handler. Confirms an invalid payload short-circuits with
 * a 422 in the documented `fail()`-style envelope and never reaches the handler.
 */
function buildApp() {
	const app = new Hono();
	app.post("/cases", validate("json", createCaseSchema), (c) =>
		ok(c, { reached: true }),
	);
	registerErrorHandlers(app);
	return app;
}

const validBody = {
	title: "Unpaid wages",
	description: "Employer withheld salary",
	category: "labor",
	incidentDate: "2025-03-01",
	counterpartyName: "Acme Corp",
	counterpartyAddress: "123 Main St",
	counterpartyId: "RFC-9",
};

function post(app: Hono, body: unknown) {
	return app.request("/cases", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

describe("validate('json') + global error handler (FR3)", () => {
	it("passes a valid payload through to the handler", async () => {
		const res = await post(buildApp(), validBody);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			success: true,
			data: { reached: true },
		});
	});

	it("rejects an invalid payload with a 422 VALIDATION_ERROR envelope", async () => {
		const res = await post(buildApp(), { ...validBody, title: "" });

		expect(res.status).toBe(422);
		const body = (await res.json()) as {
			success: boolean;
			error: { code: string; issues: { field: string; message: string }[] };
		};
		expect(body.success).toBe(false);
		expect(body.error.code).toBe("VALIDATION_ERROR");
		expect(body.error.issues).toContainEqual({
			field: "title",
			message: "Title is required",
		});
	});

	it("reports every missing required field", async () => {
		const res = await post(buildApp(), { title: "only a title" });

		expect(res.status).toBe(422);
		const body = (await res.json()) as {
			error: { issues: { field: string }[] };
		};
		const fields = body.error.issues.map((i) => i.field).sort();
		expect(fields).toEqual(
			[
				"category",
				"counterpartyAddress",
				"counterpartyId",
				"counterpartyName",
				"description",
				"incidentDate",
			].sort(),
		);
	});
});
