/**
 * Unit tests for generateCaseNumber (FR3 — case numbering / traceability).
 *
 * What: case numbers follow <PREFIX>-<YEAR>-<NNNN>; numbering starts at 0001 per
 * category/year, increments from the current max sequence, maps each category to
 * its prefix (CRM/FAM/LAB) and keeps four-digit zero-padding past 9999.
 * Why: the case number is the human-facing, year-scoped identifier; correct
 * sequencing and formatting are what make a case referenceable.
 * How: @juris-os/db/server is mocked so the max-sequence query returns a fixed
 * value — formatting/sequencing is asserted without a database.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Hoisted so the `vi.mock` factory (which is hoisted to the top of the file) can
// reference it. `where()` is the awaited tail of the query chain.
const { whereMock } = vi.hoisted(() => ({ whereMock: vi.fn() }));

vi.mock("@juris-os/db/server", () => ({
	db: {
		select: () => ({ from: () => ({ where: whereMock }) }),
	},
}));

import { generateCaseNumber } from "./case-number.generator";

describe("generateCaseNumber (FR3)", () => {
	const currentYear = new Date().getFullYear();

	beforeEach(() => {
		whereMock.mockReset();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("starts at 0001 for the first case of a category/year", async () => {
		whereMock.mockResolvedValue([{ maxSeq: null }]);

		const result = await generateCaseNumber("criminal");

		expect(result.caseNumber).toBe(`CRM-${currentYear}-0001`);
		expect(result.sequenceNumber).toBe(1);
		expect(result.year).toBe(currentYear);
	});

	it("increments and zero-pads from the current max sequence", async () => {
		whereMock.mockResolvedValue([{ maxSeq: 41 }]);

		const result = await generateCaseNumber("family");

		expect(result.caseNumber).toBe(`FAM-${currentYear}-0042`);
		expect(result.sequenceNumber).toBe(42);
	});

	it("maps each category to its prefix", async () => {
		whereMock.mockResolvedValue([{ maxSeq: 0 }]);

		expect((await generateCaseNumber("criminal")).caseNumber).toContain("CRM-");
		expect((await generateCaseNumber("family")).caseNumber).toContain("FAM-");
		expect((await generateCaseNumber("labor")).caseNumber).toContain("LAB-");
	});

	it("keeps four-digit padding past 9999", async () => {
		whereMock.mockResolvedValue([{ maxSeq: 12344 }]);

		const result = await generateCaseNumber("labor");

		expect(result.caseNumber).toBe(`LAB-${currentYear}-12345`);
	});
});
