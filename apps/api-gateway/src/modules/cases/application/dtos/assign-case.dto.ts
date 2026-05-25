import { z } from "zod";

export const assignCaseSchema = z.object({
	judgeId: z.string().min(1, "judgeId is required"),
});

export type AssignCaseDto = z.infer<typeof assignCaseSchema>;
