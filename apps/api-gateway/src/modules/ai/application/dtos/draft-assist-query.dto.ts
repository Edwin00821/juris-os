import { z } from "zod";

export const draftAssistQuerySchema = z.object({
	messages: z
		.array(
			z.object({
				role: z.enum(["user", "bot"]),
				text: z.string(),
			}),
		)
		.min(1),
	counterparty: z
		.object({
			name: z.string().optional(),
			address: z.string().optional(),
			id: z.string().optional(),
		})
		.optional(),
});

export type DraftAssistQueryDto = z.infer<typeof draftAssistQuerySchema>;
