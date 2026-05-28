export type CaseCategory = "criminal" | "family" | "labor";
export type CasePriority = "low" | "medium" | "high";
export type JudgeCaseStatus = "UNDER_REVIEW" | "PENDING_RESOLUTION" | "CLOSED";
export type CaseResolution = "admitted" | "conditioned" | "rejected";

export interface JudgeCase {
	id: string; // caseNumber (e.g., LAB-2026-0001)
	title: string;
	category: CaseCategory;
	priority: CasePriority;
	status: JudgeCaseStatus;
	resolution: CaseResolution | null;
	counterpartyName: string | null;
	plaintiffName: string;
	createdAt: string;
	waitingDays: number;
}
