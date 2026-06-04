export interface ChatMessage {
	id: string;
	role: "ai" | "user";
	text: string;
	refs?: string[];
	addedToDoc?: boolean;
	question?: string;
	isFindings?: boolean;
}

export interface ResolutionQABlock {
	id: string;
	question: string;
	answer: string;
	refs: string[];
}

export interface AiResponse {
	pattern: RegExp;
	answer: string;
	refs: string[];
	docSummary: string;
}
