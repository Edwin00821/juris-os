import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useAppForm } from "@/forms/form-context";
import { apiClient } from "@/lib/api-client";
import { uploadFiles } from "@/lib/uploadthing";
import { useDraftStore } from "../stores/draft.store";

const manualLawsuitSchema = z.object({
	title: z.string().min(1, "El título es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
	category: z.string().min(1, "Seleccione una categoría"),
	incidentDate: z.string().min(1, "La fecha es requerida"),

	counterpartyName: z.string(),
	counterpartyAddress: z.string(),
	counterpartyId: z.string(),
});

interface CaseApiResponse {
	success: true;
	data: { uuid: string; id: string };
}

export function useSubmitLawsuit() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const pendingFilesRef = useRef<File[]>([]);

	const getActiveDraft = useDraftStore((state) => state.getActiveDraft);
	const activeDraftId = useDraftStore((state) => state.activeDraftId);

	// Recalculate draft values when activeDraftId changes
	const draftValues = useMemo(() => {
		const draft = getActiveDraft();
		if (draft) {
			return {
				title: draft.title,
				description: draft.description,
				category: draft.category,
				incidentDate: draft.incidentDate,
				counterpartyName: draft.counterpartyName,
				counterpartyAddress: draft.counterpartyAddress,
				counterpartyId: draft.counterpartyId,
			};
		}
		return null;
	}, [activeDraftId, getActiveDraft]);

	const setPendingFiles = (files: File[]) => {
		pendingFilesRef.current = files;
	};

	const form = useAppForm({
		defaultValues: {
			title: draftValues?.title ?? "",
			description: draftValues?.description ?? "",
			category: draftValues?.category ?? "",
			incidentDate: draftValues?.incidentDate ?? "",

			counterpartyName: draftValues?.counterpartyName ?? "",
			counterpartyAddress: draftValues?.counterpartyAddress ?? "",
			counterpartyId: draftValues?.counterpartyId ?? "",
		},
		validators: {
			onChange: manualLawsuitSchema,
			onSubmit: manualLawsuitSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			setError(null);

			try {
				const response = await apiClient<CaseApiResponse>("/cases", {
					method: "POST",
					body: JSON.stringify(value),
				});

				const caseUuid = response.data.uuid;
				const files = pendingFilesRef.current;

				if (files.length > 0 && caseUuid) {
					const uploaded = await uploadFiles("caseDocumentUploader", { files });

					await Promise.all(
						uploaded.map((file) =>
							apiClient("/documents", {
								method: "POST",
								body: JSON.stringify({
									caseId: caseUuid,
									fileName: file.name,
									fileType: file.type || "application/octet-stream",
									storageKey: file.key,
									fileUrl: file.ufsUrl,
									documentType: "evidence",
								}),
							}),
						),
					);
				}

				await queryClient.invalidateQueries({ queryKey: ["active-cases"] });

				router.push("/citizen");
				router.refresh();
			} catch (_e) {
				setError(
					"Ocurrió un error al registrar la demanda. Intente nuevamente.",
				);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	return { form, isSubmitting, error, setPendingFiles };
}
