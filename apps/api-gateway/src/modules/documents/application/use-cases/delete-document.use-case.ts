import { HTTPException } from "hono/http-exception";
import type { IDocumentRepository } from "../../infrastructure/repositories/document.repository";

type Requester = {
	id: string;
	role: string;
};

export class DeleteDocumentUseCase {
	constructor(private readonly repo: IDocumentRepository) {}

	async execute(id: string, requester: Requester): Promise<void> {
		const record = await this.repo.findById(id);
		if (!record) {
			throw new HTTPException(404, { message: "Document not found." });
		}

		// Admins may remove any document; the uploader may remove their own;
		// the judge assigned to the case may remove documents within it.
		const access = await this.repo.findCaseAccessById(record.caseId);
		const canDelete =
			requester.role === "admin" ||
			record.uploadedBy === requester.id ||
			access?.judgeId === requester.id;

		if (!canDelete) {
			throw new HTTPException(403, {
				message: "No tienes permiso para eliminar este documento.",
			});
		}

		await this.repo.deleteById(id);
	}
}
