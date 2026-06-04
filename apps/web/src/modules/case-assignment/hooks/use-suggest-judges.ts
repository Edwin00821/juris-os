import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface JudgeSuggestion {
	judgeId: string;
	name: string;
	score: number;
	justification: string;
	estimatedDays: number;
}

interface SuggestJudgeApiResponse {
	success: true;
	data: {
		caseId: string;
		suggestions: JudgeSuggestion[];
	};
}

async function fetchSuggestions(caseId: string): Promise<JudgeSuggestion[]> {
	const response = await apiClient<SuggestJudgeApiResponse>(
		"/ai/suggest-judge",
		{
			method: "POST",
			body: JSON.stringify({ caseNumber: caseId }),
		},
	);
	return response.data.suggestions;
}

/**
 * Asks the AI assignment engine to rank judges for the given case.
 * Only runs when AI mode is enabled and a case is selected.
 */
export function useSuggestJudges({
	caseId,
	enabled,
}: {
	caseId: string | null;
	enabled: boolean;
}) {
	return useQuery({
		queryKey: ["judge-suggestions", caseId],
		queryFn: () => fetchSuggestions(caseId as string),
		enabled: enabled && !!caseId,
		staleTime: 1000 * 60,
	});
}
