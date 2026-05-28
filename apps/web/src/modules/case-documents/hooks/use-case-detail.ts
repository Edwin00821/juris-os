import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CaseDetail } from "../types";

interface CaseDetailApiResponse {
	success: true;
	data: CaseDetail;
}

async function fetchCaseDetail(
	caseNumber: string,
): Promise<CaseDetailApiResponse> {
	return apiClient<CaseDetailApiResponse>(`/cases/${caseNumber}`);
}

export function useCaseDetail(caseNumber: string | undefined) {
	return useQuery({
		queryKey: ["judge-case-detail", caseNumber],
		// biome-ignore lint/style/noNonNullAssertion: guarded by enabled:!!caseNumber
		queryFn: () => fetchCaseDetail(caseNumber!),
		enabled: !!caseNumber,
		staleTime: 1000 * 60 * 5,
	});
}
