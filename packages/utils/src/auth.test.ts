import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./auth";

/**
 * Round-trip tests for the argon2 password helpers (NFR2 — security). They
 * confirm the wrapper hashes and verifies consistently without asserting the
 * exact digest, which is salted and non-deterministic by design.
 */
describe("password hashing", () => {
	it("produces a salted hash that differs from the plaintext", async () => {
		const hash = await hashPassword("correct horse battery staple");
		expect(hash).not.toBe("correct horse battery staple");
		expect(hash.startsWith("$argon2")).toBe(true);
	});

	it("produces a different hash each call (random salt)", async () => {
		const a = await hashPassword("same-password");
		const b = await hashPassword("same-password");
		expect(a).not.toBe(b);
	});

	it("verifies a matching password", async () => {
		const hash = await hashPassword("s3cret");
		expect(await verifyPassword({ password: "s3cret", hash })).toBe(true);
	});

	it("rejects a non-matching password", async () => {
		const hash = await hashPassword("s3cret");
		expect(await verifyPassword({ password: "wrong", hash })).toBe(false);
	});
});
