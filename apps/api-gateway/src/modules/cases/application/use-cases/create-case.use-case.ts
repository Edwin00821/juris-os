import { eventBus } from "../../../../core/events/event-bus";
import type { ICaseRepository } from "../../infrastructure/repositories/case.repository";
import {
	type CaseResponseDto,
	toCaseResponse,
} from "../dtos/case.response.dto";
import type { CreateCaseDto } from "../dtos/create-case.dto";

export class CreateCaseUseCase {
	constructor(private readonly repo: ICaseRepository) {}

	async execute(userId: string, dto: CreateCaseDto): Promise<CaseResponseDto> {
		const record = await this.repo.create(userId, dto);

		await eventBus.emit({
			id: crypto.randomUUID(),
			type: "CaseCreated",
			occurredAt: new Date(),
			payload: {
				caseId: record.id,
				userId,
				caseType: record.category,
				aiMode: "MANUAL",
				title: record.title,
			},
		});

		return toCaseResponse(record);
	}
}
