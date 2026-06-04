"use client";

import { Download, Loader2 } from "lucide-react";
import { DocumentList } from "@/modules/documents/components/document-list";
import { useCaseDocuments } from "@/modules/documents/hooks/use-case-documents";
import { getCategoryLabel } from "../utils/case-category";
import { downloadResolutionPdf } from "../utils/resolution-pdf";
import { CaseStatusBadge } from "./case-status-badge";
import { CollapsibleSection } from "./collapsible-section";

interface CaseData {
	id: string;
	uuid: string;
	title: string;
	category: string;
	registrationDate: string;
	status: "OPEN" | "UNDER_REVIEW" | "PENDING_RESOLUTION" | "CLOSED";
	resolution: "admitted" | "conditioned" | "rejected" | null;
	resolutionText: string | null;
	judgeId: string | null;
	judgeName: string | null;
	judgeEmail: string | null;
}

const RESOLUTION_CONFIG: Record<
	"admitted" | "conditioned" | "rejected",
	{ label: string; description: string; className: string }
> = {
	admitted: {
		label: "Admitida",
		description: "El juez admitió tu caso. Procederá según lo solicitado.",
		className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
	},
	conditioned: {
		label: "Prevenida",
		description:
			"El juez previno tu caso. Es necesario subsanar observaciones antes de continuar.",
		className: "bg-amber-100 text-amber-800 border border-amber-300",
	},
	rejected: {
		label: "Rechazada",
		description:
			"El juez rechazó tu caso. Revisa los motivos de la resolución.",
		className: "bg-red-100 text-red-800 border border-red-300",
	},
};

interface CaseDetailCardProps {
	case: CaseData;
}

export function CaseDetailCard({ case: caseData }: CaseDetailCardProps) {
	const registrationDate = new Date(
		caseData.registrationDate,
	).toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const {
		data: documentsResponse,
		isLoading: isLoadingDocuments,
		isError: isDocumentsError,
	} = useCaseDocuments(caseData.id);
	const documents = documentsResponse?.data ?? [];

	const isClosed = caseData.status === "CLOSED" && caseData.resolution;

	return (
		<div className="space-y-4">
			<CollapsibleSection title="Detalles del Caso" defaultOpen>
				<div className="mb-4 flex items-start justify-between gap-4">
					<div className="flex-1">
						<p className="text-on-surface-variant text-sm">ID del Caso</p>
						<h1 className="font-bold font-mono text-2xl text-primary">
							{caseData.id}
						</h1>
					</div>
					<CaseStatusBadge status={caseData.status} />
				</div>

				<div className="space-y-4 border-outline-variant border-t pt-4">
					<div>
						<p className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
							Título del Asunto
						</p>
						<h2 className="mt-1 font-semibold text-lg">{caseData.title}</h2>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
								Categoría
							</p>
							<p className="mt-1 text-sm">
								{getCategoryLabel(caseData.category)}
							</p>
						</div>

						<div>
							<p className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
								Fecha de Registro
							</p>
							<p className="mt-1 text-sm">{registrationDate}</p>
						</div>
					</div>
				</div>
			</CollapsibleSection>

			{isClosed && caseData.resolution && (
				<CollapsibleSection title="Resolución del Caso" defaultOpen>
					<div className="space-y-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<span
								className={`inline-flex items-center rounded-full px-3 py-1 font-bold text-xs ${RESOLUTION_CONFIG[caseData.resolution].className}`}
							>
								{RESOLUTION_CONFIG[caseData.resolution].label}
							</span>
							<button
								type="button"
								onClick={() => downloadResolutionPdf(caseData)}
								className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90"
							>
								<Download className="size-4" />
								Descargar PDF
							</button>
						</div>
						<p className="text-on-surface-variant text-sm">
							{RESOLUTION_CONFIG[caseData.resolution].description}
						</p>

						{caseData.resolutionText ? (
							<div className="border-outline-variant border-t pt-4">
								<p className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
									Texto de la Resolución
								</p>
								<div
									className="prose prose-sm mt-2 max-w-none text-foreground text-sm leading-relaxed"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: TipTap-sanitised HTML written by the judge
									dangerouslySetInnerHTML={{ __html: caseData.resolutionText }}
								/>
							</div>
						) : (
							<p className="border-outline-variant border-t pt-4 text-on-surface-variant text-sm italic">
								No se registró el texto de la sentencia.
							</p>
						)}

						{caseData.judgeName && (
							<div className="border-outline-variant border-t pt-4">
								<p className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
									Firma del Juez
								</p>
								<p className="mt-1 font-semibold text-sm">
									{caseData.judgeName}
								</p>
								<p className="text-on-surface-variant text-xs">
									Tribunal de Distrito — Sistema Juris OS
								</p>
							</div>
						)}
					</div>
				</CollapsibleSection>
			)}

			<CollapsibleSection
				title="Documentos Adjuntos"
				defaultOpen={Boolean(isClosed)}
			>
				{isLoadingDocuments ? (
					<div className="flex items-center gap-2 text-on-surface-variant text-sm">
						<Loader2 className="size-4 animate-spin" />
						Cargando documentos...
					</div>
				) : isDocumentsError ? (
					<p className="text-error text-sm">
						No se pudieron cargar los documentos adjuntos.
					</p>
				) : (
					<DocumentList documents={documents} />
				)}
			</CollapsibleSection>

			<CollapsibleSection title="Información de Asignación" defaultOpen={false}>
				{caseData.judgeId && caseData.judgeName ? (
					<div className="space-y-3">
						<div>
							<p className="text-on-surface-variant text-xs">Juez Asignado</p>
							<p className="mt-1 font-semibold text-sm">{caseData.judgeName}</p>
						</div>
						{caseData.judgeEmail && (
							<div>
								<p className="text-on-surface-variant text-xs">Contacto</p>
								<a
									href={`mailto:${caseData.judgeEmail}`}
									className="mt-1 text-primary text-sm transition-opacity hover:opacity-80"
								>
									{caseData.judgeEmail}
								</a>
							</div>
						)}
					</div>
				) : (
					<p className="text-on-surface-variant text-sm">
						Tu caso está en la cola de asignación. Se te notificará cuando sea
						asignado a un juez.
					</p>
				)}
			</CollapsibleSection>
		</div>
	);
}
