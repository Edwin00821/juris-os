import type { Context } from "hono";
import { created, ok } from "../../../core/http/response.helper";
import type { CreateDocumentDto } from "../application/dtos/create-document.dto";
import { registerDocumentParserHandler } from "../application/services/document-parser.service";
import { CreateDocumentUseCase } from "../application/use-cases/create-document.use-case";
import { DeleteDocumentUseCase } from "../application/use-cases/delete-document.use-case";
import { ListCaseDocumentsUseCase } from "../application/use-cases/list-case-documents.use-case";
import { PgDocumentRepository } from "../infrastructure/repositories/pg-document.repository";

const repo = new PgDocumentRepository();
const createDocument = new CreateDocumentUseCase(repo);
const listCaseDocuments = new ListCaseDocumentsUseCase(repo);
const deleteDocument = new DeleteDocumentUseCase(repo);

registerDocumentParserHandler(repo);

export const documentsController = {
	async create(c: Context) {
		const user = c.get("user");
		const body = c.req.valid("json" as never) as CreateDocumentDto;
		const result = await createDocument.execute(user.id, body);
		return created(c, result);
	},

	async listByCaseNumber(c: Context) {
		const user = c.get("user");
		const caseNumber = c.req.param("caseNumber");
		if (!caseNumber) {
			return c.json(
				{
					success: false,
					error: {
						code: "BAD_REQUEST",
						message: "El número de expediente es requerido.",
					},
				},
				400,
			);
		}
		const docs = await listCaseDocuments.execute(caseNumber, {
			id: user.id,
			role: user.role,
		});
		return ok(c, docs);
	},

	async delete(c: Context) {
		const user = c.get("user");
		const { id } = c.req.param();
		await deleteDocument.execute(
			// biome-ignore lint/style/noNonNullAssertion: route param is always present
			id!,
			{ id: user.id, role: user.role },
		);
		return ok(c, { message: "Documento eliminado." });
	},
};
