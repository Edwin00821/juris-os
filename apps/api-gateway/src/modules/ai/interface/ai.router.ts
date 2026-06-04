import { Hono } from "hono";
import { validate } from "../../../core/http/zod-validator";
import {
	requireAuth,
	requireRole,
} from "../../../core/middlewares/auth.middleware";
import { copilotQuerySchema } from "../application/dtos/copilot-query.dto";
import { draftAssistQuerySchema } from "../application/dtos/draft-assist-query.dto";
import { generateDocumentQuerySchema } from "../application/dtos/generate-document-query.dto";
import { aiController } from "./ai.controller";

const aiRouter = new Hono();

aiRouter.use("/*", requireAuth);

aiRouter.post(
	"/copilot",
	requireRole("judge"),
	validate("json", copilotQuerySchema),
	aiController.copilot,
);

aiRouter.post(
	"/draft-assist",
	validate("json", draftAssistQuerySchema),
	aiController.draftAssist,
);

aiRouter.post(
	"/generate-document",
	validate("json", generateDocumentQuerySchema),
	aiController.generateDocument,
);

export { aiRouter };
