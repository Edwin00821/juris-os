import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { UploadedDocument } from "../types/document.types";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function useFileUpload() {
	const [documents, setDocuments] = useState<UploadedDocument[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: simulateUpload is stable (only uses setDocuments)
	const handleFiles = useCallback(
		(files: FileList | File[]) => {
			const newDocs: UploadedDocument[] = [];
			const ArrayFiles = Array.from(files);

			for (const file of ArrayFiles) {
				if (file.size > MAX_FILE_SIZE) {
					toast(`El archivo "${file.name}" excede el límite de 25 MB.`);
					continue;
				}

				if (
					documents.some((d) => d.name === file.name && d.size === file.size)
				) {
					continue;
				}

				const extension = file.name.split(".").pop()?.toLowerCase() || "";

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
				setDocuments((prev) => [...prev, ...newDocs]);

				simulateUpload(newDocs);
			}
		},
		[documents],
	);

	const simulateUpload = (docs: UploadedDocument[]) => {
		docs.forEach((doc) => {
			setDocuments((prev) =>
				prev.map((d) =>
					d.id === doc.id ? { ...d, status: "uploading", progress: 30 } : d,
				),
			);

			setTimeout(
				() => {
					setDocuments((prev) =>
						prev.map((d) =>
							d.id === doc.id
								? {
										...d,
										status: "success",
										progress: 100,
										url: "https://r2.cloudflare.com/mock-url",
									}
								: d,
						),
					);
				},
				1500 + Math.random() * 1000,
			);
		});
	};

	const removeDocument = (id: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== id));
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
