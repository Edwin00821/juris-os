"use client";

import { Button } from "@juris-os/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@juris-os/ui/components/dialog";
import { cn } from "@juris-os/ui/lib/utils";
import HardBreak from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	AlertTriangle,
	Bold,
	CheckCircle,
	FileEdit,
	Italic,
	List,
	Loader2,
	Lock,
	Save,
	ShieldCheck,
	XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type CaseResolution, useCloseCase } from "../hooks/use-close-case";
import { useResolutionDraftStore } from "../stores/resolution-draft.store";
import type { ResolutionQABlock } from "../types";

interface ResolutionEditorProps {
	caseNumber: string;
	qaBlocks: ResolutionQABlock[];
}

const VERDICT_OPTIONS: {
	value: CaseResolution;
	label: string;
	description: string;
	icon: React.ReactNode;
	activeClassName: string;
}[] = [
	{
		value: "admitted",
		label: "Admitir",
		description: "Se acoge la demanda",
		icon: <CheckCircle className="h-4 w-4" />,
		activeClassName: "border-emerald-400 bg-emerald-50 text-emerald-800",
	},
	{
		value: "conditioned",
		label: "Condicionar",
		description: "Admitida con condiciones",
		icon: <ShieldCheck className="h-4 w-4" />,
		activeClassName: "border-amber-400 bg-amber-50 text-amber-800",
	},
	{
		value: "rejected",
		label: "Rechazar",
		description: "Se desestima la demanda",
		icon: <XCircle className="h-4 w-4" />,
		activeClassName: "border-red-400 bg-red-50 text-red-800",
	},
];

export function ResolutionEditor({
	caseNumber,
	qaBlocks,
}: ResolutionEditorProps) {
	const [showCloseModal, setShowCloseModal] = useState(false);
	const [verdict, setVerdict] = useState<CaseResolution>("admitted");
	const [savedToast, setSavedToast] = useState(false);
	const restoredRef = useRef(false);

	const saveDraft = useResolutionDraftStore((s) => s.saveDraft);
	const clearDraft = useResolutionDraftStore((s) => s.clearDraft);
	const getDraft = useResolutionDraftStore((s) => s.getDraft);
	const draftAction = useResolutionDraftStore(
		(s) => s.drafts[caseNumber]?.action ?? null,
	);
	const closeCase = useCloseCase();

	const editor = useEditor({
		extensions: [
			StarterKit,
			HardBreak.configure({
				keepMarks: true,
			}),
			Placeholder.configure({
				placeholder:
					"Continúe redactando las consideraciones finales y el veredicto...",
			}),
		],
		editorProps: {
			attributes: {
				class:
					"min-h-40 w-full rounded-xl border border-slate-300 border-dashed bg-white p-4 text-slate-800 text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none",
			},
		},
	});

	// Restore a previously saved draft into the editor once it's ready.
	useEffect(() => {
		if (!editor || restoredRef.current) return;
		restoredRef.current = true;
		const draft = getDraft(caseNumber);
		if (draft?.content) {
			editor.commands.setContent(draft.content);
		}
	}, [editor, caseNumber, getDraft]);

	// Insert AI copilot blocks into the editor when they arrive
	useEffect(() => {
		if (!editor || !qaBlocks || qaBlocks.length === 0) return;
		const lastBlock = qaBlocks[qaBlocks.length - 1];
		if (!lastBlock?.answer) return;

		const refsStr = Array.isArray(lastBlock.refs)
			? lastBlock.refs.map((r) => `<span>${r}</span>`).join(" ")
			: "";
		editor
			.chain()
			.focus()
			.insertContent(
				`<p><strong>Hallazgo del Copiloto:</strong> ${lastBlock.answer}</p>${refsStr ? `<p>${refsStr}</p>` : ""}`,
			)
			.run();
	}, [editor, qaBlocks]);

	function handleSaveDraft() {
		if (!editor) return;
		saveDraft(caseNumber, {
			content: editor.getHTML(),
			action: draftAction,
		});
		setSavedToast(true);
		setTimeout(() => setSavedToast(false), 2800);
	}

	function handleCloseCase() {
		closeCase.mutate(
			{
				caseId: caseNumber,
				resolution: verdict,
				resolutionText: editor?.getHTML(),
			},
			{ onSuccess: () => clearDraft(caseNumber) },
		);
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
						<button
							type="button"
							onClick={() => editor?.chain().focus().toggleBold().run()}
							className={`rounded-lg p-1.5 transition-colors ${editor?.isActive("bold") ? "bg-slate-200 text-[#002045]" : "text-slate-500 hover:bg-slate-100"}`}
						>
							<Bold className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							onClick={() => editor?.chain().focus().toggleItalic().run()}
							className={`rounded-lg p-1.5 transition-colors ${editor?.isActive("italic") ? "bg-slate-200 text-[#002045]" : "text-slate-500 hover:bg-slate-100"}`}
						>
							<Italic className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							onClick={() => editor?.chain().focus().toggleBulletList().run()}
							className={`rounded-lg p-1.5 transition-colors ${editor?.isActive("bulletList") ? "bg-slate-200 text-[#002045]" : "text-slate-500 hover:bg-slate-100"}`}
						>
							<List className="h-3.5 w-3.5" />
						</button>
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

						<p className="mb-2 font-bold text-slate-400 text-xs uppercase tracking-widest">
							Consideraciones Finales
						</p>

						<EditorContent editor={editor} />

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
					<p className="mb-5 text-slate-700 text-sm leading-relaxed">
						Se generará un <strong>hash criptográfico</strong> de todos los
						documentos y la sentencia. El expediente quedará bloqueado
						permanentemente en el libro mayor digital.
					</p>

					<div className="mb-6">
						<p className="mb-2 font-bold text-slate-500 text-xs uppercase tracking-widest">
							Veredicto
						</p>
						<div className="grid grid-cols-3 gap-2">
							{VERDICT_OPTIONS.map((opt) => (
								<button
									type="button"
									key={opt.value}
									onClick={() => setVerdict(opt.value)}
									disabled={closeCase.isPending}
									className={cn(
										"flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition-all",
										verdict === opt.value
											? opt.activeClassName
											: "border-slate-200 bg-white text-slate-400 hover:border-slate-300",
									)}
								>
									{opt.icon}
									<span className="font-bold text-xs">{opt.label}</span>
									<span className="text-[10px] leading-tight opacity-80">
										{opt.description}
									</span>
								</button>
							))}
						</div>
					</div>

					<div className="flex justify-end gap-3">
						<Button
							variant="ghost"
							onClick={() => setShowCloseModal(false)}
							disabled={closeCase.isPending}
							className="font-bold"
						>
							Cancelar
						</Button>
						<Button
							onClick={handleCloseCase}
							disabled={closeCase.isPending}
							className="flex items-center gap-2 bg-[#ba1a1a] font-bold text-white shadow-md hover:bg-[#93000a]"
						>
							{closeCase.isPending ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Lock className="h-3.5 w-3.5" />
							)}
							{closeCase.isPending ? "Publicando..." : "Confirmar y Publicar"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
