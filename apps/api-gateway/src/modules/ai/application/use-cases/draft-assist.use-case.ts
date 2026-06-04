import type { DraftAssistQueryDto } from "../dtos/draft-assist-query.dto";
import {
	askDraftAssist,
	type DraftAssistResponse,
} from "../services/ai-draft-assist.service";

export class DraftAssistUseCase {
	async execute(dto: DraftAssistQueryDto): Promise<DraftAssistResponse> {
		return askDraftAssist({
			messages: dto.messages,
			counterparty: dto.counterparty,
		});
	}
}
