import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useCitizensQuery(searchQuery = "") {
	return useQuery({
		queryKey: ["citizens", searchQuery],
		queryFn: async () => {
			const { data, error } = await authClient.admin.listUsers({
				query: {
					searchValue: searchQuery || undefined,
					limit: 50,
				},
			});

			if (error) throw new Error(error.message);

			return data.users
				.filter((user) => user.role === "citizen" || !user.role)
				.map((user) => ({
					id: user.id,
					name: user.name,
					email: user.email,
					initials: user.name.slice(0, 2).toUpperCase(),
					hash: `0x${user.id.slice(0, 4).toUpperCase()}...${user.id.slice(-4).toUpperCase()}`,
					status: user.emailVerified ? "Verificado" : "Pendiente",
					lastActivity: new Date(user.updatedAt).toLocaleDateString("es-MX", {
						year: "numeric",
						month: "short",
						day: "numeric",
					}),
				}));
		},
		staleTime: 1000 * 60 * 5,
		placeholderData: (previousData) => previousData,
	});
}
