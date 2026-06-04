import { z } from "zod";

export const createDocumentSchema = z.object({
	caseId: z.string().uuid(),
	fileName: z.string().min(1),
	fileType: z.string().min(1),
	storageKey: z.string().min(1),
	fileUrl: z.string().url(),
	documentType: z
		.enum(["evidence", "motion", "brief", "judgment", "other"])
		.default("other"),
});

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
