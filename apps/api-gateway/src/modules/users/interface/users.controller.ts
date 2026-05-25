import type { Context } from "hono";
import { ok } from "../../../core/http/response.helper";
import { PgUserRepository } from "../infrastructure/repositories/pg-user.repository";

const repo = new PgUserRepository();

export const usersController = {
	async listJudges(c: Context) {
		const judges = await repo.listJudges();
		return ok(c, judges);
	},
};
