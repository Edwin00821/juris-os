"use client";

import { cn } from "@juris-os/ui/lib/utils";
import {
	ArrowLeft,
	FileText,
	History,
	Loader2,
	MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaseIntelligencePanel } from "@/modules/case-documents/components/case-intelligence-panel";
import { useCaseDetail } from "@/modules/case-documents/hooks/use-case-detail";
import { useCaseDocuments } from "@/modules/documents/hooks/use-case-documents";
import { CaseStatusSelector } from "../components/case-status-selector";
import { JudicialCopilot } from "../components/judicial-copilot";
import { ResolutionEditor } from "../components/resolution-editor";
import {
	useUpdateCaseStatus,
	type WorkingCaseStatus,
} from "../hooks/use-update-case-status";
import type { ResolutionQABlock } from "../types";

interface CaseReviewPageProps {
	params: { id: string };
}

export default function CaseReviewPage({ params }: CaseReviewPageProps) {
	const router = useRouter();
	const { data, isLoading, isError } = useCaseDetail(params.id);
	const caseDetail = data?.data;
	const { data: docsResponse } = useCaseDocuments(params.id);
	const documents = docsResponse?.data ?? [];

	const updateStatus = useUpdateCaseStatus();
	const [qaBlocks, setQaBlocks] = useState<ResolutionQABlock[]>([]);
	const [activeTab, setActiveTab] = useState<"chat" | "resolution">("chat");

	// The header selector reflects the case's real working status (not CLOSED,
	// which is reached via the publish flow and redirects away).
	const workingStatus: WorkingCaseStatus | null =
		caseDetail?.status === "UNDER_REVIEW" ||
		caseDetail?.status === "PENDING_RESOLUTION"
			? caseDetail.status
			: null;

	// A closed case is immutable — send the judge to the read-only published view.
	useEffect(() => {
		if (caseDetail?.status === "CLOSED") {
			router.replace(`/judge/cases/${params.id}/closed`);
		}
	}, [caseDetail?.status, params.id, router]);

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

	// Closed cases are redirected by the effect above — avoid flashing the editor.
	if (caseDetail.status === "CLOSED") {
		return (
			<div className="flex h-screen items-center justify-center text-slate-400">
				<Loader2 className="h-6 w-6 animate-spin" />
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
					<CaseStatusSelector
						value={workingStatus}
						disabled={updateStatus.isPending}
						onChange={(status) =>
							updateStatus.mutate({ caseId: params.id, status })
						}
					/>
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
				<CaseIntelligencePanel caseDetail={caseDetail} canUpload />

				<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
					{/* Tabs */}
					<div className="flex items-center border-slate-200 border-b bg-white px-6">
						<button
							type="button"
							onClick={() => setActiveTab("chat")}
							className={cn(
								"flex items-center gap-2 border-b-2 px-4 py-3 font-semibold text-sm transition-colors",
								activeTab === "chat"
									? "border-[#002045] text-[#002045]"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<MessageSquare className="h-4 w-4" />
							Copiloto Judicial
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("resolution")}
							className={cn(
								"flex items-center gap-2 border-b-2 px-4 py-3 font-semibold text-sm transition-colors",
								activeTab === "resolution"
									? "border-[#002045] text-[#002045]"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<FileText className="h-4 w-4" />
							Redacción de Sentencia
						</button>
					</div>

					{/* Tab content */}
					{activeTab === "chat" && (
						<JudicialCopilot
							caseNumber={caseDetail.id}
							documents={documents}
							onAddToDoc={handleAddToDoc}
						/>
					)}
					{activeTab === "resolution" && (
						<ResolutionEditor caseNumber={caseDetail.id} qaBlocks={qaBlocks} />
					)}
				</div>
			</div>
		</div>
	);
}
