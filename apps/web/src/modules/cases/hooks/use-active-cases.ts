import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Case } from "../types/case.types";

interface PaginatedCases {
	data: Case[];
	totalCount: number;
	totalPages: number;
}

async function fetchActiveCases(
	page: number,
	pageSize: number,
): Promise<PaginatedCases> {
	const params = new URLSearchParams({
		page: page.toString(),
		pageSize: pageSize.toString(),
	});

	return apiClient<PaginatedCases>(`/cases?${params.toString()}`);
}

export function useActiveCases({
	page,
	pageSize,
}: {
	page: number;
	pageSize: number;
}) {
	return useQuery({
		queryKey: ["active-cases", page, pageSize],
		queryFn: () => fetchActiveCases(page, pageSize),
		placeholderData: keepPreviousData,
	});
}
