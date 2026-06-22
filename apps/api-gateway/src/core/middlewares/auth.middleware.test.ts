import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { registerErrorHandlers } from "../http/error-handler";
import { ok } from "../http/response.helper";

// The middleware module builds the `jwk` verifier from env at load time, so the
// env module is mocked to avoid requiring real secrets in the test runner.
vi.mock("@juris-os/env/api-gateway", () => ({
	env: { CORS_ORIGIN: "http://localhost:3001" },
}));

import type { AuthUser } from "./auth.middleware";
import { requireAuth, requireRole } from "./auth.middleware";

describe("requireAuth (FR1.1, NFR2)", () => {
	function buildApp() {
		const app = new Hono();
		app.get("/protected", requireAuth, (c) => ok(c, { ok: true }));
		registerErrorHandlers(app);
		return app;
	}

	it("rejects a request with no Authorization header (401)", async () => {
		const res = await buildApp().request("/protected");

		expect(res.status).toBe(401);
		const body = (await res.json()) as { success: boolean };
		expect(body.success).toBe(false);
	});

	it("rejects a malformed Authorization header (401)", async () => {
		const res = await buildApp().request("/protected", {
			headers: { Authorization: "Token abc" },
		});

		expect(res.status).toBe(401);
	});
});

describe("requireRole (FR1.2, NFR2)", () => {
	// Mounts a fake authenticated user, then guards the route by role — exercises
	// requireRole in isolation without needing a signed JWT.
	function buildApp(user: AuthUser, ...roles: AuthUser["role"][]) {
		const app = new Hono();
		app.use("/*", async (c, next) => {
			c.set("user", user);
			await next();
		});
		app.get("/guarded", requireRole(...roles), (c) => ok(c, { ok: true }));
		registerErrorHandlers(app);
		return app;
	}

	const admin: AuthUser = { id: "a", email: "a@x.io", role: "admin" };
	const citizen: AuthUser = { id: "c", email: "c@x.io", role: "citizen" };

	it("allows a user whose role is permitted", async () => {
		const res = await buildApp(admin, "admin").request("/guarded");
		expect(res.status).toBe(200);
	});

	it("forbids a user whose role is not permitted (403)", async () => {
		const res = await buildApp(citizen, "admin").request("/guarded");

		expect(res.status).toBe(403);
		const body = (await res.json()) as { error: { code: string } };
		expect(body.error.code).toBe("FORBIDDEN");
	});

	it("allows any of several permitted roles", async () => {
		const res = await buildApp(citizen, "admin", "citizen").request("/guarded");
		expect(res.status).toBe(200);
	});
});
