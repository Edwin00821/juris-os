import { Button } from "@juris-os/ui/components/button";
import {
	CheckCircle,
	FileCode,
	FileImage,
	FileText,
	Loader2,
	X,
} from "lucide-react";
import type { UploadedDocument } from "../types/document.types";

interface DocumentListItemProps {
	doc: UploadedDocument;
	onRemove: (id: string) => void;
}

export function DocumentListItem({ doc, onRemove }: DocumentListItemProps) {
	const formattedSize =
		doc.size < 1024 * 1024
			? `${(doc.size / 1024).toFixed(1)} KB`
			: `${(doc.size / (1024 * 1024)).toFixed(1)} MB`;

	const getIcon = () => {
		switch (doc.extension) {
			case "pdf":
				return <FileText className="size-5 text-error" />;
			case "jpg":
			case "jpeg":
			case "png":
			case "webp":
				return <FileImage className="size-5 text-primary" />;
			case "doc":
			case "docx":
				return <FileCode className="size-5 text-secondary" />;
			default:
				return <FileText className="size-5 text-primary" />;
		}
	};

	return (
		<div className="slide-in-from-bottom-2 flex animate-in items-center justify-between rounded-lg bg-surface-container p-3">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-container-lowest shadow-sm">
					{doc.status === "uploading" ? (
						<Loader2 className="size-4 animate-spin text-primary" />
					) : doc.status === "success" ? (
						<CheckCircle className="size-4 text-green-600" />
					) : (
						getIcon()
					)}
				</div>

				<div className="flex flex-col overflow-hidden">
					<p className="max-w-70 truncate font-semibold text-foreground text-sm sm:max-w-100">
						{doc.name}
					</p>
					<p className="mt-0.5 text-[10px] text-on-surface-variant uppercase tracking-wider">
						{doc.extension} · {formattedSize}
					</p>
				</div>
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={() => onRemove(doc.id)}
				className="size-8 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
				title="Quitar archivo"
			>
				<X className="size-4" />
			</Button>
		</div>
	);
}
