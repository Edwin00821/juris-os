import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { JudgeCase } from "../types";

interface JudgeCasesApiResponse {
	success: true;
	data: JudgeCase[];
	meta: {
		totalCount: number;
		totalPages: number;
		page: number;
		pageSize: number;
	};
}

async function fetchJudgeCases(
	closed: boolean,
	page: number,
	pageSize: number,
): Promise<JudgeCasesApiResponse> {
	const params = new URLSearchParams({
		closed: closed.toString(),
		page: page.toString(),
		pageSize: pageSize.toString(),
	});
	return apiClient<JudgeCasesApiResponse>(`/cases?${params.toString()}`);
}

export function usePendingCases({
	page,
	pageSize,
}: {
	page: number;
	pageSize: number;
}) {
	return useQuery({
		queryKey: ["judge-cases", "pending", page, pageSize],
		queryFn: () => fetchJudgeCases(false, page, pageSize),
		staleTime: 1000 * 60 * 2,
		placeholderData: (previousData) => previousData,
	});
}

export function useClosedCases({
	page,
	pageSize,
}: {
	page: number;
	pageSize: number;
}) {
	return useQuery({
		queryKey: ["judge-cases", "closed", page, pageSize],
		queryFn: () => fetchJudgeCases(true, page, pageSize),
		staleTime: 1000 * 60 * 2,
		placeholderData: (previousData) => previousData,
	});
}
