"use client";

import { jsPDF } from "jspdf";
import {
	ArrowLeft,
	CheckCircle,
	Download,
	Loader2,
	Lock,
	Printer,
} from "lucide-react";
import Link from "next/link";
import { CaseIntelligencePanel } from "@/modules/case-documents/components/case-intelligence-panel";
import { useCaseDetail } from "@/modules/case-documents/hooks/use-case-detail";

interface ClosedCaseViewPageProps {
	params: { id: string };
}

type CaseDetail = NonNullable<ReturnType<typeof useCaseDetail>["data"]>["data"];

const RESOLUTION_LABELS: Record<
	"admitted" | "conditioned" | "rejected",
	string
> = {
	admitted: "Admitida",
	conditioned: "Condicionada",
	rejected: "Rechazada",
};

function resolutionLabel(resolution: CaseDetail["resolution"]): string {
	return resolution ? RESOLUTION_LABELS[resolution] : "Resuelta";
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
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

function getJudgeInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("");
}

function buildResolutionHtml(caseDetail: CaseDetail): string {
	const title = escapeHtml(caseDetail.title);
	const description = escapeHtml(
		caseDetail.description ?? "Sin descripción disponible.",
	);
	const id = escapeHtml(caseDetail.id);
	const verdict = escapeHtml(resolutionLabel(caseDetail.resolution));
	// resolutionText is already TipTap-sanitised HTML produced by the editor.
	const sentenceBody = caseDetail.resolutionText
		? `
			<p class="section-label">Resolución</p>
			<div class="sentence">${caseDetail.resolutionText}</div>`
		: "";
	const signature = caseDetail.judgeName
		? `
			<p class="section-label">Firma Digital</p>
			<div class="signature">
				<div class="signature-avatar">${escapeHtml(getJudgeInitials(caseDetail.judgeName))}</div>
				<div>
					<p class="signature-name">${escapeHtml(caseDetail.judgeName)}</p>
					<p class="signature-court">Tribunal de Distrito — Sistema Juris OS</p>
				</div>
			</div>`
		: "";

	return `<!doctype html>
<html lang="es">
<head>
	<meta charset="utf-8" />
	<title>Expediente ${id} — Resolución Final</title>
	<style>
		* { box-sizing: border-box; }
		body {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
			color: #1e293b;
			margin: 0;
			padding: 48px;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
		.document { max-width: 720px; margin: 0 auto; }
		.court-header {
			text-align: center;
			font-weight: 700;
			font-size: 13px;
			color: #002045;
			text-transform: uppercase;
			letter-spacing: 0.12em;
			margin-bottom: 8px;
		}
		.divider { width: 80px; height: 2px; background: #002045; margin: 0 auto 32px; }
		.expediente { font-weight: 700; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px; }
		.status { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #6ee7b7; background: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 24px; }
		.field { font-size: 14px; line-height: 1.6; margin-bottom: 16px; }
		.section-label { font-weight: 700; font-size: 12px; color: #002045; text-transform: uppercase; letter-spacing: 0.12em; margin: 24px 0 12px; }
		.signature { display: flex; align-items: center; gap: 16px; background: #f8fafc; padding: 16px; border-radius: 12px; }
		.signature-avatar { width: 48px; height: 48px; border-radius: 9999px; background: #d6e3ff; color: #002045; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
		.signature-name { font-weight: 700; font-size: 14px; color: #002045; margin: 0; }
		.signature-court { font-size: 12px; color: #64748b; margin: 0; }
		.sentence { font-size: 14px; line-height: 1.6; }
		.sentence p { margin: 0 0 12px; }
		@media print { body { padding: 0; } }
	</style>
</head>
<body>
	<div class="document">
		<p class="court-header">En el Tribunal de Distrito del Sistema de Justicia Soberana</p>
		<div class="divider"></div>
		<p class="expediente">Expediente ${id}</p>
		<div class="status">✓ CASO CERRADO — ${verdict}</div>
		<p class="field"><strong>TÍTULO:</strong> ${title}</p>
		<p class="field"><strong>DESCRIPCIÓN:</strong> ${description}</p>
		${sentenceBody}
		${signature}
	</div>
	<script>window.onload = function () { window.print(); };</script>
</body>
</html>`;
}

function downloadResolutionPdf(caseDetail: CaseDetail): void {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const marginX = 56;
	const marginBottom = 64;
	const contentWidth = pageWidth - marginX * 2;
	let y = 72;

	// Add a page break when the next block would overflow the bottom margin,
	// so long resolutions paginate like the print view does.
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
	doc.text("EN EL TRIBUNAL DE DISTRITO", pageWidth / 2, y, {
		align: "center",
	});
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
	doc.text(`EXPEDIENTE ${caseDetail.id}`, marginX, y);
	y += 24;

	// Estado
	doc.setFontSize(12);
	doc.setTextColor(6, 95, 70);
	doc.text(
		`ESTADO: CASO CERRADO — ${resolutionLabel(caseDetail.resolution).toUpperCase()}`,
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

	addField("TÍTULO", caseDetail.title);
	addField(
		"DESCRIPCIÓN",
		caseDetail.description ?? "Sin descripción disponible.",
	);

	// Cuerpo de la sentencia redactada por el juez, conservando negritas/itálicas.
	// jsPDF no soporta formato inline, así que renderizamos token a token
	// alternando el peso de la fuente y ajustando las líneas a mano.
	if (caseDetail.resolutionText) {
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
		for (const runs of parseRichHtml(caseDetail.resolutionText)) {
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
	if (caseDetail.judgeName) {
		ensureSpace(60);
		y += 8;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10);
		doc.setTextColor(0, 32, 69);
		doc.text("FIRMA DIGITAL", marginX, y);
		y += 20;
		doc.setFontSize(12);
		doc.text(caseDetail.judgeName, marginX, y);
		y += 16;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(100, 116, 139);
		doc.text("Tribunal de Distrito — Sistema Juris OS", marginX, y);
	}

	doc.save(`Expediente-${caseDetail.id}.pdf`);
}

export function ClosedCaseViewPage({ params }: ClosedCaseViewPageProps) {
	const { data, isLoading, isError } = useCaseDetail(params.id);
	const caseDetail = data?.data;

	const handlePrint = () => {
		if (!caseDetail) return;
		const printWindow = window.open("", "_blank", "width=800,height=1000");
		if (!printWindow) return;
		printWindow.document.write(buildResolutionHtml(caseDetail));
		printWindow.document.close();
		printWindow.focus();
	};

	const handleDownloadPdf = () => {
		if (!caseDetail) return;
		downloadResolutionPdf(caseDetail);
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center text-slate-400">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (isError || !caseDetail) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-red-600 text-sm">No se pudo cargar el expediente.</p>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col overflow-hidden"
			style={{ height: "calc(100vh - 64px)" }}
		>
			<div className="flex flex-wrap items-center justify-between gap-4 border-slate-200 border-b bg-white px-8 py-4 shadow-sm">
				<div className="flex items-center gap-4">
					<Link
						href="/judge/resolved"
						className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<div>
						<h1 className="font-[Manrope,sans-serif] font-extrabold text-[#002045] text-xl tracking-tight">
							Expediente {caseDetail.id}
						</h1>
						<p className="font-medium text-[#515f74] text-sm">
							{caseDetail.title}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-4 py-2 font-bold text-emerald-800 text-sm">
						<CheckCircle className="h-4 w-4" />{" "}
						{resolutionLabel(caseDetail.resolution)}
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-500 text-xs">
						<Lock className="h-3.5 w-3.5" /> Caso Cerrado
					</span>
					<button
						type="button"
						onClick={handleDownloadPdf}
						className="inline-flex items-center gap-1.5 rounded-lg bg-[#002045] px-4 py-2 font-bold text-white text-xs shadow-sm transition-opacity hover:opacity-90"
					>
						<Download className="h-3.5 w-3.5" /> Descargar PDF
					</button>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				<CaseIntelligencePanel caseDetail={caseDetail} />

				<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
					<div className="flex items-center justify-between border-slate-200 border-b bg-white px-6 py-3">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-[#002045]" />
							<p className="font-bold text-[#002045] text-sm">
								Orden de Sentencia — Resolución Final
							</p>
							<span className="ml-2 flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 font-bold text-[10px] text-emerald-800">
								<Lock className="h-3 w-3" /> PUBLICADA
							</span>
						</div>
						<button
							type="button"
							onClick={handlePrint}
							className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-bold text-slate-500 text-xs transition-colors hover:bg-slate-200"
						>
							<Printer className="h-3.5 w-3.5" /> Imprimir
						</button>
					</div>

					<div className="flex-1 overflow-y-auto px-8 py-8">
						<div className="mx-auto max-w-3xl rounded-xl border border-slate-100 bg-white p-10 shadow-lg">
							<p className="mb-2 text-center font-bold text-[#002045] text-sm uppercase tracking-widest">
								En el Tribunal de Distrito del Sistema de Justicia Soberana
							</p>
							<div className="mx-auto mb-8 h-0.5 w-20 bg-[#002045]" />

							<p className="mb-5 font-bold text-slate-400 text-xs uppercase tracking-widest">
								Expediente {caseDetail.id}
							</p>

							<div className="mb-6 flex items-center gap-3">
								<span className="font-bold text-slate-500 text-xs uppercase tracking-widest">
									Estado:
								</span>
								<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1.5 font-bold text-emerald-800 text-sm">
									<CheckCircle className="h-4 w-4" /> CASO CERRADO
								</span>
							</div>

							<p className="mb-4 text-sm leading-relaxed">
								<strong>TÍTULO:</strong> {caseDetail.title}
							</p>
							<p className="mb-4 text-sm leading-relaxed">
								<strong>DESCRIPCIÓN:</strong>{" "}
								{caseDetail.description ?? "Sin descripción disponible."}
							</p>

							{caseDetail.resolutionText ? (
								<>
									<p className="mb-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
										Resolución
									</p>
									<div
										className="prose prose-sm mb-6 max-w-none text-slate-800 text-sm leading-relaxed"
										// biome-ignore lint/security/noDangerouslySetInnerHtml: TipTap-sanitised HTML written by the judge
										dangerouslySetInnerHTML={{
											__html: caseDetail.resolutionText,
										}}
									/>
								</>
							) : (
								<p className="mb-6 text-slate-400 text-sm italic">
									No se registró el texto de la sentencia.
								</p>
							)}

							{caseDetail.judgeName && (
								<>
									<p className="mb-3 font-bold text-[#002045] text-xs uppercase tracking-widest">
										Firma Digital
									</p>
									<div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
										<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d6e3ff]">
											<span className="font-bold text-[#002045] text-sm">
												{caseDetail.judgeName
													.split(" ")
													.map((n) => n[0])
													.slice(0, 2)
													.join("")}
											</span>
										</div>
										<div>
											<p className="font-bold text-[#002045] text-sm">
												{caseDetail.judgeName}
											</p>
											<p className="text-slate-500 text-xs">
												Tribunal de Distrito — Sistema Juris OS
											</p>
										</div>
										<CheckCircle className="ml-auto h-6 w-6 text-emerald-600" />
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
