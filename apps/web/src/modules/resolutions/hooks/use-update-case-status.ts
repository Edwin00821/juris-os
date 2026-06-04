import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export type WorkingCaseStatus = "UNDER_REVIEW" | "PENDING_RESOLUTION";

interface UpdateStatusPayload {
	caseId: string; // caseNumber, e.g. CIV-2025-0001
	status: WorkingCaseStatus;
}

const STATUS_LABELS: Record<WorkingCaseStatus, string> = {
	UNDER_REVIEW: "En revisión",
	PENDING_RESOLUTION: "Pendiente de resolución",
};

export function useUpdateCaseStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ caseId, status }: UpdateStatusPayload) =>
			apiClient(`/cases/${caseId}/status`, {
				method: "PATCH",
				body: JSON.stringify({ status }),
			}),
		onSuccess: (_data, { caseId, status }) => {
			queryClient.invalidateQueries({
				queryKey: ["judge-case-detail", caseId],
			});
			queryClient.invalidateQueries({ queryKey: ["judge-cases"] });
			toast.success(`Estado actualizado: ${STATUS_LABELS[status]}`);
		},
		onError: (error: Error) => {
			toast.error("No se pudo actualizar el estado", {
				description: error.message,
			});
		},
	});
}
