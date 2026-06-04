import { z } from "zod";

export const generateDocumentQuerySchema = z.object({
	caseData: z.object({
		title: z.string().nullable(),
		description: z.string().nullable(),
		category: z.string().nullable(),
		incidentDate: z.string().nullable(),
		counterpartyName: z.string().nullable(),
		legalBasis: z.string().nullable(),
		claims: z.string().nullable(),
	}),
	counterparty: z
		.object({
			name: z.string().optional(),
			address: z.string().optional(),
			id: z.string().optional(),
		})
		.optional(),
	plaintiff: z
		.object({
			name: z.string().optional(),
			email: z.string().optional(),
		})
		.optional(),
});

export type GenerateDocumentQueryDto = z.infer<
	typeof generateDocumentQuerySchema
>;
