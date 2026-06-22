/**
 * Unit tests for QueryCopilotUseCase (FR6 — document Q&A copilot).
 *
 * What: the use-case gathers the case's documents and forwards the question +
 * documents to the Gemini-backed copilot service, returning its answer. A
 * closed case is 409 (the copilot is never called).
 * Why: validates the orchestration and the closed-case guard without depending
 * on Gemini or the network.
 * How: the copilot service is mocked; case/document repos are in-memory fakes
 * (findByCaseNumber is stubbed where the fake does not back it).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeCaseRepository, makeCase } from "../../../cases/test-support";
import {
	FakeDocumentRepository,
	makeDocument,
} from "../../../documents/test-support";

// Mock the Gemini-backed copilot service so the use-case is tested in isolation.
const { askCopilotMock } = vi.hoisted(() => ({ askCopilotMock: vi.fn() }));
vi.mock("../services/ai-copilot.service", () => ({
	askCopilot: askCopilotMock,
}));

import { QueryCopilotUseCase } from "./query-copilot.use-case";

describe("QueryCopilotUseCase (FR6)", () => {
	beforeEach(() => {
		askCopilotMock.mockReset();
		askCopilotMock.mockResolvedValue({
			answer: "Because…",
			refs: ["complaint.pdf"],
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("passes the question and case documents to the copilot service", async () => {
		const case_ = makeCase({
			caseNumber: "CRM-2025-0100",
			status: "UNDER_REVIEW",
		});
		const caseRepo = new FakeCaseRepository([case_]);
		const doc = makeDocument({
			fileName: "complaint.pdf",
			markdownContent: "# Body",
		});
		const docRepo = new FakeDocumentRepository([doc]);
		// findByCaseNumber is not backed by the fake; stub it for this test.
		vi.spyOn(docRepo, "findByCaseNumber").mockResolvedValue([doc]);

		const result = await new QueryCopilotUseCase(docRepo, caseRepo).execute({
			caseNumber: "CRM-2025-0100",
			question: "Who are the parties?",
		});

		expect(result).toEqual({ answer: "Because…", refs: ["complaint.pdf"] });
		expect(askCopilotMock).toHaveBeenCalledWith({
			caseNumber: "CRM-2025-0100",
			question: "Who are the parties?",
			documents: [{ fileName: "complaint.pdf", markdownContent: "# Body" }],
		});
	});

	it("throws 409 when the case is closed", async () => {
		const case_ = makeCase({ caseNumber: "CRM-2025-0100", status: "CLOSED" });
		const caseRepo = new FakeCaseRepository([case_]);
		const docRepo = new FakeDocumentRepository();

		await expect(
			new QueryCopilotUseCase(docRepo, caseRepo).execute({
				caseNumber: "CRM-2025-0100",
				question: "Anything?",
			}),
		).rejects.toMatchObject({ status: 409 });
		expect(askCopilotMock).not.toHaveBeenCalled();
	});
});
