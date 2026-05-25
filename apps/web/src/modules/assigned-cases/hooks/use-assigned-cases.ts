import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface AssignedCase {
	id: string; // caseNumber (e.g. LAB-2026-0001)
	title: string;
	category: string;
	registrationDate: string;
	status: string;
	judgeId: string | null;
}

interface AssignedCasesApiResponse {
	success: true;
	data: AssignedCase[];
	meta: {
		totalCount: number;
		totalPages: number;
		page: number;
		pageSize: number;
	};
}

async function fetchAssignedCases(
	page: number,
	pageSize: number,
): Promise<AssignedCasesApiResponse> {
	const params = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
		assigned: "true",
	});

	return apiClient<AssignedCasesApiResponse>(`/cases?${params.toString()}`);
}

export function useAssignedCases({
	page,
	pageSize,
}: {
	page: number;
	pageSize: number;
}) {
	return useQuery({
		queryKey: ["assigned-cases", page, pageSize],
		queryFn: () => fetchAssignedCases(page, pageSize),
		staleTime: 1000 * 60 * 2,
		placeholderData: (previousData) => previousData,
	});
}
