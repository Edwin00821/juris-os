// Internal domain states — richer lifecycle than what the frontend exposes.
// The mapper in case.response.dto.ts translates these to frontend CaseStatus.
export type InternalCaseStatus =
	| "DRAFT"
	| "OPEN"
	| "UNDER_REVIEW"
	| "PENDING_RESOLUTION"
	| "CLOSED"
	| "ERROR";

// Verdict recorded when a case is closed.
export type CaseResolution = "admitted" | "conditioned" | "rejected";

export type CaseCategory = "criminal" | "family" | "labor";

export type AiMode = "AI_ASSISTED" | "MANUAL";
