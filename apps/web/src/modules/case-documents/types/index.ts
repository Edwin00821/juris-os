import type {
	CaseCategory,
	JudgeCaseStatus,
} from "@/modules/assigned-cases/types";

export interface CaseDetail {
	id: string; // caseNumber (e.g., LAB-2026-0001)
	title: string;
	description: string | null;
	category: CaseCategory;
	counterpartyName: string | null;
	plaintiffName: string;
	createdAt: string;
	closedDate?: string;
	waitingDays?: number;
	status: JudgeCaseStatus;
	judgeName?: string | null;
}
