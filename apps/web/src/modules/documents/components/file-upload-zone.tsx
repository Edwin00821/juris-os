"use client";

import { Card } from "@juris-os/ui/components/card";
import { cn } from "@juris-os/ui/lib/utils";
import { CloudUpload, FileUp } from "lucide-react";
import { useRef } from "react";
import { useFileUpload } from "../hooks/use-file-upload";
import { DocumentListItem } from "./document-list-item";

export function FileUploadZone() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		documents,
		isDragging,
		handleFiles,
		removeDocument,
		onDragOver,
		onDragLeave,
		onDrop,
	} = useFileUpload();

	const handleBoxClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-none">
			{/* Encabezado */}
			<div className="mb-8 flex items-center gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
					<FileUp className="size-6" />
				</div>
				<div>
					<h2 className="font-bold font-headline text-primary text-xl">
						Subir Archivos de la Demanda
					</h2>
					<p className="text-on-surface-variant text-sm">
						Adjunte documentos de respaldo: contratos, evidencias,
						identificaciones, etc.
					</p>
				</div>
			</div>

			{/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
			<div
				onClick={handleBoxClick}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={cn(
					"flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200",
					isDragging
						? "border-primary bg-primary-fixed/20"
						: "border-outline-variant hover:border-primary-container hover:bg-primary-fixed/10",
				)}
			>
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
					<CloudUpload className="size-8 text-primary" />
				</div>
				<p className="mb-1 font-bold font-headline text-primary">
					Arrastre archivos aquí
				</p>
				<p className="mb-4 text-on-surface-variant text-sm">
					o haga clic para seleccionar archivos desde su dispositivo
				</p>

				{/* Badges de soporte */}
				<div className="flex flex-wrap justify-center gap-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
					<span className="rounded-full bg-surface-container px-3 py-1">
						PDF
					</span>
					<span className="rounded-full bg-surface-container px-3 py-1">
						DOCX
					</span>
					<span className="rounded-full bg-surface-container px-3 py-1">
						JPG / PNG
					</span>
					<span className="rounded-full bg-surface-container px-3 py-1">
						Máx. 25 MB
					</span>
				</div>

				<input
					type="file"
					ref={fileInputRef}
					onChange={(e) => e.target.files && handleFiles(e.target.files)}
					className="hidden"
					multiple
					accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
				/>
			</div>

			{documents.length > 0 && (
				<div className="fade-in mt-6 animate-in space-y-3">
					<h4 className="px-1 font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest">
						Archivos Adjuntos
					</h4>
					<div className="space-y-2">
						{documents.map((doc) => (
							<DocumentListItem
								key={doc.id}
								doc={doc}
								onRemove={removeDocument}
							/>
						))}
					</div>
				</div>
			)}
		</Card>
	);
}
