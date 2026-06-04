import type { DocumentRecord } from "@juris-os/db/schema/document.schema";
import type { DocumentType } from "../../domain/document.types";

export type DocumentResponseDto = {
	id: string;
	caseId: string;
	fileName: string;
	fileType: string;
	fileUrl: string;
	documentType: DocumentType;
	uploadedBy: string;
	createdAt: string;
};

export const toDocumentResponse = (
	doc: DocumentRecord,
): DocumentResponseDto => ({
	id: doc.id,
	caseId: doc.caseId,
	fileName: doc.fileName,
	fileType: doc.fileType,
	fileUrl: doc.fileUrl,
	documentType: doc.documentType as DocumentType,
	uploadedBy: doc.uploadedBy,
	createdAt: doc.createdAt.toISOString(),
});
