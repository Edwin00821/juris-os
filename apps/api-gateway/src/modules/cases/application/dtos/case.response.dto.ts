import type { InternalCaseStatus } from "../../domain/case.types";

export type CaseResponseDto = {
	id: string; // human-readable caseNumber shown in the UI (e.g. CIV-2025-0001)
	title: string;
	category: string;
	registrationDate: string;
	status: "OPEN" | "UNDER_REVIEW" | "PENDING_RESOLUTION";
	judgeId: string | null;
};

export type PaginatedCasesDto = {
	data: CaseResponseDto[];
	totalCount: number;
	totalPages: number;
};

const STATUS_MAP: Record<InternalCaseStatus, CaseResponseDto["status"]> = {
	DRAFT: "OPEN",
	OPEN: "OPEN",
	UNDER_REVIEW: "UNDER_REVIEW",
	PENDING_RESOLUTION: "PENDING_RESOLUTION",
	CLOSED: "PENDING_RESOLUTION",
	ERROR: "PENDING_RESOLUTION",
};

export const toCaseResponse = (case_: {
	id: string;
	caseNumber: string;
	title: string;
	category: string;
	createdAt: Date;
	status: InternalCaseStatus;
	judgeId: string | null;
}): CaseResponseDto => ({
	id: case_.caseNumber,
	title: case_.title,
	category: case_.category,
	registrationDate: case_.createdAt.toISOString(),
	status: STATUS_MAP[case_.status],
	judgeId: case_.judgeId,
});
