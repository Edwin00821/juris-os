/**
 * Unit tests for GenerateDocumentUseCase (FR2.1 — AI-assisted drafting).
 *
 * What: the use-case delegates to the Gemini-backed generation service and
 * returns its document unchanged; errors from the service propagate.
 * Why: confirms the thin delegation contract and error transparency without
 * calling Gemini or the network.
 * How: the generation service module is mocked.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GenerateDocumentQueryDto } from "../dtos/generate-document-query.dto";

// Mock the Gemini-backed generation service.
const { generateMock } = vi.hoisted(() => ({ generateMock: vi.fn() }));
vi.mock("../services/ai-generate-document.service", () => ({
	generateLawsuitDocument: generateMock,
}));

import { GenerateDocumentUseCase } from "./generate-document.use-case";

const dto: GenerateDocumentQueryDto = {
	caseData: {
		title: "Wrongful dismissal",
		description: "Fired without cause",
		category: "labor",
		incidentDate: "2025-02-01",
		counterpartyName: "Acme Corp",
		legalBasis: null,
		claims: null,
	},
};

describe("GenerateDocumentUseCase (FR2.1)", () => {
	beforeEach(() => {
		generateMock.mockReset();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("delegates to the generation service and returns its document", async () => {
		generateMock.mockResolvedValue({ document: "<p>DEMANDA</p>" });

		const result = await new GenerateDocumentUseCase().execute(dto);

		expect(result).toEqual({ document: "<p>DEMANDA</p>" });
		expect(generateMock).toHaveBeenCalledWith(dto);
	});

	it("propagates errors from the generation service", async () => {
		generateMock.mockRejectedValue(new Error("model unavailable"));

		await expect(new GenerateDocumentUseCase().execute(dto)).rejects.toThrow(
			"model unavailable",
		);
	});
});
