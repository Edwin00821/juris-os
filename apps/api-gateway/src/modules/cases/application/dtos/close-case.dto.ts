import { z } from "zod";

export const closeCaseSchema = z.object({
	resolution: z
		.enum(["admitted", "conditioned", "rejected"])
		.default("admitted"),
	resolutionText: z.string().optional(),
});

export type CloseCaseDto = z.infer<typeof closeCaseSchema>;
