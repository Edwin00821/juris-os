import { Hono } from "hono";
import { validate } from "../../../core/http/zod-validator";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { createDocumentSchema } from "../application/dtos/create-document.dto";
import { documentsController } from "./documents.controller";

const documentsRouter = new Hono();

documentsRouter.use("/*", requireAuth);

documentsRouter.post(
	"/",
	validate("json", createDocumentSchema),
	documentsController.create,
);
documentsRouter.delete("/:id", documentsController.delete);

export { documentsRouter };
