import type { Context } from "hono";
import { ok } from "../../../core/http/response.helper";
import { PgCaseRepository } from "../../cases/infrastructure/repositories/pg-case.repository";
import { PgDocumentRepository } from "../../documents/infrastructure/repositories/pg-document.repository";
import { PgUserRepository } from "../../users/infrastructure/repositories/pg-user.repository";
import type { CopilotQueryDto } from "../application/dtos/copilot-query.dto";
import type { DraftAssistQueryDto } from "../application/dtos/draft-assist-query.dto";
import type { GenerateDocumentQueryDto } from "../application/dtos/generate-document-query.dto";
import type { SuggestJudgeQueryDto } from "../application/dtos/suggest-judge-query.dto";
import { DraftAssistUseCase } from "../application/use-cases/draft-assist.use-case";
import { GenerateDocumentUseCase } from "../application/use-cases/generate-document.use-case";
import { QueryCopilotUseCase } from "../application/use-cases/query-copilot.use-case";
import { SuggestJudgeUseCase } from "../application/use-cases/suggest-judge.use-case";

const documentRepo = new PgDocumentRepository();
const caseRepo = new PgCaseRepository();
const userRepo = new PgUserRepository();
const queryCopilot = new QueryCopilotUseCase(documentRepo, caseRepo);
const draftAssist = new DraftAssistUseCase();
const generateDocument = new GenerateDocumentUseCase();
const suggestJudgeUseCase = new SuggestJudgeUseCase(caseRepo, userRepo);

export const aiController = {
	async copilot(c: Context) {
		const body = c.req.valid("json" as never) as CopilotQueryDto;
		const result = await queryCopilot.execute(body);
		return ok(c, result);
	},

	async draftAssist(c: Context) {
		const body = c.req.valid("json" as never) as DraftAssistQueryDto;
		const result = await draftAssist.execute(body);
		return ok(c, result);
	},

	async generateDocument(c: Context) {
		const body = c.req.valid("json" as never) as GenerateDocumentQueryDto;
		const result = await generateDocument.execute(body);
		return ok(c, result);
	},

	async suggestJudge(c: Context) {
		const body = c.req.valid("json" as never) as SuggestJudgeQueryDto;
		const result = await suggestJudgeUseCase.execute(body);
		return ok(c, result);
	},
};
