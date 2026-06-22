/**
 * Unit tests for CloseCaseUseCase (FR8 — resolution issuance + closure).
 *
 * What: the assigned judge closes a case with a resolution + resolution text,
 * moving it to CLOSED and emitting CaseClosed. A missing case is 404, a
 * different judge is 403 (state untouched), and an already-closed case is 409.
 * Why: closure is the terminal, irreversible step; only the owning judge may do
 * it and only once, so the ownership and idempotency guards are essential.
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
import { CloseCaseUseCase } from "./close-case.use-case";

describe("CloseCaseUseCase (FR8)", () => {
	let emit: MockInstance<typeof eventBus.emit>;

	beforeEach(() => {
		emit = vi.spyOn(eventBus, "emit").mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("closes the case with a resolution and emits CaseClosed", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			status: "PENDING_RESOLUTION",
		});
		const repo = new FakeCaseRepository([existing]);

		await new CloseCaseUseCase(repo).execute({
			caseNumber: "CRM-2025-0100",
			resolution: "admitted",
			resolutionText: "<p>Granted.</p>",
			requestedBy: "judge-7",
		});

		const stored = repo.get(existing.id);
		expect(stored?.status).toBe("CLOSED");
		expect(stored?.resolution).toBe("admitted");
		expect(stored?.resolutionText).toBe("<p>Granted.</p>");
		expect(emit).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "CaseClosed",
				payload: expect.objectContaining({
					caseId: existing.id,
					caseNumber: "CRM-2025-0100",
					resolution: "admitted",
					closedBy: "judge-7",
				}),
			}),
		);
	});

	it("throws 404 when the case does not exist", async () => {
		const repo = new FakeCaseRepository();

		await expect(
			new CloseCaseUseCase(repo).execute({
				caseNumber: "CRM-2025-9999",
				resolution: "rejected",
				requestedBy: "judge-7",
			}),
		).rejects.toMatchObject({ status: 404 });
	});

	it("throws 403 when a different judge tries to close", async () => {
		const existing = makeCase({
			caseNumber: "CRM-2025-0100",
			judgeId: "judge-7",
			status: "PENDING_RESOLUTION",
		});
		const repo = new FakeCaseRepository([existing]);

		await expect(
			new CloseCaseUseCase(repo).execute({
				caseNumber: "CRM-2025-0100",
				resolution: "rejected",
				requestedBy: "judge-other",
			}),
		).rejects.toMatchObject({ status: 403 });
		expect(repo.get(existing.id)?.status).toBe("PENDING_RESOLUTION");
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
			new CloseCaseUseCase(repo).execute({
				caseNumber: "CRM-2025-0100",
				resolution: "admitted",
				requestedBy: "judge-7",
			}),
		).rejects.toMatchObject({ status: 409 });
		expect(emit).not.toHaveBeenCalled();
	});
});
