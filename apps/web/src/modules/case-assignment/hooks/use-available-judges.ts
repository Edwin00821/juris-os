import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Judge {
	id: string;
	name: string;
	email: string;
	specialty: "criminal" | "family" | "labor" | null;
	activeCases: number;
}

interface JudgesApiResponse {
	success: true;
	data: Judge[];
}

async function fetchJudges(): Promise<Judge[]> {
	const response = await apiClient<JudgesApiResponse>("/users/judges");
	return response.data;
}

export function useAvailableJudges() {
	return useQuery({
		queryKey: ["available-judges"],
		queryFn: fetchJudges,
		staleTime: 1000 * 60 * 2,
	});
}
