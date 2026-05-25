import { Hono } from "hono";
import {
	requireAuth,
	requireRole,
} from "../../../core/middlewares/auth.middleware";
import { usersController } from "./users.controller";

const usersRouter = new Hono();

usersRouter.use("/*", requireAuth);

usersRouter.get("/judges", requireRole("admin"), usersController.listJudges);

export { usersRouter };
