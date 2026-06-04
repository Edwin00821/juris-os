"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export function useDeleteDocument(caseNumber: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (documentId: string) =>
			apiClient(`/documents/${documentId}`, { method: "DELETE" }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["case-documents", caseNumber],
			});
			toast("Documento eliminado.");
		},
		onError: () => {
			toast.error("No se pudo eliminar el documento.");
		},
	});
}
