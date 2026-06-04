import { HTTPException } from "hono/http-exception";
import type { ICaseRepository } from "../../../cases/infrastructure/repositories/case.repository";
import type { PgUserRepository } from "../../../users/infrastructure/repositories/pg-user.repository";
import type { SuggestJudgeQueryDto } from "../dtos/suggest-judge-query.dto";
import {
	type SuggestJudgeResult,
	suggestJudge,
} from "../services/ai-suggest-judge.service";

export class SuggestJudgeUseCase {
	constructor(
		private readonly caseRepo: ICaseRepository,
		private readonly userRepo: PgUserRepository,
	) {}

	async execute(dto: SuggestJudgeQueryDto): Promise<SuggestJudgeResult> {
		const case_ = await this.caseRepo.findByCaseNumber(dto.caseNumber);
		if (!case_) {
			throw new HTTPException(404, {
				message: `El caso ${dto.caseNumber} no existe.`,
			});
		}

		const judges = await this.userRepo.listJudges();
		if (judges.length === 0) {
			throw new HTTPException(404, {
				message: "No hay jueces registrados para asignar.",
			});
		}

		return suggestJudge({
			case_: {
				caseNumber: case_.caseNumber,
				category: case_.category,
				priority: case_.priority,
			},
			judges,
		});
	}
}
