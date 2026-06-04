import type { GenerateDocumentQueryDto } from "../dtos/generate-document-query.dto";
import { generateLawsuitDocument } from "../services/ai-generate-document.service";

export class GenerateDocumentUseCase {
	async execute(dto: GenerateDocumentQueryDto): Promise<{ document: string }> {
		return generateLawsuitDocument(dto);
	}
}
