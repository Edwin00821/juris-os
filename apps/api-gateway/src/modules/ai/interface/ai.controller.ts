import type { Context } from "hono";
import { ok } from "../../../core/http/response.helper";
import { PgCaseRepository } from "../../cases/infrastructure/repositories/pg-case.repository";
import { PgDocumentRepository } from "../../documents/infrastructure/repositories/pg-document.repository";
import type { CopilotQueryDto } from "../application/dtos/copilot-query.dto";
import type { DraftAssistQueryDto } from "../application/dtos/draft-assist-query.dto";
import type { GenerateDocumentQueryDto } from "../application/dtos/generate-document-query.dto";
import { DraftAssistUseCase } from "../application/use-cases/draft-assist.use-case";
import { GenerateDocumentUseCase } from "../application/use-cases/generate-document.use-case";
import { QueryCopilotUseCase } from "../application/use-cases/query-copilot.use-case";

const documentRepo = new PgDocumentRepository();
const caseRepo = new PgCaseRepository();
const queryCopilot = new QueryCopilotUseCase(documentRepo, caseRepo);
const draftAssist = new DraftAssistUseCase();
const generateDocument = new GenerateDocumentUseCase();

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
};
