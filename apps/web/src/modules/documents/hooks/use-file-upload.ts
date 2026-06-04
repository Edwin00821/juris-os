"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { UploadedDocument } from "../types/document.types";

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16 MB

interface UseFileUploadOptions {
	onFilesChange?: (files: File[]) => void;
}

export function useFileUpload({ onFilesChange }: UseFileUploadOptions = {}) {
	const [documents, setDocuments] = useState<UploadedDocument[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: stable callback
	const handleFiles = useCallback(
		(files: FileList | File[]) => {
			const newDocs: UploadedDocument[] = [];
			const arrayFiles = Array.from(files);

			for (const file of arrayFiles) {
				if (file.size > MAX_FILE_SIZE) {
					toast(`El archivo "${file.name}" excede el límite de 16 MB.`);
					continue;
				}

				if (
					documents.some((d) => d.name === file.name && d.size === file.size)
				) {
					continue;
				}

				const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

				newDocs.push({
					id: Math.random().toString(36).substring(7),
					file,
					name: file.name,
					size: file.size,
					extension,
					status: "idle",
					progress: 0,
				});
			}

			if (newDocs.length > 0) {
				setDocuments((prev) => {
					const updated = [...prev, ...newDocs];
					onFilesChange?.(updated.map((d) => d.file));
					return updated;
				});
			}
		},
		[documents, onFilesChange],
	);

	const removeDocument = (id: string) => {
		setDocuments((prev) => {
			const updated = prev.filter((doc) => doc.id !== id);
			onFilesChange?.(updated.map((d) => d.file));
			return updated;
		});
	};

	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const onDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	};

	return {
		documents,
		isDragging,
		handleFiles,
		removeDocument,
		onDragOver,
		onDragLeave,
		onDrop,
	};
}
