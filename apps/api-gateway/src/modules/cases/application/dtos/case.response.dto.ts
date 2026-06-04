import type { InternalCaseStatus } from "../../domain/case.types";
import type { JudgeCaseRow } from "../../infrastructure/repositories/case.repository";

export type CaseResponseDto = {
	id: string; // human-readable caseNumber shown in the UI (e.g. CIV-2025-0001)
	uuid: string; // internal UUID — needed as FK for documents
	title: string;
	category: string;
	registrationDate: string;
	status: "OPEN" | "UNDER_REVIEW" | "PENDING_RESOLUTION" | "CLOSED";
	resolution: "admitted" | "conditioned" | "rejected" | null;
	resolutionText: string | null;
	judgeId: string | null;
	judgeName: string | null;
	judgeEmail: string | null;
};

export type PaginatedCasesDto = {
	data: CaseResponseDto[];
	totalCount: number;
	totalPages: number;
};

export type JudgeCaseListItemDto = {
	id: string; // caseNumber
	title: string;
	category: string;
	priority: string;
	status: "UNDER_REVIEW" | "PENDING_RESOLUTION" | "CLOSED";
	resolution: "admitted" | "conditioned" | "rejected" | null;
	counterpartyName: string | null;
	plaintiffName: string;
	createdAt: string;
	waitingDays: number;
};

export type PaginatedJudgeCasesDto = {
	data: JudgeCaseListItemDto[];
	totalCount: number;
	totalPages: number;
};

export type CaseDetailDto = {
	id: string; // caseNumber
	uuid: string; // internal UUID — needed as FK for documents
	title: string;
	description: string | null;
	category: string;
	priority: string;
	status: string;
	resolution: "admitted" | "conditioned" | "rejected" | null;
	resolutionText: string | null;
	counterpartyName: string | null;
	plaintiffName: string;
	judgeName: string | null;
	incidentDate: string;
	createdAt: string;
	waitingDays: number;
	judgeId: string | null;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const STATUS_MAP: Record<InternalCaseStatus, CaseResponseDto["status"]> = {
	DRAFT: "OPEN",
	OPEN: "OPEN",
	UNDER_REVIEW: "UNDER_REVIEW",
	PENDING_RESOLUTION: "PENDING_RESOLUTION",
	CLOSED: "CLOSED",
	ERROR: "PENDING_RESOLUTION",
};

export const toCaseResponse = (case_: {
	id: string;
	caseNumber: string;
	title: string;
	category: string;
	createdAt: Date;
	status: InternalCaseStatus;
	resolution?: "admitted" | "conditioned" | "rejected" | null;
	resolutionText?: string | null;
	judgeId: string | null;
	judgeName?: string | null;
	judgeEmail?: string | null;
}): CaseResponseDto => ({
	id: case_.caseNumber,
	uuid: case_.id,
	title: case_.title,
	category: case_.category,
	registrationDate: case_.createdAt.toISOString(),
	status: STATUS_MAP[case_.status],
	resolution: case_.resolution ?? null,
	resolutionText: case_.resolutionText ?? null,
	judgeId: case_.judgeId,
	judgeName: case_.judgeName ?? null,
	judgeEmail: case_.judgeEmail ?? null,
});

export const toJudgeCaseListItem = (
	case_: JudgeCaseRow,
): JudgeCaseListItemDto => ({
	id: case_.caseNumber,
	title: case_.title,
	category: case_.category,
	priority: case_.priority,
	status: case_.status as JudgeCaseListItemDto["status"],
	resolution: (case_.resolution as JudgeCaseListItemDto["resolution"]) ?? null,
	counterpartyName: case_.counterpartyName,
	plaintiffName: case_.plaintiffName,
	createdAt: case_.createdAt.toISOString(),
	waitingDays: Math.floor(
		(Date.now() - case_.createdAt.getTime()) / MS_PER_DAY,
	),
});

export const toCaseDetail = (case_: JudgeCaseRow): CaseDetailDto => ({
	id: case_.caseNumber,
	uuid: case_.id,
	title: case_.title,
	description: case_.description,
	category: case_.category,
	priority: case_.priority,
	status: case_.status,
	resolution: (case_.resolution as CaseDetailDto["resolution"]) ?? null,
	resolutionText: case_.resolutionText ?? null,
	counterpartyName: case_.counterpartyName,
	plaintiffName: case_.plaintiffName,
	judgeName: case_.judgeName,
	incidentDate: case_.incidentDate,
	createdAt: case_.createdAt.toISOString(),
	waitingDays: Math.floor(
		(Date.now() - case_.createdAt.getTime()) / MS_PER_DAY,
	),
	judgeId: case_.judgeId,
});
