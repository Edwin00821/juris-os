// Critical-flow integration test (FR3/FR4/FR7/FR8): the full case lifecycle
// driven through the real Hono app against a real Postgres database, with a
// forged-but-valid EdDSA JWT. Nothing internal is mocked — router middleware,
// PgCaseRepository, the case-number generator and the DB all run for real.
//
// Requires a running Postgres (npm run db:start). Excluded from the default
// `npm run test`; run with `npm run test:integration` from apps/api-gateway.

import { user } from "@juris-os/db/schema/auth.schema";
import { cases } from "@juris-os/db/schema/case.schema";
import { eq, inArray } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Hono } from "hono";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	type AuthHarness,
	ensureTestDatabase,
	startAuthHarness,
	TEST_DATABASE_URL,
	type TestUser,
} from "../../../test-support/integration-harness";

const citizen: TestUser = {
	id: "test-citizen-lifecycle",
	email: "citizen.lifecycle@test.local",
	role: "citizen",
};
const admin: TestUser = {
	id: "test-admin-lifecycle",
	email: "admin.lifecycle@test.local",
	role: "admin",
};
const judge: TestUser = {
	id: "test-judge-lifecycle",
	email: "judge.lifecycle@test.local",
	role: "judge",
};
const otherJudge: TestUser = {
	id: "test-judge2-lifecycle",
	email: "judge2.lifecycle@test.local",
	role: "judge",
};

const allUserIds = [citizen.id, admin.id, judge.id, otherJudge.id];

let app: Hono;
let auth: AuthHarness;
let sql: ReturnType<typeof postgres>;
let db: PostgresJsDatabase;
let tokens: {
	citizen: string;
	admin: string;
	judge: string;
	otherJudge: string;
};

// Adds the bearer token (and a JSON content-type when there is a body) to a
// request init. Method/body are supplied by the caller.
const authed = (token: string, init: RequestInit = {}): RequestInit => ({
	...init,
	headers: {
		authorization: `Bearer ${token}`,
		...(init.body ? { "content-type": "application/json" } : {}),
		...init.headers,
	},
});

const patch = (token: string, body: unknown): RequestInit =>
	authed(token, { method: "PATCH", body: JSON.stringify(body) });

beforeAll(async () => {
	await ensureTestDatabase();
	auth = await startAuthHarness();

	// Env must be in place before the app (and its db client / auth middleware)
	// is imported, so the gateway connects to the test DB and trusts our JWKS.
	process.env.DATABASE_URL = TEST_DATABASE_URL;
	process.env.CORS_ORIGIN = auth.corsOrigin;
	process.env.GEMINI_API_KEY = "test-key";
	process.env.MOTOR_IA_URL = "http://localhost:8000";
	process.env.NODE_ENV = "test";

	({ app } = await import("../../../app"));

	sql = postgres(TEST_DATABASE_URL);
	db = drizzle(sql);

	// Idempotent seed: clear any leftovers, then insert the four actors.
	await db.delete(cases).where(eq(cases.userId, citizen.id));
	await db.delete(user).where(inArray(user.id, allUserIds));
	await db.insert(user).values([
		{
			id: citizen.id,
			name: "Test Citizen",
			email: citizen.email,
			role: "citizen",
		},
		{ id: admin.id, name: "Test Admin", email: admin.email, role: "admin" },
		{
			id: judge.id,
			name: "Test Judge",
			email: judge.email,
			role: "judge",
			specialty: "criminal",
		},
		{
			id: otherJudge.id,
			name: "Other Judge",
			email: otherJudge.email,
			role: "judge",
			specialty: "family",
		},
	]);

	tokens = {
		citizen: await auth.signToken(citizen),
		admin: await auth.signToken(admin),
		judge: await auth.signToken(judge),
		otherJudge: await auth.signToken(otherJudge),
	};
});

afterAll(async () => {
	if (db) {
		await db.delete(cases).where(eq(cases.userId, citizen.id));
		await db.delete(user).where(inArray(user.id, allUserIds));
	}
	await sql?.end();
	await auth?.close();
});

// Reads the case row straight from the test DB, asserting it exists so callers
// get a non-nullable record to make assertions against.
async function loadCase(num: string) {
	const [row] = await db.select().from(cases).where(eq(cases.caseNumber, num));
	if (!row) throw new Error(`Case ${num} not found in test DB`);
	return row;
}

describe("case lifecycle (real DB + forged JWT)", () => {
	let caseNumber = "";

	it("rejects unauthenticated requests with 401", async () => {
		const res = await app.request("/cases");
		expect(res.status).toBe(401);
	});

	it("citizen creates a case (FR3) → OPEN, unassigned, real case number", async () => {
		const res = await app.request(
			"/cases",
			authed(tokens.citizen, {
				method: "POST",
				body: JSON.stringify({
					title: "Lifecycle integration case",
					description: "Created by the integration test.",
					category: "criminal",
					incidentDate: "2026-01-15",
					counterpartyName: "Acme Corp",
					counterpartyAddress: "1 Main St",
					counterpartyId: "X-123",
				}),
			}),
		);

		expect(res.status).toBe(201);
		const body = (await res.json()) as {
			success: boolean;
			data: { id: string; status: string; judgeId: string | null };
		};
		expect(body.success).toBe(true);
		expect(body.data.status).toBe("OPEN");
		expect(body.data.judgeId).toBeNull();
		expect(body.data.id).toMatch(/^CRM-\d{4}-\d{4}$/);
		caseNumber = body.data.id;

		// Persisted for real.
		const row = await loadCase(caseNumber);
		expect(row.userId).toBe(citizen.id);
		expect(row.status).toBe("OPEN");
	});

	it("lists the new case for its owner", async () => {
		const res = await app.request("/cases", authed(tokens.citizen));
		expect(res.status).toBe(200);
		const body = (await res.json()) as { data: { id: string }[] };
		expect(body.data.some((c) => c.id === caseNumber)).toBe(true);
	});

	it("forbids a non-admin from assigning a judge (403)", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/assign`,
			patch(tokens.citizen, { judgeId: judge.id }),
		);
		expect(res.status).toBe(403);
	});

	it("admin assigns the case to a judge (FR4) → UNDER_REVIEW", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/assign`,
			patch(tokens.admin, { judgeId: judge.id }),
		);
		expect(res.status).toBe(200);

		const row = await loadCase(caseNumber);
		expect(row.judgeId).toBe(judge.id);
		expect(row.status).toBe("UNDER_REVIEW");
	});

	it("rejects a second assignment (409)", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/assign`,
			patch(tokens.admin, { judgeId: otherJudge.id }),
		);
		expect(res.status).toBe(409);
	});

	it("forbids a judge who is not assigned from advancing the case (403)", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/status`,
			patch(tokens.otherJudge, { status: "PENDING_RESOLUTION" }),
		);
		expect(res.status).toBe(403);
	});

	it("assigned judge advances the case (FR7) → PENDING_RESOLUTION", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/status`,
			patch(tokens.judge, { status: "PENDING_RESOLUTION" }),
		);
		expect(res.status).toBe(200);

		const row = await loadCase(caseNumber);
		expect(row.status).toBe("PENDING_RESOLUTION");
	});

	it("assigned judge closes the case (FR8) → CLOSED + resolution persisted", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/close`,
			patch(tokens.judge, {
				resolution: "admitted",
				resolutionText: "<p>Resolved in favor of the plaintiff.</p>",
			}),
		);
		expect(res.status).toBe(200);

		const row = await loadCase(caseNumber);
		expect(row.status).toBe("CLOSED");
		expect(row.resolution).toBe("admitted");
		expect(row.resolutionText).toContain("plaintiff");
	});

	it("rejects closing an already-closed case (409)", async () => {
		const res = await app.request(
			`/cases/${caseNumber}/close`,
			patch(tokens.judge, { resolution: "rejected" }),
		);
		expect(res.status).toBe(409);
	});
});
