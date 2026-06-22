/**
 * Unit tests for UpdateCaseStatusUseCase (FR7 — preliminary review transitions).
 *
 * What: only the assigned judge can advance a case's status, and the change
 * emits CaseStatusChanged. A same-status call is a no-op (no event), a missing
 * case is 404, a different judge is 403, and a closed case is 409.
 * Why: status changes encode the judge's review decisions; ownership and the
 * closed-case lock protect the integrity of the workflow.
 * How: an in-memory FakeCaseRepository + makeCase fixture, eventBus.emit spied.
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
import { FakeCaseRepository, makeCase } from "../../test-support";
import { UpdateCaseStatusUseCase } from "./update-case-status.use-case";

describe("UpdateCaseStatusUseCase (FR7)", () => {
	let emit: MockInstance<typeof eventBus.emit>;

	beforeEach(() => {
		emit = vi.spyOn(eventBus, "emit").mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("transitions status for the assigned judge and emits CaseStatusChanged", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			status: "UNDER_REVIEW",
		});
		const repo = new FakeCaseRepository([existing]);

		await new UpdateCaseStatusUseCase(repo).execute({
			caseNumber: "CRM-2025-0100",
			status: "PENDING_RESOLUTION",
			requestedBy: "judge-7",
		});

		expect(repo.get(existing.id)?.status).toBe("PENDING_RESOLUTION");
		expect(emit).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "CaseStatusChanged",
				payload: expect.objectContaining({
					caseId: existing.id,
					previousStatus: "UNDER_REVIEW",
					newStatus: "PENDING_RESOLUTION",
				}),
			}),
		);
	});

	it("is a no-op when the status is already the target", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			status: "PENDING_RESOLUTION",
		});
		const repo = new FakeCaseRepository([existing]);

		await new UpdateCaseStatusUseCase(repo).execute({
			caseNumber: "CRM-2025-0100",
			status: "PENDING_RESOLUTION",
			requestedBy: "judge-7",
		});

		expect(emit).not.toHaveBeenCalled();
	});

	it("throws 404 when the case does not exist", async () => {
		const repo = new FakeCaseRepository();

		await expect(
			new UpdateCaseStatusUseCase(repo).execute({
				caseNumber: "CRM-2025-9999",
				status: "UNDER_REVIEW",
				requestedBy: "judge-7",
			}),
		).rejects.toMatchObject({ status: 404 });
	});

	it("throws 403 when a different judge requests the change", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			status: "UNDER_REVIEW",
		});
		const repo = new FakeCaseRepository([existing]);

		await expect(
			new UpdateCaseStatusUseCase(repo).execute({
				caseNumber: "CRM-2025-0100",
				status: "PENDING_RESOLUTION",
				requestedBy: "judge-other",
			}),
		).rejects.toMatchObject({ status: 403 });
		expect(emit).not.toHaveBeenCalled();
	});

	it("throws 409 when the case is already closed", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			status: "CLOSED",
		});
		const repo = new FakeCaseRepository([existing]);

		await expect(
			new UpdateCaseStatusUseCase(repo).execute({
				caseNumber: "CRM-2025-0100",
				status: "UNDER_REVIEW",
				requestedBy: "judge-7",
			}),
		).rejects.toMatchObject({ status: 409 });
	});
});
