// pdf-parse ships a CJS module; use createRequire for ESM compatibility
import { createRequire } from "node:module";
import mammoth from "mammoth";
import { eventBus } from "../../../../core/events/event-bus";
import type { DocumentUploadedEvent } from "../../../../core/events/event-types";
import type { IDocumentRepository } from "../../infrastructure/repositories/document.repository";

const require = createRequire(import.meta.url);
// biome-ignore lint/suspicious/noExplicitAny: pdf-parse has no ESM default export
const pdfParse = require("pdf-parse") as (
	buffer: Buffer,
) => Promise<{ text: string }>;

async function fetchBuffer(url: string): Promise<Buffer> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch document: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	return Buffer.from(arrayBuffer);
}

async function extractText(
	fileUrl: string,
	fileType: string,
): Promise<string | null> {
	if (fileType === "application/pdf") {
		const buffer = await fetchBuffer(fileUrl);
		const result = await pdfParse(buffer);
		return result.text.trim();
	}

	if (
		fileType ===
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		const buffer = await fetchBuffer(fileUrl);
		const result = await mammoth.extractRawText({ buffer });
		return result.value.trim();
	}

	return null;
}

export function registerDocumentParserHandler(repo: IDocumentRepository): void {
	eventBus.on<DocumentUploadedEvent>("DocumentUploaded", async (event) => {
		const { documentId } = event.payload;

		const document = await repo.findById(documentId);
		if (!document) return;

		const text = await extractText(document.fileUrl, document.fileType);
		if (!text) return;

		await repo.updateMarkdown(documentId, text);
	});
}
