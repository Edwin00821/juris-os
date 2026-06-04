"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DocumentsApiResponse } from "../types";

export function useCaseDocuments(caseNumber: string | undefined) {
	return useQuery({
		queryKey: ["case-documents", caseNumber],
		queryFn: () =>
			// biome-ignore lint/style/noNonNullAssertion: guarded by enabled
			apiClient<DocumentsApiResponse>(`/cases/${caseNumber!}/documents`),
		enabled: !!caseNumber,
		staleTime: 1000 * 60 * 2,
	});
}
