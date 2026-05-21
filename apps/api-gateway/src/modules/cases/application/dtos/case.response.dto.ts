import type { InternalCaseStatus } from "../../domain/case.types";

// Matches the Case interface in the frontend exactly.
// id is the human-readable caseNumber (CIV-2025-0001), not the internal UUID.
export type CaseResponseDto = {
	id: string;
	title: string;
	registrationDate: string;
	status: "OPEN" | "UNDER_REVIEW" | "PENDING_RESOLUTION";
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
	createdAt: Date;
	status: InternalCaseStatus;
}): CaseResponseDto => ({
	// Expose the human-readable ID to the frontend, not the internal UUID
	id: case_.caseNumber,
	title: case_.title,
	registrationDate: case_.createdAt.toISOString(),
	status: STATUS_MAP[case_.status],
});
