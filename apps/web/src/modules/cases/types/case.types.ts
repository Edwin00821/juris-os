export type CaseStatus =
	| "OPEN"
	| "UNDER_REVIEW"
	| "PENDING_RESOLUTION"
	| "CLOSED";

export type CaseResolution = "admitted" | "conditioned" | "rejected";

export interface Case {
	id: string;
	title: string;
	registrationDate: string;
	status: CaseStatus;
}
