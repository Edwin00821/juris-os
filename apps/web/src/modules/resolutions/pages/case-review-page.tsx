"use client";

import { ArrowLeft, CloudUpload, History, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CaseIntelligencePanel } from "@/modules/case-documents/components/case-intelligence-panel";
import { useCaseDetail } from "@/modules/case-documents/hooks/use-case-detail";
import { CaseStatusSelector } from "../components/case-status-selector";
import { JudicialCopilot } from "../components/judicial-copilot";
import { ResolutionEditor } from "../components/resolution-editor";
import type { ResolutionQABlock } from "../types";

function UploadZone() {
	return (
		<div className="mt-2">
			<p className="mb-2 flex items-center gap-1.5 font-bold text-[10px] text-slate-500 uppercase tracking-widest">
				<CloudUpload className="h-3.5 w-3.5" />
				Subir Resolución del Juez
			</p>
			<label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-slate-300 border-dashed p-4 transition-all hover:border-[#002045] hover:bg-blue-50/30">
				<input type="file" className="hidden" accept=".pdf,.docx" />
				<CloudUpload className="h-7 w-7 text-slate-400" />
				<p className="text-center font-medium text-slate-500 text-xs">
					Arrastra un archivo o{" "}
					<span className="font-bold text-[#002045] underline">
						haz clic aquí
					</span>
				</p>
				<p className="text-[10px] text-slate-400">PDF o DOCX · máx 20MB</p>
			</label>
			<p className="mt-2 text-[10px] text-slate-400 italic">
				Este documento será adjuntado al expediente oficial antes del cierre del
				caso.
			</p>
		</div>
	);
}

interface CaseReviewPageProps {
	params: { id: string };
}

export default function CaseReviewPage({ params }: CaseReviewPageProps) {
	const { data, isLoading, isError } = useCaseDetail(params.id);
	const caseDetail = data?.data;

	const [status, setStatus] = useState<string | null>(null);
	const [qaBlocks, setQaBlocks] = useState<ResolutionQABlock[]>([]);

	function handleAddToDoc(block: ResolutionQABlock) {
		setQaBlocks((prev) => [...prev, block]);
	}

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
			<div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-slate-200 border-b bg-white px-8 py-4 shadow-sm">
				<div className="flex items-center gap-4">
					<Link
						href="/judge"
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
				<div className="flex items-center gap-4">
					<CaseStatusSelector value={status} onChange={setStatus} />
					<button
						type="button"
						className="flex items-center gap-1.5 font-semibold text-slate-500 text-xs transition-colors hover:text-[#002045]"
					>
						<History className="h-4 w-4" />
						Historial de Borradores
					</button>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				<CaseIntelligencePanel
					caseDetail={caseDetail}
					footer={<UploadZone />}
				/>

				<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
					<JudicialCopilot onAddToDoc={handleAddToDoc} />
					<ResolutionEditor caseNumber={caseDetail.id} qaBlocks={qaBlocks} />
				</div>
			</div>
		</div>
	);
}
