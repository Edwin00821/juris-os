import { z } from "zod";

export const suggestJudgeQuerySchema = z.object({
	// Human-readable case number shown in the UI (e.g. CIV-2025-0001).
	caseNumber: z.string().min(1),
});

export type SuggestJudgeQueryDto = z.infer<typeof suggestJudgeQuerySchema>;
