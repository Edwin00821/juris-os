import { Hono } from "hono";
import {
	requireAuth,
	requireRole,
} from "../../../core/middlewares/auth.middleware";
import { analyticsController } from "./analytics.controller";

const analyticsRouter = new Hono();

analyticsRouter.use("/*", requireAuth);

analyticsRouter.get(
	"/dashboard",
	requireRole("admin"),
	analyticsController.dashboard,
);

export { analyticsRouter };
