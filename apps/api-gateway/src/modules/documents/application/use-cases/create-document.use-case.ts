import { eventBus } from "../../../../core/events/event-bus";
import type { IDocumentRepository } from "../../infrastructure/repositories/document.repository";
import type { CreateDocumentDto } from "../dtos/create-document.dto";
import {
	type DocumentResponseDto,
	toDocumentResponse,
} from "../dtos/document.response.dto";

export class CreateDocumentUseCase {
	constructor(private readonly repo: IDocumentRepository) {}

	async execute(
		uploadedBy: string,
		dto: CreateDocumentDto,
	): Promise<DocumentResponseDto> {
		const record = await this.repo.create(uploadedBy, dto);

		await eventBus.emit({
			id: crypto.randomUUID(),
			type: "DocumentUploaded",
			occurredAt: new Date(),
			payload: {
				documentId: record.id,
				caseId: record.caseId,
				storageKey: record.storageKey,
				documentType: record.documentType,
			},
		});

		return toDocumentResponse(record);
	}
}
