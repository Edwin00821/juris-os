import { Hono } from "hono";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { documentsController } from "./documents.controller";

const caseDocumentsRouter = new Hono();

caseDocumentsRouter.use("/*", requireAuth);

caseDocumentsRouter.get("/", documentsController.listByCaseNumber);

export { caseDocumentsRouter };
