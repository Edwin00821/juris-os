export type DocumentType =
	| "evidence"
	| "motion"
	| "brief"
	| "judgment"
	| "other";

export interface Document {
	id: string;
	caseId: string;
	fileName: string;
	fileType: string;
	fileUrl: string;
	documentType: DocumentType;
	uploadedBy: string;
	createdAt: string;
}

export interface DocumentsApiResponse {
	success: true;
	data: Document[];
}

export interface CreateDocumentApiResponse {
	success: true;
	data: Document;
}
