import { z } from "zod";

export const copilotQuerySchema = z.object({
	caseNumber: z.string().min(1),
	question: z.string().min(1).max(1000),
});

export type CopilotQueryDto = z.infer<typeof copilotQuerySchema>;
