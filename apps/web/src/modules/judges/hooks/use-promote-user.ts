import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function usePromoteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			const { data, error } = await authClient.admin.setRole({
				userId,
				role: "judge",
			});
			if (error) throw new Error(error.message);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["citizens"] });
			queryClient.invalidateQueries({ queryKey: ["available-judges"] });
			toast.success("Usuario elevado a juez correctamente");
		},
		onError: (error: Error) => {
			toast.error("Error al elevar usuario", { description: error.message });
		},
	});
}
