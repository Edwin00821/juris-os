"use client";

import { Bold, Italic, List, Save } from "lucide-react";
import { useState } from "react";
import { ImmutabilityProtocol } from "./immutability-protocol";

interface ResolutionEditorProps {
	caseParties: string;
	preamble: string;
}

export function ResolutionEditor({
	caseParties,
	preamble,
}: ResolutionEditorProps) {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSaveDraft = () => {
		// Lógica para guardar borrador
	};

	const handleCloseCase = async () => {
		setIsSubmitting(true);
		try {
			// Lógica de stub para la publicación y generación de hash
			await new Promise((resolve) => setTimeout(resolve, 1500));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="flex min-h-175 flex-col rounded-xl bg-surface-container-lowest p-8 shadow-sm">
			<div className="mb-6 flex items-center justify-between border-outline-variant/20 border-b pb-4">
				<h2 className="font-bold text-primary text-xl">
					Redacción de la Orden de Sentencia
				</h2>
				<div className="flex gap-2">
					<button
						type="button"
						className="rounded-lg p-2 transition-colors hover:bg-surface-container-low"
					>
						<Bold className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="rounded-lg p-2 transition-colors hover:bg-surface-container-low"
					>
						<Italic className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="rounded-lg p-2 transition-colors hover:bg-surface-container-low"
					>
						<List className="h-4 w-4" />
					</button>
					<div className="mx-2 h-6 w-px bg-outline-variant/30" />
					<button
						type="button"
						className="rounded-lg p-2 transition-colors hover:bg-surface-container-low"
					>
						<Save className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="mx-auto w-full max-w-[70ch] flex-1 font-body text-on-surface leading-[1.8]">
				<p className="mb-8 text-center font-bold text-lg uppercase tracking-widest">
					En el Tribunal de Distrito del Sistema de Justicia Soberana
				</p>
				<p className="mb-4">
					<strong>PARTES:</strong> {caseParties}
				</p>
				<p className="mb-6">
					<strong>PREÁMBULO:</strong> {preamble}
				</p>
				<p className="mb-6 rounded-lg bg-surface-container-low p-4 text-muted-foreground italic">
					[Recomendación de Redacción: Inserte aquí el lenguaje del Veredicto
					Final. Especifique los montos exactos de restitución y la fecha límite
					para su cumplimiento.]
				</p>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="h-96 w-full resize-none border-none bg-transparent p-0 text-lg outline-none placeholder:text-outline/40 focus:ring-0"
					placeholder="Continúe redactando la sentencia final..."
				/>
			</div>

			<ImmutabilityProtocol
				onSaveDraft={handleSaveDraft}
				onCloseCase={handleCloseCase}
				isSubmitting={isSubmitting}
			/>
		</section>
	);
}
