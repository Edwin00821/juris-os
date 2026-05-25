import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface AssignCasePayload {
	caseId: string;
	judgeId: string;
}

export function useAssignCase() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ caseId, judgeId }: AssignCasePayload) =>
			apiClient(`/cases/${caseId}/assign`, {
				method: "PATCH",
				body: JSON.stringify({ judgeId }),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["pending-cases", "unassigned"],
			});
			queryClient.invalidateQueries({ queryKey: ["available-judges"] });
			toast.success("Caso asignado correctamente");
		},
		onError: (error: Error) => {
			toast.error("Error al asignar el caso", {
				description: error.message,
			});
		},
	});
}
