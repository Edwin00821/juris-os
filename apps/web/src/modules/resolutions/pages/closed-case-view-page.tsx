"use client";

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

export function ClosedCaseViewPage({ params }: ClosedCaseViewPageProps) {
	const { data, isLoading, isError } = useCaseDetail(params.id);
	const caseDetail = data?.data;

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
						<CheckCircle className="h-4 w-4" /> Admitida
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-500 text-xs">
						<Lock className="h-3.5 w-3.5" /> Caso Cerrado
					</span>
					<button
						type="button"
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
