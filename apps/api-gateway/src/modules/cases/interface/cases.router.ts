import { Hono } from "hono";

import { validate } from "../../../core/http/zod-validator";
import {
	requireAuth,
	requireRole,
} from "../../../core/middlewares/auth.middleware";
import { assignCaseSchema } from "../application/dtos/assign-case.dto";
import { closeCaseSchema } from "../application/dtos/close-case.dto";
import { createCaseSchema } from "../application/dtos/create-case.dto";
import { updateCaseStatusSchema } from "../application/dtos/update-case-status.dto";

import { casesController } from "./cases.controller";

const casesRouter = new Hono();

casesRouter.use("/*", requireAuth);

casesRouter.get("/", casesController.list);

casesRouter.post(
	"/",
	validate("json", createCaseSchema),
	casesController.create,
);

casesRouter.get("/:id", casesController.getOne);

casesRouter.patch(
	"/:id/assign",
	requireRole("admin"),
	validate("json", assignCaseSchema),
	casesController.assignCase,
);

casesRouter.patch(
	"/:id/status",
	requireRole("judge"),
	validate("json", updateCaseStatusSchema),
	casesController.updateStatus,
);

casesRouter.patch(
	"/:id/close",
	requireRole("judge"),
	validate("json", closeCaseSchema),
	casesController.closeCase,
);

export { casesRouter };
