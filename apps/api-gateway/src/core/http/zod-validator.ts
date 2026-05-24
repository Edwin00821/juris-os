import { zValidator as honoZValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";

type ValidatorTarget = "json" | "query" | "param" | "form" | "header";

// Wraps @hono/zod-validator to re-throw ZodError instead of responding directly.
// The global onError in app.ts catches it and formats a consistent 422 JSON:API response.
export const validate = <T extends ZodType>(
	target: ValidatorTarget,
	schema: T,
) => {
	return honoZValidator(target, schema, (result) => {
		if (!result.success) {
			if ("error" in result) {
				throw result.error;
			}
		}
	});
};
