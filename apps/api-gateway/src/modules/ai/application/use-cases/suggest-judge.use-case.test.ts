/**
 * Unit tests for SuggestJudgeUseCase (FR4 — AI-assisted assignment).
 *
 * What: the use-case loads the case + the list of judges and forwards them to
 * the assignment engine, returning its ranked suggestion verbatim. A missing
 * case is 404 and so is an empty judge list (the engine is never called).
 * Why: this is the seam between our domain and the FastAPI assignment engine;
 * we verify the contract (the payload shape) and the pre-flight guards — not the
 * engine's scoring, which the Python tests cover.
 * How: the engine service module is mocked so no FastAPI call happens; the case
 * repo is the in-memory fake and the user repo is stubbed.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeCaseRepository, makeCase } from "../../../cases/test-support";
import type { PgUserRepository } from "../../../users/infrastructure/repositories/pg-user.repository";

// Mock the engine boundary so the use-case is tested in isolation (no FastAPI
// call). The service module also imports env + creates clients at load time,
// which the mock short-circuits.
const { suggestJudgeMock } = vi.hoisted(() => ({ suggestJudgeMock: vi.fn() }));
vi.mock("../services/ai-suggest-judge.service", () => ({
	suggestJudge: suggestJudgeMock,
}));

import { SuggestJudgeUseCase } from "./suggest-judge.use-case";

const judges = [
	{
		id: "judge-7",
		name: "Ada",
		specialty: "criminal",
		email: "a@x.io",
		activeCases: 2,
	},
];

function userRepoWith(list: unknown[]): PgUserRepository {
	return {
		listJudges: vi.fn().mockResolvedValue(list),
	} as unknown as PgUserRepository;
}

describe("SuggestJudgeUseCase (FR4)", () => {
	beforeEach(() => {
		suggestJudgeMock.mockReset();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("forwards the case and judges to the engine and returns its result", async () => {
		const case_ = makeCase({
			caseNumber: "CRM-2025-0100",
			category: "criminal",
		});
		const caseRepo = new FakeCaseRepository([case_]);
		const engineResult = {
			caseId: "CRM-2025-0100",
			suggestions: [
				{
					judgeId: "judge-7",
					name: "Ada",
					score: 92,
					justification: "fit",
					estimatedDays: 5,
				},
			],
		};
		suggestJudgeMock.mockResolvedValue(engineResult);

		const result = await new SuggestJudgeUseCase(
			caseRepo,
			userRepoWith(judges),
		).execute({
			caseNumber: "CRM-2025-0100",
		});

		expect(result).toBe(engineResult);
		expect(suggestJudgeMock).toHaveBeenCalledWith({
			case_: {
				caseNumber: "CRM-2025-0100",
				category: "criminal",
				priority: "medium",
			},
			judges,
		});
	});

	it("throws 404 when the case does not exist", async () => {
		const caseRepo = new FakeCaseRepository();

		await expect(
			new SuggestJudgeUseCase(caseRepo, userRepoWith(judges)).execute({
				caseNumber: "CRM-2025-9999",
			}),
		).rejects.toMatchObject({ status: 404 });
		expect(suggestJudgeMock).not.toHaveBeenCalled();
	});

	it("throws 404 when there are no judges to assign", async () => {
		const case_ = makeCase({ caseNumber: "CRM-2025-0100" });
		const caseRepo = new FakeCaseRepository([case_]);

		await expect(
			new SuggestJudgeUseCase(caseRepo, userRepoWith([])).execute({
				caseNumber: "CRM-2025-0100",
			}),
		).rejects.toMatchObject({ status: 404 });
		expect(suggestJudgeMock).not.toHaveBeenCalled();
	});
});
