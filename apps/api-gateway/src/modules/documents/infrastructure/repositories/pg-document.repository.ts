import { cases } from "@juris-os/db/schema/case.schema";
import {
	type DocumentRecord,
	documents,
} from "@juris-os/db/schema/document.schema";
import { db } from "@juris-os/db/server";
import { desc, eq } from "drizzle-orm";
import type { CreateDocumentDto } from "../../application/dtos/create-document.dto";
import type { DocumentType } from "../../domain/document.types";
import type { CaseAccess, IDocumentRepository } from "./document.repository";

export class PgDocumentRepository implements IDocumentRepository {
	async create(
		uploadedBy: string,
		dto: CreateDocumentDto,
	): Promise<DocumentRecord> {
		const [record] = await db
			.insert(documents)
			.values({
				caseId: dto.caseId,
				fileName: dto.fileName,
				fileType: dto.fileType,
				storageKey: dto.storageKey,
				fileUrl: dto.fileUrl,
				documentType: dto.documentType as DocumentType,
				uploadedBy,
			})
			.returning();

		return record as DocumentRecord;
	}

	async findByCaseId(caseId: string): Promise<DocumentRecord[]> {
		return db.query.documents.findMany({
			where: eq(documents.caseId, caseId),
			orderBy: [desc(documents.createdAt)],
		}) as Promise<DocumentRecord[]>;
	}

	async findByCaseNumber(caseNumber: string): Promise<DocumentRecord[]> {
		const result = await db
			.select({ documents })
			.from(documents)
			.innerJoin(cases, eq(documents.caseId, cases.id))
			.where(eq(cases.caseNumber, caseNumber))
			.orderBy(desc(documents.createdAt));

		return result.map((r) => r.documents) as DocumentRecord[];
	}

	async findCaseAccessByCaseNumber(
		caseNumber: string,
	): Promise<CaseAccess | null> {
		const [record] = await db
			.select({ ownerId: cases.userId, judgeId: cases.judgeId })
			.from(cases)
			.where(eq(cases.caseNumber, caseNumber))
			.limit(1);

		return record ?? null;
	}

	async findCaseAccessById(caseId: string): Promise<CaseAccess | null> {
		const [record] = await db
			.select({ ownerId: cases.userId, judgeId: cases.judgeId })
			.from(cases)
			.where(eq(cases.id, caseId))
			.limit(1);

		return record ?? null;
	}

	async findById(id: string): Promise<DocumentRecord | null> {
		const record = await db.query.documents.findFirst({
			where: eq(documents.id, id),
		});
		return (record as DocumentRecord) ?? null;
	}

	async deleteById(id: string): Promise<void> {
		await db.delete(documents).where(eq(documents.id, id));
	}

	async updateMarkdown(id: string, markdownContent: string): Promise<void> {
		await db
			.update(documents)
			.set({ markdownContent, updatedAt: new Date() })
			.where(eq(documents.id, id));
	}
}
