"use client";

import { Button } from "@juris-os/ui/components/button";
import {
	ExternalLink,
	FileCode,
	FileImage,
	FileText,
	Loader2,
	Trash2,
} from "lucide-react";
import type { Document } from "../types";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
	evidence: "Evidencia",
	motion: "Moción",
	brief: "Escrito",
	judgment: "Sentencia",
	other: "Documento",
};

function getFileIcon(fileType: string) {
	if (fileType === "application/pdf")
		return <FileText className="size-4 text-red-500" />;
	if (fileType.startsWith("image/"))
		return <FileImage className="size-4 text-blue-500" />;
	return <FileCode className="size-4 text-slate-500" />;
}

interface DocumentListProps {
	documents: Document[];
	onDelete?: (id: string) => void;
	isDeleting?: boolean;
}

export function DocumentList({
	documents,
	onDelete,
	isDeleting,
}: DocumentListProps) {
	if (documents.length === 0) {
		return (
			<p className="text-[11px] text-slate-400 italic">
				No hay documentos adjuntos.
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{documents.map((doc) => (
				<div
					key={doc.id}
					className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5"
				>
					<div className="flex min-w-0 items-center gap-2">
						{getFileIcon(doc.fileType)}
						<div className="min-w-0">
							<p className="truncate font-medium text-slate-700 text-xs leading-tight">
								{doc.fileName}
							</p>
							<p className="text-[10px] text-slate-400 uppercase tracking-wide">
								{DOCUMENT_TYPE_LABELS[doc.documentType] ?? "Documento"}
							</p>
						</div>
					</div>
					<div className="ml-2 flex shrink-0 items-center gap-1">
						<a
							href={doc.fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
							title="Ver documento"
						>
							<ExternalLink className="size-3.5" />
						</a>
						{onDelete && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onDelete(doc.id)}
								disabled={isDeleting}
								className="h-6 w-6 rounded p-0 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
								title="Eliminar"
							>
								{isDeleting ? (
									<Loader2 className="size-3.5 animate-spin" />
								) : (
									<Trash2 className="size-3.5" />
								)}
							</Button>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
