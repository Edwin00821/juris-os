import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { created, fail, ok } from "./response.helper";

/**
 * Smoke test for the Phase 0 Vitest setup, exercising the response helpers
 * through a real Hono app via `app.request()` — the same pattern the Phase 2
 * integration tests will use. Verifies the ESM + Hono + Vitest toolchain works.
 */
describe("response.helper", () => {
	const app = new Hono()
		.get("/ok", (c) => ok(c, { id: "CIV-2025-0001" }))
		.get("/ok-meta", (c) => ok(c, [1, 2], 200, { total: 2 }))
		.post("/created", (c) => created(c, { id: "new" }))
		.get("/fail", (c) => fail(c, "NOT_FOUND", "Case not found", 404));

	it("ok() wraps data in the success envelope with 200", async () => {
		const res = await app.request("/ok");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			success: true,
			data: { id: "CIV-2025-0001" },
		});
	});

	it("ok() attaches meta only when provided", async () => {
		const res = await app.request("/ok-meta");
		expect(await res.json()).toEqual({
			success: true,
			data: [1, 2],
			meta: { total: 2 },
		});
	});

	it("created() returns 201", async () => {
		const res = await app.request("/created", { method: "POST" });
		expect(res.status).toBe(201);
		expect(await res.json()).toEqual({ success: true, data: { id: "new" } });
	});

	it("fail() returns the error envelope with the given status and code", async () => {
		const res = await app.request("/fail");
		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({
			success: false,
			error: { code: "NOT_FOUND", message: "Case not found" },
		});
	});
});
