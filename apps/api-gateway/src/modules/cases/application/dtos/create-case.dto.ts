import { z } from "zod";

// Mirrors manualLawsuitSchema from the frontend exactly.
// Any change here must be reflected in the frontend schema and vice versa.
export const createCaseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	category: z.string().min(1, "Category is required"),
	incidentDate: z.string().min(1, "Incident date is required"),
	counterpartyName: z.string(),
	counterpartyAddress: z.string(),
	counterpartyId: z.string(),
});

export type CreateCaseDto = z.infer<typeof createCaseSchema>;
