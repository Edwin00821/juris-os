/**
 * Unit tests for AssignCaseUseCase (FR4 — intelligent case assignment).
 *
 * What: an admin assigning a judge to an unassigned case sets the judge and
 * emits CaseAssigned; a missing case is 404 and re-assigning an already-assigned
 * case is 409 (the original judge is left untouched).
 * Why: assignment is a one-shot, guarded transition — a double assignment would
 * corrupt the workflow, so the conflict guard is the key rule.
 * How: an in-memory FakeCaseRepository + makeCase fixture, eventBus.emit spied.
 */
import { HTTPException } from "hono/http-exception";
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
import { AssignCaseUseCase } from "./assign-case.use-case";

describe("AssignCaseUseCase (FR4)", () => {
	let emit: MockInstance<typeof eventBus.emit>;

	beforeEach(() => {
		emit = vi.spyOn(eventBus, "emit").mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("assigns a judge to an unassigned case and emits CaseAssigned", async () => {
		const existing = makeCase({ caseNumber: "CRM-2025-0100", judgeId: null });
		const repo = new FakeCaseRepository([existing]);

		await new AssignCaseUseCase(repo).execute({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			requestedBy: "admin-1",
		});

		expect(repo.get(existing.id)?.judgeId).toBe("judge-7");
		expect(emit).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "CaseAssigned",
				payload: expect.objectContaining({
					caseId: existing.id,
					caseNumber: "CRM-2025-0100",
					judgeId: "judge-7",
					assignedBy: "admin-1",
				}),
			}),
		);
	});

	it("throws 404 when the case does not exist", async () => {
		const repo = new FakeCaseRepository();

		await expect(
			new AssignCaseUseCase(repo).execute({
				caseNumber: "CRM-2025-9999",
				judgeId: "judge-7",
				requestedBy: "admin-1",
			}),
		).rejects.toMatchObject({ status: 404 });
		expect(emit).not.toHaveBeenCalled();
	});

	it("throws 409 when the case already has a judge", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-existing",
		});
		const repo = new FakeCaseRepository([existing]);

		const promise = new AssignCaseUseCase(repo).execute({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			requestedBy: "admin-1",
		});

		await expect(promise).rejects.toBeInstanceOf(HTTPException);
		await expect(promise).rejects.toMatchObject({ status: 409 });
		// The originally assigned judge is untouched.
		expect(repo.get(existing.id)?.judgeId).toBe("judge-existing");
		expect(emit).not.toHaveBeenCalled();
	});
});
