import { z } from "zod";

// A judge can move an assigned case between the two active working states.
// Closing a case is a separate, terminal flow (PATCH /:id/close) that also
// records the verdict and the published sentence.
export const updateCaseStatusSchema = z.object({
	status: z.enum(["UNDER_REVIEW", "PENDING_RESOLUTION"]),
});

export type UpdateCaseStatusDto = z.infer<typeof updateCaseStatusSchema>;
