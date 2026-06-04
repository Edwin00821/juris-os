import type { Context } from "hono";
import { created, fail, ok } from "../../../core/http/response.helper";
import {
	toCaseDetail,
	toCaseResponse,
} from "../application/dtos/case.response.dto";
import type { CloseCaseDto } from "../application/dtos/close-case.dto";
import type { CreateCaseDto } from "../application/dtos/create-case.dto";
import type { UpdateCaseStatusDto } from "../application/dtos/update-case-status.dto";
import { AssignCaseUseCase } from "../application/use-cases/assign-case.use-case";
import { CloseCaseUseCase } from "../application/use-cases/close-case.use-case";
import { CreateCaseUseCase } from "../application/use-cases/create-case.use-case";
import { ListAllCasesUseCase } from "../application/use-cases/list-all-cases.use-case";
import { ListCasesUseCase } from "../application/use-cases/list-cases.use-cases";
import { ListJudgeCasesUseCase } from "../application/use-cases/list-judge-cases.use-case";
import { UpdateCaseStatusUseCase } from "../application/use-cases/update-case-status.use-case";
import type { InternalCaseStatus } from "../domain/case.types";
import type { PaginationParams } from "../infrastructure/repositories/case.repository";
import { PgCaseRepository } from "../infrastructure/repositories/pg-case.repository";

const repo = new PgCaseRepository();
const createCase = new CreateCaseUseCase(repo);
const listCases = new ListCasesUseCase(repo);
const listAllCases = new ListAllCasesUseCase(repo);
const listJudgeCases = new ListJudgeCasesUseCase(repo);
const assignCaseUseCase = new AssignCaseUseCase(repo);
const closeCaseUseCase = new CloseCaseUseCase(repo);
const updateCaseStatusUseCase = new UpdateCaseStatusUseCase(repo);

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
			closed = "",
		} = c.req.query();

		const pagination: PaginationParams = {
			page: Math.max(1, Number.parseInt(page, 10)),
			pageSize: Math.min(50, Math.max(1, Number.parseInt(pageSize, 10))),
			status: STATUS_FILTER_MAP[status.toUpperCase()],
			assigned:
				assigned === "true" ? true : assigned === "false" ? false : undefined,
			closed: closed === "true" ? true : closed === "false" ? false : undefined,
		};

		let result: { data: unknown[]; totalCount: number; totalPages: number };

		if (user.role === "admin") {
			result = await listAllCases.execute(pagination);
		} else if (user.role === "judge") {
			result = await listJudgeCases.execute(user.id, pagination);
		} else {
			result = await listCases.execute(user.id, pagination);
		}

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
		const user = c.get("user");

		if (user.role === "judge") {
			// biome-ignore lint/style/noNonNullAssertion: route param is always present
			const record = await repo.findDetailByCaseNumber(id!);
			if (!record) {
				return fail(c, "CASE_NOT_FOUND", "Case not found.", 404);
			}
			return ok(c, toCaseDetail(record));
		}

		// biome-ignore lint/style/noNonNullAssertion: route param is always present
		const record = await repo.findByCaseNumber(id!);
		if (!record) {
			return fail(c, "CASE_NOT_FOUND", "Case not found.", 404);
		}
		return ok(c, toCaseResponse(record));
	},

	async assignCase(c: Context) {
		const user = c.get("user");
		// biome-ignore lint/style/noNonNullAssertion: route param is always present
		const caseNumber = c.req.param("id")!;
		const { judgeId } = c.req.valid("json" as never);

		await assignCaseUseCase.execute({
			caseNumber,
			judgeId,
			requestedBy: user.id,
		});

		return ok(c, { message: `Case ${caseNumber} assigned successfully` });
	},

	async closeCase(c: Context) {
		const user = c.get("user");
		// biome-ignore lint/style/noNonNullAssertion: route param is always present
		const caseNumber = c.req.param("id")!;
		const { resolution, resolutionText } = c.req.valid(
			"json" as never,
		) as CloseCaseDto;

		await closeCaseUseCase.execute({
			caseNumber,
			resolution,
			resolutionText,
			requestedBy: user.id,
		});

		return ok(c, { message: `Case ${caseNumber} closed successfully` });
	},

	async updateStatus(c: Context) {
		const user = c.get("user");
		// biome-ignore lint/style/noNonNullAssertion: route param is always present
		const caseNumber = c.req.param("id")!;
		const { status } = c.req.valid("json" as never) as UpdateCaseStatusDto;

		await updateCaseStatusUseCase.execute({
			caseNumber,
			status,
			requestedBy: user.id,
		});

		return ok(c, { message: `Case ${caseNumber} status updated to ${status}` });
	},
};
