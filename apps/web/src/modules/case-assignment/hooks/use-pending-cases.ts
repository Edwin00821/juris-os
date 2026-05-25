import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PendingCase {
	id: string;
	title: string;
	category: string;
	registrationDate: string;
	status: string;
	judgeId: string | null;
}

interface PendingCasesApiResponse {
	success: true;
	data: PendingCase[];
	meta: {
		totalCount: number;
		totalPages: number;
		page: number;
		pageSize: number;
	};
}

async function fetchPendingCases(
	page: number,
	pageSize: number,
): Promise<PendingCasesApiResponse> {
	const params = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		assigned: "false",
	});

	return apiClient<PendingCasesApiResponse>(`/cases?${params.toString()}`);
}

export function usePendingCases({
	page,
	pageSize,
}: {
	page: number;
	pageSize: number;
}) {
	return useQuery({
		queryKey: ["pending-cases", "unassigned", page, pageSize],
		queryFn: () => fetchPendingCases(page, pageSize),
		staleTime: 1000 * 60 * 2,
		refetchOnWindowFocus: true,
	});
}
