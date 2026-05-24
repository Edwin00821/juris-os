import type { Context } from "hono";
import { created, fail, ok } from "../../../core/http/response.helper";
import type { CreateCaseDto } from "../application/dtos/create-case.dto";
import { CreateCaseUseCase } from "../application/use-cases/create-case.use-case";
import { ListCasesUseCase } from "../application/use-cases/list-cases.use-cases";
import { PgCaseRepository } from "../infrastructure/repositories/pg-case.repository";

const repo = new PgCaseRepository();
const createCase = new CreateCaseUseCase(repo);
const listCases = new ListCasesUseCase(repo);

export const casesController = {
	async create(c: Context) {
		const user = c.get("user");
		const body = c.req.valid("json" as never) as CreateCaseDto;

		const caseResponse = await createCase.execute(user.id, body);
		return created(c, caseResponse);
	},

	async list(c: Context) {
		const user = c.get("user");
		const { page = "1", pageSize = "10" } = c.req.query();

		console.log(user);
		console.log({ page, pageSize });

		const pagination = {
			page: Math.max(1, Number.parseInt(page, 10)),
			pageSize: Math.min(50, Math.max(1, Number.parseInt(pageSize, 10))),
		};

		const result = await listCases.execute(user.id, pagination);

		return ok(c, result.data, 200, {
			totalCount: result.totalCount,
			totalPages: result.totalPages,
			page: pagination.page,
			pageSize: pagination.pageSize,
		});
	},

	async getOne(c: Context) {
		const user = c.get("user");
		const { id } = c.req.param();

		// id from the frontend is the caseNumber (CIV-2025-0001), not the UUID
		// biome-ignore lint/style/noNonNullAssertion: <>
		const record = await repo.findByCaseNumber(id!, user.id);

		if (!record) {
			return fail(c, "CASE_NOT_FOUND", "Case not found.", 404);
		}

		const { toCaseResponse } = await import(
			"../application/dtos/case.response.dto"
		);
		return ok(c, toCaseResponse(record));
	},
};
