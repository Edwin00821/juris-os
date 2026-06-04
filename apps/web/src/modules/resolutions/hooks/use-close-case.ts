import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export type CaseResolution = "admitted" | "conditioned" | "rejected";

interface CloseCasePayload {
	caseId: string; // caseNumber, e.g. CIV-2025-0001
	resolution?: CaseResolution;
	resolutionText?: string; // HTML body of the published sentence
}

export function useCloseCase() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: ({
			caseId,
			resolution = "admitted",
			resolutionText,
		}: CloseCasePayload) =>
			apiClient(`/cases/${caseId}/close`, {
				method: "PATCH",
				body: JSON.stringify({ resolution, resolutionText }),
			}),
		onSuccess: (_data, { caseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["judge-case-detail", caseId],
			});
			queryClient.invalidateQueries({ queryKey: ["judge-cases"] });
			toast.success("Sentencia publicada y caso cerrado");
			router.push(`/judge/cases/${caseId}/closed`);
		},
		onError: (error: Error) => {
			toast.error("No se pudo cerrar el caso", {
				description: error.message,
			});
		},
	});
}
