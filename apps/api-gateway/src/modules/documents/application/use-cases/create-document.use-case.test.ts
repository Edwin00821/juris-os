/**
 * Unit tests for CreateDocumentUseCase (FR3 — case documents / traceability).
 *
 * What: uploading a document persists it, returns the response DTO (with the
 * uploader and a serialized createdAt) and emits a DocumentUploaded event.
 * Why: documents are part of the case file; the event lets other modules react
 * (e.g. future indexing) without a direct cross-module import.
 * How: an in-memory FakeDocumentRepository (no storage/DB), eventBus.emit spied.
 */
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type MockInstance,
	vi,
} from "vitest";
import { eventBus } from "../../../../core/events/event-bus";
import { FakeDocumentRepository } from "../../test-support";
import type { CreateDocumentDto } from "../dtos/create-document.dto";
import { CreateDocumentUseCase } from "./create-document.use-case";

const dto: CreateDocumentDto = {
	caseId: "20000000-0000-0000-0000-000000000001",
	fileName: "complaint.pdf",
	fileType: "application/pdf",
	storageKey: "uploads/complaint.pdf",
	fileUrl: "https://files.example.com/complaint.pdf",
	documentType: "brief",
};

describe("CreateDocumentUseCase (FR3)", () => {
	let emit: MockInstance<typeof eventBus.emit>;

	beforeEach(() => {
		emit = vi.spyOn(eventBus, "emit").mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("persists the document and returns the response DTO", async () => {
		const repo = new FakeDocumentRepository();
		const result = await new CreateDocumentUseCase(repo).execute(
			"judge-7",
			dto,
		);

		expect(result.fileName).toBe("complaint.pdf");
		expect(result.documentType).toBe("brief");
		expect(result.uploadedBy).toBe("judge-7");
		expect(result.caseId).toBe(dto.caseId);
		expect(typeof result.createdAt).toBe("string");
	});

	it("emits a DocumentUploaded event", async () => {
		const repo = new FakeDocumentRepository();
		const result = await new CreateDocumentUseCase(repo).execute(
			"judge-7",
			dto,
		);

		expect(emit).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "DocumentUploaded",
				payload: expect.objectContaining({
					documentId: result.id,
					caseId: dto.caseId,
					storageKey: dto.storageKey,
					documentType: "brief",
				}),
			}),
		);
	});
});
