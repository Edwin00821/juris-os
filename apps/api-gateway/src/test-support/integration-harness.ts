// Shared infrastructure for the real-Postgres integration tests.
//
// These tests exercise the full Hono stack (router → middleware → controller →
// use-case → PgCaseRepository) against a throwaway `juris_os_test` database and
// a forged-but-valid EdDSA JWT, so nothing here mocks the app internals.
//
// Two moving parts:
//   1. ensureTestDatabase() — creates `juris_os_test` (if missing) and runs the
//      Drizzle migrations into it. Idempotent: safe to call before every run.
//   2. startAuthHarness() — spins up a tiny HTTP server that serves a JWKS
//      document containing a public key we control, and hands back a `signToken`
//      that mints JWTs the gateway's `requireAuth` (which fetches that JWKS) will
//      accept. Point `CORS_ORIGIN` at this server before importing the app.

import { createServer, type Server } from "node:http";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { type CryptoKey, exportJWK, generateKeyPair, SignJWT } from "jose";
import postgres from "postgres";

// Credentials mirror packages/db/docker-compose.yml. Override via TEST_* env
// vars (e.g. in CI) without touching any .env file.
const PG_HOST = process.env.TEST_PG_HOST ?? "localhost";
const PG_PORT = process.env.TEST_PG_PORT ?? "5432";
const PG_USER = process.env.TEST_PG_USER ?? "postgres";
const PG_PASS = process.env.TEST_PG_PASSWORD ?? "password";
const TEST_DB_NAME = process.env.TEST_PG_DATABASE ?? "juris_os_test";

export const TEST_DATABASE_URL =
	process.env.TEST_DATABASE_URL ??
	`postgres://${PG_USER}:${PG_PASS}@${PG_HOST}:${PG_PORT}/${TEST_DB_NAME}`;

// The default maintenance database is always present; we connect here only to
// issue CREATE DATABASE for the test database.
const ADMIN_URL = `postgres://${PG_USER}:${PG_PASS}@${PG_HOST}:${PG_PORT}/postgres`;

const MIGRATIONS_FOLDER = fileURLToPath(
	new URL("../../../../packages/db/src/migrations", import.meta.url),
);

// Creates the test database if it does not exist, then applies all migrations.
export async function ensureTestDatabase(): Promise<void> {
	const admin = postgres(ADMIN_URL, { max: 1 });
	try {
		const existing = await admin`
			SELECT 1 FROM pg_database WHERE datname = ${TEST_DB_NAME}
		`;
		if (existing.length === 0) {
			await admin.unsafe(`CREATE DATABASE "${TEST_DB_NAME}"`);
		}
	} finally {
		await admin.end();
	}

	const migrationClient = postgres(TEST_DATABASE_URL, { max: 1 });
	try {
		await migrate(drizzle(migrationClient), {
			migrationsFolder: MIGRATIONS_FOLDER,
		});
	} finally {
		await migrationClient.end();
	}
}

export interface TestUser {
	id: string;
	email: string;
	role: "citizen" | "judge" | "admin";
}

export interface AuthHarness {
	// Base URL to assign to CORS_ORIGIN; requireAuth fetches its JWKS from here.
	corsOrigin: string;
	// Mints a JWT the gateway will accept for the given user.
	signToken: (user: TestUser) => Promise<string>;
	close: () => Promise<void>;
}

// Stands up a JWKS endpoint backed by a freshly generated EdDSA key pair and
// returns a signer for that key. Matches the gateway's expectations: EdDSA alg
// at `${CORS_ORIGIN}/api/auth/jwks`, with `sub`/`email`/`role` claims.
export async function startAuthHarness(): Promise<AuthHarness> {
	const { publicKey, privateKey } = await generateKeyPair("EdDSA", {
		extractable: true,
	});
	const jwk = await exportJWK(publicKey);
	jwk.kid = "test-key";
	jwk.alg = "EdDSA";
	jwk.use = "sig";
	const jwksBody = JSON.stringify({ keys: [jwk] });

	const server: Server = createServer((req, res) => {
		if (req.url?.includes("/api/auth/jwks")) {
			res.writeHead(200, { "content-type": "application/json" });
			res.end(jwksBody);
			return;
		}
		res.writeHead(404);
		res.end();
	});

	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	const port = typeof address === "object" && address ? address.port : 0;

	return {
		corsOrigin: `http://127.0.0.1:${port}`,
		signToken: (user) =>
			new SignJWT({ email: user.email, role: user.role })
				.setProtectedHeader({ alg: "EdDSA", kid: "test-key" })
				.setSubject(user.id)
				.setIssuedAt()
				.setExpirationTime("1h")
				.sign(privateKey as CryptoKey),
		close: () => new Promise<void>((resolve) => server.close(() => resolve())),
	};
}
