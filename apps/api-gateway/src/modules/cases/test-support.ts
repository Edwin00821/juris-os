import type { CaseRecord } from "@juris-os/db/schema/case.schema";
import type { CreateCaseDto } from "./application/dtos/create-case.dto";
import type { CaseResolution } from "./domain/case.types";
import type {
	ICaseRepository,
	JudgeCaseRow,
	PaginatedResult,
	PaginationParams,
} from "./infrastructure/repositories/case.repository";

/**
 * Test support for the cases module: a deterministic `CaseRecord` factory and an
 * in-memory `ICaseRepository` so use-cases can be exercised without a database.
 * Shared by the Phase 1 use-case unit tests.
 */

let seq = 0;

export function makeCase(overrides: Partial<CaseRecord> = {}): CaseRecord {
	seq += 1;
	const padded = String(seq).padStart(4, "0");
	return {
		id: `00000000-0000-0000-0000-${padded.padStart(12, "0")}`,
		caseNumber: `CRM-2025-${padded}`,
		judgeId: null,
		userId: "user-1",
		title: "Sample case",
		description: "A description",
		category: "criminal",
		incidentDate: "2025-01-01",
		counterpartyName: "Acme Corp",
		counterpartyAddress: "123 Main St",
		counterpartyId: "RFC123",
		status: "OPEN",
		priority: "medium",
		resolution: null,
		resolutionText: null,
		sequenceNumber: seq,
		year: 2025,
		createdAt: new Date("2025-01-02T00:00:00.000Z"),
		updatedAt: new Date("2025-01-02T00:00:00.000Z"),
		...overrides,
	};
}

/**
 * Minimal in-memory repository. Only the methods the use-cases call are backed
 * by real behaviour; list/detail readers throw so a test that relies on them
 * fails loudly instead of silently passing against an empty stub.
 */
export class FakeCaseRepository implements ICaseRepository {
	private readonly store = new Map<string, CaseRecord>();

	constructor(initial: CaseRecord[] = []) {
		for (const record of initial) this.store.set(record.id, record);
	}

	get(id: string): CaseRecord | undefined {
		return this.store.get(id);
	}

	async create(userId: string, dto: CreateCaseDto): Promise<CaseRecord> {
		const record = makeCase({
			userId,
			title: dto.title,
			description: dto.description,
			category: dto.category as CaseRecord["category"],
			incidentDate: dto.incidentDate,
			counterpartyName: dto.counterpartyName,
			counterpartyAddress: dto.counterpartyAddress,
			counterpartyId: dto.counterpartyId,
		});
		this.store.set(record.id, record);
		return record;
	}

	async findById(id: string, userId: string): Promise<CaseRecord | null> {
		const record = this.store.get(id);
		return record && record.userId === userId ? record : null;
	}

	async findByCaseNumber(caseNumber: string): Promise<CaseRecord | null> {
		for (const record of this.store.values()) {
			if (record.caseNumber === caseNumber) return record;
		}
		return null;
	}

	async assignJudge(caseId: string, judgeId: string): Promise<void> {
		const record = this.store.get(caseId);
		if (record) this.store.set(caseId, { ...record, judgeId });
	}

	async updateStatus(
		caseId: string,
		status: "UNDER_REVIEW" | "PENDING_RESOLUTION",
	): Promise<void> {
		const record = this.store.get(caseId);
		if (record) this.store.set(caseId, { ...record, status });
	}

	async closeCase(
		caseId: string,
		resolution: CaseResolution,
		resolutionText?: string,
	): Promise<void> {
		const record = this.store.get(caseId);
		if (record) {
			this.store.set(caseId, {
				...record,
				status: "CLOSED",
				resolution,
				resolutionText: resolutionText ?? null,
			});
		}
	}

	findAllByUser(): Promise<PaginatedResult<CaseRecord>> {
		throw new Error("not implemented in FakeCaseRepository");
	}

	findAll(_p: PaginationParams): Promise<PaginatedResult<CaseRecord>> {
		throw new Error("not implemented in FakeCaseRepository");
	}

	findAllByJudge(): Promise<PaginatedResult<JudgeCaseRow>> {
		throw new Error("not implemented in FakeCaseRepository");
	}

	findDetailByCaseNumber(): Promise<JudgeCaseRow | null> {
		throw new Error("not implemented in FakeCaseRepository");
	}
}
