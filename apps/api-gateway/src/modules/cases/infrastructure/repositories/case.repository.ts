import type { CreateCaseDto } from "../../application/dtos/create-case.dto";
import type { CaseCategory, InternalCaseStatus } from "../../domain/case.types";

export type CaseRecord = {
	id: string;
	caseNumber: string;
	userId: string;
	title: string;
	description: string | null;
	category: CaseCategory;
	incidentDate: string;
	counterpartyName: string | null;
	counterpartyAddress: string | null;
	counterpartyId: string | null;
	status: InternalCaseStatus;
	sequenceNumber: number;
	year: number;
	createdAt: Date;
	updatedAt: Date;
};

export type PaginationParams = {
	page: number;
	pageSize: number;
};

export type PaginatedResult<T> = {
	data: T[];
	totalCount: number;
};

export interface ICaseRepository {
	create(userId: string, dto: CreateCaseDto): Promise<CaseRecord>;
	findById(id: string, userId: string): Promise<CaseRecord | null>;
	findByCaseNumber(
		caseNumber: string,
		userId: string,
	): Promise<CaseRecord | null>;
	findAllByUser(
		userId: string,
		pagination: PaginationParams,
	): Promise<PaginatedResult<CaseRecord>>;
}
