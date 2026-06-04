"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useUploadThing } from "@/lib/uploadthing";
import type { CreateDocumentApiResponse, DocumentType } from "../types";

export function useUploadDocument(caseNumber: string, caseUuid: string) {
	const queryClient = useQueryClient();
	const { startUpload, isUploading } = useUploadThing("caseDocumentUploader");

	async function uploadFiles(
		files: File[],
		documentType: DocumentType = "other",
	) {
		if (files.length === 0) return;

		const uploaded = await startUpload(files);
		if (!uploaded) return;

		await Promise.all(
			uploaded.map((file) =>
				apiClient<CreateDocumentApiResponse>("/documents", {
					method: "POST",
					body: JSON.stringify({
						caseId: caseUuid,
						fileName: file.name,
						fileType: file.type || "application/octet-stream",
						storageKey: file.key,
						fileUrl: file.ufsUrl,
						documentType,
					}),
				}),
			),
		);

		await queryClient.invalidateQueries({
			queryKey: ["case-documents", caseNumber],
		});

		toast(`${uploaded.length} documento(s) subido(s) correctamente.`);
	}

	return { uploadFiles, isUploading };
}
