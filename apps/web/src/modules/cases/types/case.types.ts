export type CaseStatus = "OPEN" | "UNDER_REVIEW" | "PENDING_RESOLUTION";

export interface Case {
	id: string;
	title: string;
	registrationDate: string;
	status: CaseStatus;
}
