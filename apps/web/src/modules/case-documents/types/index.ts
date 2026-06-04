import type {
	CaseCategory,
	JudgeCaseStatus,
} from "@/modules/assigned-cases/types";

export interface CaseDetail {
	id: string; // caseNumber (e.g., LAB-2026-0001)
	uuid?: string; // internal UUID — needed as FK for documents
	title: string;
	description: string | null;
	category: CaseCategory;
	counterpartyName: string | null;
	plaintiffName: string;
	createdAt: string;
	closedDate?: string;
	waitingDays?: number;
	status: JudgeCaseStatus;
	resolution?: "admitted" | "conditioned" | "rejected" | null;
	resolutionText?: string | null; // HTML body of the published sentence
	judgeName?: string | null;
}
