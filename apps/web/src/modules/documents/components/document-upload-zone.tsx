"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { CloudUpload, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useUploadDocument } from "../hooks/use-upload-document";
import type { DocumentType } from "../types";

interface DocumentUploadZoneProps {
	caseNumber: string;
	caseUuid: string;
	documentType?: DocumentType;
	compact?: boolean;
}

export function DocumentUploadZone({
	caseNumber,
	caseUuid,
	documentType = "other",
	compact = false,
}: DocumentUploadZoneProps) {
	const { uploadFiles, isUploading } = useUploadDocument(caseNumber, caseUuid);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		void uploadFiles(Array.from(files), documentType);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		handleFiles(e.dataTransfer.files);
	};

	if (compact) {
		return (
			<div className="mt-3">
				{/* biome-ignore lint/a11y/noStaticElementInteractions: file upload zone */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: file upload zone */}
				<div
					onClick={() => inputRef.current?.click()}
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
					className={cn(
						"flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 border-dashed p-3 text-slate-400 transition-colors hover:border-blue-300 hover:text-blue-500",
						isUploading && "pointer-events-none opacity-60",
					)}
				>
					{isUploading ? (
						<Loader2 className="size-3.5 animate-spin" />
					) : (
						<CloudUpload className="size-3.5" />
					)}
					<span className="text-[11px]">
						{isUploading ? "Subiendo..." : "Adjuntar documento"}
					</span>
					<input
						ref={inputRef}
						type="file"
						className="hidden"
						multiple
						accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
						onChange={(e) => handleFiles(e.target.files)}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-4">
			{/* biome-ignore lint/a11y/noStaticElementInteractions: file upload zone */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: file upload zone */}
			<div
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				className={cn(
					"flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
					isUploading
						? "pointer-events-none border-blue-300 bg-blue-50"
						: "border-slate-200 hover:border-blue-300 hover:bg-slate-50",
				)}
			>
				{isUploading ? (
					<Loader2 className="mb-2 size-6 animate-spin text-blue-500" />
				) : (
					<CloudUpload className="mb-2 size-6 text-slate-400" />
				)}
				<p className="font-medium text-slate-600 text-xs">
					{isUploading
						? "Subiendo archivos..."
						: "Arrastre o haga clic para subir"}
				</p>
				<p className="mt-0.5 text-[10px] text-slate-400">
					PDF, DOCX, JPG · Máx. 16 MB
				</p>
			</div>
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				multiple
				accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
				onChange={(e) => handleFiles(e.target.files)}
			/>
		</div>
	);
}
