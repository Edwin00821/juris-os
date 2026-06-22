import { describe, expect, it } from "vitest";
import { getInitials } from "./utils";

/**
 * Smoke test for the Phase 0 Vitest setup in the web app. `getInitials` is a
 * pure function with no DOM dependency, so it verifies the Vitest toolchain
 * works before component/jsdom tests are added.
 */
describe("getInitials", () => {
	it("returns an empty string when no name is given", () => {
		expect(getInitials()).toBe("");
		expect(getInitials("")).toBe("");
	});

	it("uses the first letters of the first two words", () => {
		expect(getInitials("Ada Lovelace")).toBe("AL");
		expect(getInitials("Grace Brewster Hopper")).toBe("GB");
	});

	it("handles a single-word name", () => {
		expect(getInitials("Cher")).toBe("C");
	});
});
