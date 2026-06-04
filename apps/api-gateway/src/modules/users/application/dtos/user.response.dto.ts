export type JudgeResponseDto = {
	id: string;
	name: string;
	email: string;
	specialty: "criminal" | "family" | "labor" | null;
	activeCases: number;
};
