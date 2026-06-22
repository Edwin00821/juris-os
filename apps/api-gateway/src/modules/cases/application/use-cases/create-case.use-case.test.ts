/**
 * Unit tests for CreateCaseUseCase (FR3 — case file generation + traceability).
 *
 * What: a citizen creating a case persists it as OPEN/unassigned with a
 * human-readable case number (CRM-2025-XXXX) and emits a CaseCreated event.
 * Why: creation is the entry point of the workflow; the number and the event
 * are what make a case traceable and drive the downstream choreography.
 * How: an in-memory FakeCaseRepository (no DB) and a spy on eventBus.emit.
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
import { FakeCaseRepository } from "../../test-support";
import type { CreateCaseDto } from "../dtos/create-case.dto";
import { CreateCaseUseCase } from "./create-case.use-case";

const dto: CreateCaseDto = {
	title: "Unpaid wages",
	description: "Employer withheld three months of salary",
	category: "labor",
	incidentDate: "2025-03-01",
	counterpartyName: "Acme Corp",
	counterpartyAddress: "123 Main St",
	counterpartyId: "RFC-9",
};

describe("CreateCaseUseCase (FR3)", () => {
	let emit: MockInstance<typeof eventBus.emit>;

	beforeEach(() => {
		emit = vi.spyOn(eventBus, "emit").mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("persists the case and returns it mapped to the response DTO", async () => {
		const repo = new FakeCaseRepository();
		const result = await new CreateCaseUseCase(repo).execute("citizen-1", dto);

		expect(result.title).toBe(dto.title);
		expect(result.category).toBe("labor");
		expect(result.status).toBe("OPEN");
		expect(result.judgeId).toBeNull();
		// The response `id` is the human-readable case number, `uuid` the internal id.
		expect(result.id).toMatch(/^CRM-2025-\d{4}$/);
		expect(repo.get(result.uuid)?.userId).toBe("citizen-1");
	});

	it("emits a CaseCreated event with the creator and MANUAL mode", async () => {
		const repo = new FakeCaseRepository();
		const result = await new CreateCaseUseCase(repo).execute("citizen-1", dto);

		expect(emit).toHaveBeenCalledTimes(1);
		expect(emit).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "CaseCreated",
				payload: expect.objectContaining({
					caseId: result.uuid,
					userId: "citizen-1",
					aiMode: "MANUAL",
					title: dto.title,
				}),
			}),
		);
	});
});
