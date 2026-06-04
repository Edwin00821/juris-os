import { HTTPException } from "hono/http-exception";
import type { ICaseRepository } from "../../../cases/infrastructure/repositories/case.repository";
import type { IDocumentRepository } from "../../../documents/infrastructure/repositories/document.repository";
import type { CopilotQueryDto } from "../dtos/copilot-query.dto";
import {
	askCopilot,
	type CopilotResponse,
} from "../services/ai-copilot.service";

export class QueryCopilotUseCase {
	constructor(
		private readonly documentRepo: IDocumentRepository,
		private readonly caseRepo: ICaseRepository,
	) {}

	async execute(dto: CopilotQueryDto): Promise<CopilotResponse> {
		const existing = await this.caseRepo.findByCaseNumber(dto.caseNumber);

		if (existing?.status === "CLOSED") {
			throw new HTTPException(409, {
				message: `El caso ${dto.caseNumber} está cerrado; el copiloto no está disponible.`,
			});
		}

		const docs = await this.documentRepo.findByCaseNumber(dto.caseNumber);

		return askCopilot({
			caseNumber: dto.caseNumber,
			question: dto.question,
			documents: docs.map((d) => ({
				fileName: d.fileName,
				markdownContent: d.markdownContent,
			})),
		});
	}
}
