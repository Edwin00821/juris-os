import type { CaseRecord } from "@juris-os/db/schema/case.schema";
import type { CreateCaseDto } from "../../application/dtos/create-case.dto";
import type { InternalCaseStatus } from "../../domain/case.types";
// import type { CaseCategory, InternalCaseStatus } from "../../domain/case.types";

export type PaginationParams = {
	page: number;
	pageSize: number;
	status?: InternalCaseStatus;
	assigned?: boolean; // true = judgeId IS NOT NULL, false = judgeId IS NULL
};

export type PaginatedResult<T> = {
	data: T[];
	totalCount: number;
};

export interface ICaseRepository {
	create(userId: string, dto: CreateCaseDto): Promise<CaseRecord>;
	findById(id: string, userId: string): Promise<CaseRecord | null>;
	findByCaseNumber(caseNumber: string): Promise<CaseRecord | null>;
	findAllByUser(
		userId: string,
		pagination: PaginationParams,
	): Promise<PaginatedResult<CaseRecord>>;
	findAll(pagination: PaginationParams): Promise<PaginatedResult<CaseRecord>>;
	assignJudge(caseId: string, judgeId: string): Promise<void>;
}
