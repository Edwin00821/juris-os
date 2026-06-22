/**
 * Unit tests for DeleteDocumentUseCase (FR3 — document access control).
 *
 * What: deleting a missing document is 404; the uploader, an admin, or the
 * assigned judge of the case may delete it; any unrelated user is 403 and the
 * document is kept.
 * Why: documents can hold sensitive case material, so deletion must be limited
 * to parties with a legitimate relationship to the case.
 * How: an in-memory FakeDocumentRepository seeded with a case→owner/judge map.
 */
import { describe, expect, it } from "vitest";
import { FakeDocumentRepository, makeDocument } from "../../test-support";
import { DeleteDocumentUseCase } from "./delete-document.use-case";

const CASE_ID = "20000000-0000-0000-0000-000000000001";

describe("DeleteDocumentUseCase (FR3)", () => {
	it("throws 404 when the document does not exist", async () => {
		const repo = new FakeDocumentRepository();

		await expect(
			new DeleteDocumentUseCase(repo).execute("missing", {
				id: "user-1",
				role: "citizen",
			}),
		).rejects.toMatchObject({ status: 404 });
	});

	it("lets the uploader delete their own document", async () => {
		const doc = makeDocument({ caseId: CASE_ID, uploadedBy: "citizen-1" });
		const repo = new FakeDocumentRepository([doc], {
			[CASE_ID]: { ownerId: "citizen-1", judgeId: "judge-7" },
		});

		await new DeleteDocumentUseCase(repo).execute(doc.id, {
			id: "citizen-1",
			role: "citizen",
		});

		expect(repo.has(doc.id)).toBe(false);
	});

	it("lets an admin delete any document", async () => {
		const doc = makeDocument({ caseId: CASE_ID, uploadedBy: "citizen-1" });
		const repo = new FakeDocumentRepository([doc], {
			[CASE_ID]: { ownerId: "citizen-1", judgeId: "judge-7" },
		});

		await new DeleteDocumentUseCase(repo).execute(doc.id, {
			id: "admin-9",
			role: "admin",
		});

		expect(repo.has(doc.id)).toBe(false);
	});

	it("lets the assigned judge delete a document in their case", async () => {
		const doc = makeDocument({ caseId: CASE_ID, uploadedBy: "citizen-1" });
		const repo = new FakeDocumentRepository([doc], {
			[CASE_ID]: { ownerId: "citizen-1", judgeId: "judge-7" },
		});

		await new DeleteDocumentUseCase(repo).execute(doc.id, {
			id: "judge-7",
			role: "judge",
		});

		expect(repo.has(doc.id)).toBe(false);
	});

	it("throws 403 for an unrelated user and keeps the document", async () => {
		const doc = makeDocument({ caseId: CASE_ID, uploadedBy: "citizen-1" });
		const repo = new FakeDocumentRepository([doc], {
			[CASE_ID]: { ownerId: "citizen-1", judgeId: "judge-7" },
		});

		await expect(
			new DeleteDocumentUseCase(repo).execute(doc.id, {
				id: "judge-other",
				role: "judge",
			}),
		).rejects.toMatchObject({ status: 403 });
		expect(repo.has(doc.id)).toBe(true);
	});
});
