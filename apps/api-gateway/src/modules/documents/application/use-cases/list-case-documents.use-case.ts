import { HTTPException } from "hono/http-exception";
import type { IDocumentRepository } from "../../infrastructure/repositories/document.repository";
import {
	type DocumentResponseDto,
	toDocumentResponse,
} from "../dtos/document.response.dto";

type Requester = {
	id: string;
	role: string;
};

export class ListCaseDocumentsUseCase {
	constructor(private readonly repo: IDocumentRepository) {}

	async execute(
		caseNumber: string,
		requester: Requester,
	): Promise<DocumentResponseDto[]> {
		const access = await this.repo.findCaseAccessByCaseNumber(caseNumber);

		if (!access) {
			throw new HTTPException(404, {
				message: `El caso ${caseNumber} no existe`,
			});
		}

		// Admins see every case; judges only the cases assigned to them;
		// citizens only the cases they filed.
		const canAccess =
			requester.role === "admin" ||
			access.ownerId === requester.id ||
			access.judgeId === requester.id;

		if (!canAccess) {
			throw new HTTPException(403, {
				message: "No tienes permiso para ver los documentos de este caso",
			});
		}

		const records = await this.repo.findByCaseNumber(caseNumber);
		return records.map(toDocumentResponse);
	}
}
