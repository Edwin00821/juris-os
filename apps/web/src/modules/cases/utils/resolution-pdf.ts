import { jsPDF } from "jspdf";
import { getCategoryLabel } from "./case-category";

export interface ResolutionPdfData {
	id: string; // caseNumber (e.g. CIV-2025-0001)
	title: string;
	category: string;
	registrationDate: string;
	resolution: "admitted" | "conditioned" | "rejected" | null;
	resolutionText: string | null;
	judgeName: string | null;
}

const RESOLUTION_LABELS: Record<
	"admitted" | "conditioned" | "rejected",
	string
> = {
	admitted: "Admitida",
	conditioned: "Prevenida",
	rejected: "Rechazada",
};

function resolutionLabel(resolution: ResolutionPdfData["resolution"]): string {
	return resolution ? RESOLUTION_LABELS[resolution] : "Resuelta";
}

function decodeEntities(value: string): string {
	return value
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"');
}

// A contiguous slice of text sharing the same emphasis, parsed from TipTap HTML.
type RichRun = { text: string; bold: boolean; italic: boolean };

// The sentence body is stored as TipTap HTML. Parse it into paragraphs of
// styled runs so the PDF can preserve bold/italic instead of flattening it.
function parseRichHtml(html: string): RichRun[][] {
	const withBreaks = html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/(p|div|h[1-6]|li)>/gi, "\n");

	const paragraphs: RichRun[][] = [];
	let current: RichRun[] = [];
	let buffer = "";
	let bold = 0;
	let italic = 0;

	const flushText = () => {
		if (buffer) {
			current.push({
				text: decodeEntities(buffer),
				bold: bold > 0,
				italic: italic > 0,
			});
			buffer = "";
		}
	};
	const flushParagraph = () => {
		flushText();
		if (current.length > 0) paragraphs.push(current);
		current = [];
	};

	for (let i = 0; i < withBreaks.length; ) {
		const ch = withBreaks[i];
		if (ch === "\n") {
			flushParagraph();
			i += 1;
		} else if (ch === "<") {
			const close = withBreaks.indexOf(">", i);
			if (close === -1) {
				buffer += ch;
				i += 1;
				continue;
			}
			const tag = withBreaks
				.slice(i + 1, close)
				.trim()
				.toLowerCase();
			flushText();
			if (tag === "strong" || tag === "b") bold += 1;
			else if (tag === "/strong" || tag === "/b") bold = Math.max(0, bold - 1);
			else if (tag === "em" || tag === "i") italic += 1;
			else if (tag === "/em" || tag === "/i") italic = Math.max(0, italic - 1);
			i = close + 1;
		} else {
			buffer += ch;
			i += 1;
		}
	}
	flushParagraph();
	return paragraphs;
}

export function downloadResolutionPdf(caseData: ResolutionPdfData): void {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const marginX = 56;
	const marginBottom = 64;
	const contentWidth = pageWidth - marginX * 2;
	let y = 72;

	// Add a page break when the next block would overflow the bottom margin,
	// so long resolutions paginate cleanly.
	const ensureSpace = (needed: number) => {
		if (y + needed > pageHeight - marginBottom) {
			doc.addPage();
			y = 72;
		}
	};

	// Encabezado del tribunal
	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(0, 32, 69);
	doc.text("EN EL TRIBUNAL DE DISTRITO", pageWidth / 2, y, { align: "center" });
	y += 16;
	doc.text("DEL SISTEMA DE JUSTICIA SOBERANA", pageWidth / 2, y, {
		align: "center",
	});
	y += 18;
	doc.setDrawColor(0, 32, 69);
	doc.setLineWidth(2);
	doc.line(pageWidth / 2 - 30, y, pageWidth / 2 + 30, y);
	y += 32;

	// Expediente
	doc.setFontSize(10);
	doc.setTextColor(148, 163, 184);
	doc.text(`EXPEDIENTE ${caseData.id}`, marginX, y);
	y += 24;

	// Estado
	doc.setFontSize(12);
	doc.setTextColor(6, 95, 70);
	doc.text(
		`ESTADO: CASO CERRADO — ${resolutionLabel(caseData.resolution).toUpperCase()}`,
		marginX,
		y,
	);
	y += 30;

	// Campos
	const addField = (label: string, value: string) => {
		ensureSpace(42);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(30, 41, 59);
		doc.text(`${label}:`, marginX, y);
		const labelWidth = doc.getTextWidth(`${label}: `);
		doc.setFont("helvetica", "normal");
		const lines = doc.splitTextToSize(
			value,
			contentWidth - labelWidth,
		) as string[];
		doc.text(lines[0] ?? "", marginX + labelWidth, y);
		for (let i = 1; i < lines.length; i++) {
			y += 16;
			ensureSpace(16);
			doc.text(lines[i], marginX, y);
		}
		y += 26;
	};

	const registrationDate = new Date(
		caseData.registrationDate,
	).toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	addField("TÍTULO", caseData.title);
	addField("CATEGORÍA", getCategoryLabel(caseData.category));
	addField("FECHA DE REGISTRO", registrationDate);

	// Cuerpo de la sentencia redactada por el juez, conservando negritas/itálicas.
	// jsPDF no soporta formato inline, así que renderizamos token a token
	// alternando el peso de la fuente y ajustando las líneas a mano.
	if (caseData.resolutionText) {
		ensureSpace(42);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(30, 41, 59);
		doc.text("RESOLUCIÓN:", marginX, y);
		y += 20;

		const lineHeight = 16;
		const fontStyle = (bold: boolean, italic: boolean) =>
			bold && italic
				? "bolditalic"
				: bold
					? "bold"
					: italic
						? "italic"
						: "normal";

		doc.setFontSize(11);
		doc.setTextColor(30, 41, 59);
		for (const runs of parseRichHtml(caseData.resolutionText)) {
			// Split each run into words/whitespace, carrying its emphasis along.
			const tokens: RichRun[] = [];
			for (const run of runs) {
				for (const part of run.text.split(/(\s+)/)) {
					if (part !== "") tokens.push({ ...run, text: part });
				}
			}

			let x = marginX;
			ensureSpace(lineHeight);
			for (const token of tokens) {
				const isSpace = /^\s+$/.test(token.text);
				doc.setFont("helvetica", fontStyle(token.bold, token.italic));
				const width = doc.getTextWidth(token.text);
				if (!isSpace && x + width > marginX + contentWidth) {
					x = marginX;
					y += lineHeight;
					ensureSpace(lineHeight);
				}
				// Drop whitespace that lands at the start of a wrapped line.
				if (isSpace && x === marginX) continue;
				doc.text(token.text, x, y);
				x += width;
			}
			y += lineHeight + 6;
		}
		y += 4;
	}

	// Firma digital
	if (caseData.judgeName) {
		ensureSpace(60);
		y += 8;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10);
		doc.setTextColor(0, 32, 69);
		doc.text("FIRMA DIGITAL", marginX, y);
		y += 20;
		doc.setFontSize(12);
		doc.text(caseData.judgeName, marginX, y);
		y += 16;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(100, 116, 139);
		doc.text("Tribunal de Distrito — Sistema Juris OS", marginX, y);
	}

	doc.save(`Expediente-${caseData.id}.pdf`);
}
