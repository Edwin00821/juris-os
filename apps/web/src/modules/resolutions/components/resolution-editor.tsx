"use client";

import { Button } from "@juris-os/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@juris-os/ui/components/dialog";
import {
	AlertTriangle,
	Bold,
	CheckCircle,
	FileEdit,
	Italic,
	List,
	Lock,
	Save,
} from "lucide-react";
import { useState } from "react";
import type { ResolutionQABlock } from "../types";

interface ResolutionEditorProps {
	caseNumber: string;
	qaBlocks: ResolutionQABlock[];
}

export function ResolutionEditor({
	caseNumber,
	qaBlocks,
}: ResolutionEditorProps) {
	const [showCloseModal, setShowCloseModal] = useState(false);
	const [savedToast, setSavedToast] = useState(false);

	function handleSaveDraft() {
		setSavedToast(true);
		setTimeout(() => setSavedToast(false), 2800);
	}

	return (
		<>
			<div className="flex flex-1 flex-col overflow-hidden">
				<div className="flex items-center justify-between border-slate-100 border-b bg-white px-6 py-3">
					<div className="flex items-center gap-2">
						<FileEdit className="h-4 w-4 text-[#002045]" />
						<p className="font-bold text-[#002045] text-sm">
							Redacción de la Orden de Sentencia
						</p>
						<span className="ml-2 flex items-center gap-1 rounded-full bg-[#d5e3fc] px-2 py-0.5 font-bold text-[#0d1c2e] text-[10px]">
							<span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#002045]" />
							REDACTANDO
						</span>
					</div>
					<div className="flex items-center gap-1">
						{[Bold, Italic, List].map((Icon, i) => (
							<button
								type="button"
								// biome-ignore lint/suspicious/noArrayIndexKey: toolbar icons
								key={i}
								className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
							>
								<Icon className="h-3.5 w-3.5" />
							</button>
						))}
						<div className="mx-1 h-5 w-px bg-slate-200" />
						<button
							type="button"
							onClick={handleSaveDraft}
							className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
						>
							<Save className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-8 py-6">
					<div className="mx-auto max-w-3xl">
						<p className="mb-6 text-center font-bold text-[#002045] text-sm uppercase tracking-widest">
							En el Tribunal de Distrito del Sistema de Justicia Soberana
						</p>
						<p className="mb-5 font-bold text-slate-400 text-xs uppercase tracking-widest">
							Expediente {caseNumber}
						</p>
						<p className="mb-4 text-sm leading-relaxed">
							<strong>PARTES:</strong> Metropolis Development Corp
							(&quot;Demandante&quot;) y Junta Ambiental de la Ciudad
							(&quot;Demandado&quot;).
						</p>
						<p className="mb-4 text-sm leading-relaxed">
							<strong>PREÁMBULO:</strong> Habiendo revisado la evidencia
							presentada durante la sesión del 14 de noviembre, el Tribunal
							procede al análisis de los puntos de hecho y de derecho.
						</p>

						{qaBlocks.length > 0 && (
							<div className="mb-5 rounded-r-xl border-[#002045] border-l-4 bg-slate-50/60 p-5">
								<p className="mb-3 flex items-center gap-1.5 font-bold text-[#002045] text-[10px] uppercase tracking-widest">
									<CheckCircle className="h-3 w-3" />
									Hallazgos generados por Copiloto Judicial
								</p>
								{qaBlocks.map((block, idx) => (
									<div
										key={block.id}
										className={
											idx > 0 ? "mt-4 border-slate-200 border-t pt-4" : ""
										}
									>
										<p className="mb-1 font-bold text-slate-500 text-xs uppercase tracking-wide">
											P: {block.question}
										</p>
										<p className="text-slate-800 text-sm leading-relaxed">
											{block.answer}
										</p>
										<div className="mt-2 flex flex-wrap gap-1.5">
											{block.refs.map((ref) => (
												<span
													key={ref}
													className="rounded bg-[#d6e3ff] px-2 py-0.5 font-bold text-[#002045] text-[10px]"
												>
													{ref}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						)}

						<p className="mb-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
							Consideraciones Finales
						</p>
						<div
							contentEditable
							suppressContentEditableWarning
							className="min-h-40 w-full rounded-xl border border-slate-300 border-dashed bg-white p-4 text-slate-800 text-sm leading-relaxed focus:outline-none"
						>
							Continúe redactando las consideraciones finales y el veredicto...
						</div>

						<div className="mt-8 flex items-start gap-4 rounded-xl border border-[#ba1a1a]/10 bg-[#ffdad6]/40 p-5">
							<AlertTriangle className="mt-0.5 h-7 w-7 shrink-0 text-[#ba1a1a]" />
							<div>
								<h4 className="font-bold text-[#93000a] text-sm">
									CRÍTICO: PROTOCOLO DE INMUTABILIDAD
								</h4>
								<p className="mt-1 text-[#93000a]/80 text-xs leading-relaxed">
									Cerrar este caso generará un hash criptográfico de todos los
									documentos y la sentencia final. Una vez ejecutado, no se
									podrán realizar más modificaciones. Asegúrese de que todas las
									citaciones sean precisas.
								</p>
							</div>
						</div>

						<div className="mt-6 mb-10 flex justify-end gap-4">
							<Button
								variant="outline"
								onClick={handleSaveDraft}
								className="px-6 py-3 font-bold text-sm"
							>
								Guardar Borrador
							</Button>
							<Button
								onClick={() => setShowCloseModal(true)}
								className="flex items-center gap-2 bg-[#ba1a1a] px-8 py-3 font-bold text-sm text-white shadow-lg hover:bg-[#93000a]"
							>
								<Lock className="h-4 w-4" />
								Cerrar Caso y Publicar Sentencia
							</Button>
						</div>
					</div>
				</div>
			</div>

			{savedToast && (
				<div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
					<div className="flex items-center gap-2 rounded-xl bg-[#002045] px-6 py-3 font-bold text-sm text-white shadow-2xl">
						<CheckCircle className="h-4 w-4" />
						Borrador guardado correctamente.
					</div>
				</div>
			)}

			<Dialog open={showCloseModal} onOpenChange={setShowCloseModal}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<div className="mb-2 flex items-center gap-3">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffdad6]">
								<Lock className="h-6 w-6 text-[#ba1a1a]" />
							</div>
							<div>
								<DialogTitle className="font-[Manrope,sans-serif] text-[#002045] text-lg">
									Confirmar Cierre del Caso
								</DialogTitle>
								<DialogDescription className="text-slate-500 text-xs">
									Esta acción es irreversible.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
					<p className="mb-6 text-slate-700 text-sm leading-relaxed">
						Se generará un <strong>hash criptográfico</strong> de todos los
						documentos y la sentencia. El expediente quedará bloqueado
						permanentemente en el libro mayor digital.
					</p>
					<div className="flex justify-end gap-3">
						<Button
							variant="ghost"
							onClick={() => setShowCloseModal(false)}
							className="font-bold"
						>
							Cancelar
						</Button>
						<Button className="flex items-center gap-2 bg-[#ba1a1a] font-bold text-white shadow-md hover:bg-[#93000a]">
							<Lock className="h-3.5 w-3.5" />
							Confirmar y Publicar
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
