import type { Context } from "hono";
import { created, fail, ok } from "../../../core/http/response.helper";
import { toCaseResponse } from "../application/dtos/case.response.dto";
import type { CreateCaseDto } from "../application/dtos/create-case.dto";
import { AssignCaseUseCase } from "../application/use-cases/assign-case.use-case";
import { CreateCaseUseCase } from "../application/use-cases/create-case.use-case";
import { ListAllCasesUseCase } from "../application/use-cases/list-all-cases.use-case";
import { ListCasesUseCase } from "../application/use-cases/list-cases.use-cases";
import type { InternalCaseStatus } from "../domain/case.types";
import type { PaginationParams } from "../infrastructure/repositories/case.repository";
import { PgCaseRepository } from "../infrastructure/repositories/pg-case.repository";

const repo = new PgCaseRepository();
const createCase = new CreateCaseUseCase(repo);
const listCases = new ListCasesUseCase(repo);
const listAllCases = new ListAllCasesUseCase(repo);
const assignCaseUseCase = new AssignCaseUseCase(repo);

const STATUS_FILTER_MAP: Record<string, InternalCaseStatus> = {
	OPEN: "OPEN",
	UNDER_REVIEW: "UNDER_REVIEW",
	PENDING_RESOLUTION: "PENDING_RESOLUTION",
};

export const casesController = {
	async create(c: Context) {
		const user = c.get("user");
		const body = c.req.valid("json" as never) as CreateCaseDto;

		const caseResponse = await createCase.execute(user.id, body);
		return created(c, caseResponse);
	},

	async list(c: Context) {
		const user = c.get("user");
		const {
			page = "1",
			pageSize = "10",
			status = "",
			assigned = "",
		} = c.req.query();

		const pagination: PaginationParams = {
			page: Math.max(1, Number.parseInt(page, 10)),
			pageSize: Math.min(50, Math.max(1, Number.parseInt(pageSize, 10))),
			status: STATUS_FILTER_MAP[status.toUpperCase()],
			assigned:
				assigned === "true" ? true : assigned === "false" ? false : undefined,
		};

		const result =
			user.role === "admin"
				? await listAllCases.execute(pagination)
				: await listCases.execute(user.id, pagination);

		return ok(c, result.data, 200, {
			totalCount: result.totalCount,
			totalPages: result.totalPages,
			page: pagination.page,
			pageSize: pagination.pageSize,
			...(pagination.status && { status: pagination.status }),
		});
	},

	async getOne(c: Context) {
		const { id } = c.req.param();

		// biome-ignore lint/style/noNonNullAssertion: route param is always present
		const record = await repo.findByCaseNumber(id!);

		if (!record) {
			return fail(c, "CASE_NOT_FOUND", "Case not found.", 404);
		}

		return ok(c, toCaseResponse(record));
	},

	async assignCase(c: Context) {
		const user = c.get("user");
		const caseNumber = c.req.param("id")!;
		const { judgeId } = c.req.valid("json" as never);

		await assignCaseUseCase.execute({
			caseNumber,
			judgeId,
			requestedBy: user.id,
		});

		return ok(c, { message: `Case ${caseNumber} assigned successfully` });
	},
};
