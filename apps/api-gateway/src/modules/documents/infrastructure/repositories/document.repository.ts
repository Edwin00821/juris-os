import type { DocumentRecord } from "@juris-os/db/schema/document.schema";
import type { CreateDocumentDto } from "../../application/dtos/create-document.dto";

export type CaseAccess = {
	ownerId: string;
	judgeId: string | null;
};

export interface IDocumentRepository {
	create(uploadedBy: string, dto: CreateDocumentDto): Promise<DocumentRecord>;
	findByCaseId(caseId: string): Promise<DocumentRecord[]>;
	findByCaseNumber(caseNumber: string): Promise<DocumentRecord[]>;
	findCaseAccessByCaseNumber(caseNumber: string): Promise<CaseAccess | null>;
	findCaseAccessById(caseId: string): Promise<CaseAccess | null>;
	findById(id: string): Promise<DocumentRecord | null>;
	deleteById(id: string): Promise<void>;
	updateMarkdown(id: string, markdownContent: string): Promise<void>;
}
