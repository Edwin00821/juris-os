import type { DocumentRecord } from "@juris-os/db/schema/document.schema";
import type { CreateDocumentDto } from "./application/dtos/create-document.dto";
import type {
	CaseAccess,
	IDocumentRepository,
} from "./infrastructure/repositories/document.repository";

/**
 * Test support for the documents module: a `DocumentRecord` factory and an
 * in-memory `IDocumentRepository` for the Phase 1 use-case unit tests.
 */

let seq = 0;

export function makeDocument(
	overrides: Partial<DocumentRecord> = {},
): DocumentRecord {
	seq += 1;
	const padded = String(seq).padStart(12, "0");
	return {
		id: `10000000-0000-0000-0000-${padded}`,
		caseId: "20000000-0000-0000-0000-000000000001",
		fileName: "evidence.pdf",
		fileType: "application/pdf",
		storageKey: `key-${seq}`,
		fileUrl: "https://files.example.com/evidence.pdf",
		markdownContent: null,
		documentType: "evidence",
		uploadedBy: "user-1",
		createdAt: new Date("2025-01-02T00:00:00.000Z"),
		updatedAt: new Date("2025-01-02T00:00:00.000Z"),
		...overrides,
	};
}

export class FakeDocumentRepository implements IDocumentRepository {
	private readonly store = new Map<string, DocumentRecord>();

	constructor(
		initial: DocumentRecord[] = [],
		private readonly caseAccess: Record<string, CaseAccess> = {},
	) {
		for (const doc of initial) this.store.set(doc.id, doc);
	}

	has(id: string): boolean {
		return this.store.has(id);
	}

	async create(
		uploadedBy: string,
		dto: CreateDocumentDto,
	): Promise<DocumentRecord> {
		const record = makeDocument({
			uploadedBy,
			caseId: dto.caseId,
			fileName: dto.fileName,
			fileType: dto.fileType,
			storageKey: dto.storageKey,
			fileUrl: dto.fileUrl,
			documentType: dto.documentType,
		});
		this.store.set(record.id, record);
		return record;
	}

	async findById(id: string): Promise<DocumentRecord | null> {
		return this.store.get(id) ?? null;
	}

	async findCaseAccessById(caseId: string): Promise<CaseAccess | null> {
		return this.caseAccess[caseId] ?? null;
	}

	async deleteById(id: string): Promise<void> {
		this.store.delete(id);
	}

	findByCaseId(): Promise<DocumentRecord[]> {
		throw new Error("not implemented in FakeDocumentRepository");
	}

	findByCaseNumber(): Promise<DocumentRecord[]> {
		throw new Error("not implemented in FakeDocumentRepository");
	}

	findCaseAccessByCaseNumber(): Promise<CaseAccess | null> {
		throw new Error("not implemented in FakeDocumentRepository");
	}

	updateMarkdown(): Promise<void> {
		throw new Error("not implemented in FakeDocumentRepository");
	}
}
