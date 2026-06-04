import { FileText, Plus } from "lucide-react";
import { DocumentList } from "@/modules/documents/components/document-list";
import { DocumentUploadZone } from "@/modules/documents/components/document-upload-zone";
import { useCaseDocuments } from "@/modules/documents/hooks/use-case-documents";
import { useDeleteDocument } from "@/modules/documents/hooks/use-delete-document";
import type { CaseDetail } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
	criminal: "Penal",
	family: "Familiar",
	labor: "Laboral",
};

interface CaseIntelligencePanelProps {
	caseDetail: CaseDetail;
	footer?: React.ReactNode;
	canUpload?: boolean;
}

export function CaseIntelligencePanel({
	caseDetail,
	footer,
	canUpload = false,
}: CaseIntelligencePanelProps) {
	const {
		description,
		createdAt,
		closedDate,
		category,
		counterpartyName,
		plaintiffName,
		waitingDays,
	} = caseDetail;

	const { data: docsResponse, isLoading: docsLoading } = useCaseDocuments(
		caseDetail.id,
	);
	const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument(
		caseDetail.id,
	);

	const documents = docsResponse?.data ?? [];

	const filedDate = new Date(createdAt).toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	return (
		<div
			className="custom-scroll flex w-80 shrink-0 flex-col gap-5 overflow-y-auto border-slate-200 border-r bg-white p-5"
			style={{ height: "calc(100vh - 120px)" }}
		>
			<section className="border-[#1a365d] border-b-2 pb-5">
				<h3 className="mb-3 flex items-center gap-1.5 font-bold text-[10px] text-slate-500 uppercase tracking-widest">
					<span className="inline-block h-3 w-3 rounded-full bg-[#002045]" />
					Inteligencia del Caso
				</h3>
				<div className="space-y-4">
					<div>
						<p className="mb-1 font-bold text-[10px] text-slate-400 uppercase">
							Descripción
						</p>
						<p className="text-slate-700 text-xs leading-relaxed">
							{description ?? "Sin descripción disponible."}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-lg bg-slate-50 p-3">
							<p className="font-bold text-[10px] text-slate-400 uppercase">
								Presentación
							</p>
							<p className="mt-0.5 font-semibold text-xs">{filedDate}</p>
						</div>
						<div className="rounded-lg bg-slate-50 p-3">
							<p className="font-bold text-[10px] text-slate-400 uppercase">
								Materia
							</p>
							<p className="mt-0.5 font-semibold text-xs">
								{CATEGORY_LABELS[category] ?? category}
							</p>
						</div>
						{closedDate && (
							<div className="rounded-lg bg-slate-50 p-3">
								<p className="font-bold text-[10px] text-slate-400 uppercase">
									Cierre
								</p>
								<p className="mt-0.5 font-semibold text-xs">{closedDate}</p>
							</div>
						)}
						{waitingDays !== undefined && (
							<div className="rounded-lg bg-slate-50 p-3">
								<p className="font-bold text-[10px] text-slate-400 uppercase">
									Días en Espera
								</p>
								<p className="mt-0.5 font-semibold text-[#93000a] text-xs">
									{waitingDays} días
								</p>
							</div>
						)}
					</div>
					<div>
						<p className="mb-1 font-bold text-[10px] text-slate-400 uppercase">
							Partes
						</p>
						<div className="space-y-1.5">
							<div className="flex items-center gap-2 text-xs">
								<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#002045]" />
								<span>
									<strong className="capitalize">Demandante:</strong>{" "}
									{plaintiffName}
								</span>
							</div>
							<div className="flex items-center gap-2 text-xs">
								<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#515f74]" />
								<span>
									<strong className="capitalize">Demandado:</strong>{" "}
									{counterpartyName ?? "No especificado"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h3 className="mb-3 flex items-center gap-1.5 font-bold text-[10px] text-slate-500 uppercase tracking-widest">
					<FileText className="h-3.5 w-3.5" />
					Documentos del Expediente
					{!docsLoading && documents.length > 0 && (
						<span className="ml-auto rounded-full bg-slate-100 px-1.5 py-0.5 font-bold text-[9px] text-slate-500">
							{documents.length}
						</span>
					)}
				</h3>

				{docsLoading ? (
					<p className="text-[11px] text-slate-400 italic">
						Cargando documentos...
					</p>
				) : (
					<DocumentList
						documents={documents}
						onDelete={canUpload ? deleteDocument : undefined}
						isDeleting={isDeleting}
					/>
				)}

				{canUpload && caseDetail.uuid && (
					<DocumentUploadZone
						caseNumber={caseDetail.id}
						caseUuid={caseDetail.uuid}
						compact
					/>
				)}

				{canUpload && !caseDetail.uuid && (
					<p className="mt-2 flex items-center gap-1 text-[10px] text-slate-300">
						<Plus className="size-3" /> Carga de documentos no disponible
					</p>
				)}

				{footer && <div className="mt-4">{footer}</div>}
			</section>
		</div>
	);
}
