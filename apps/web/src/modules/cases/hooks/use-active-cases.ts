import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Case } from "../types/case.types";

interface PaginatedCases {
	data: Case[];
	totalCount: number;
	totalPages: number;
}

async function fetchCasesMock(
	_page: number,
	_pageSize: number,
): Promise<PaginatedCases> {
	await new Promise((resolve) => setTimeout(resolve, 800));

	const mockData: Case[] = [
		{
			id: "DR-2024-0012",
			title: "Vane vs. CloudCorp Logistics",
			registrationDate: "12 Oct, 2024",
			status: "OPEN",
		},
		{
			id: "JD-2023-8902",
			title: "Revisión de Límites de Propiedad",
			registrationDate: "05 Sep, 2024",
			status: "UNDER_REVIEW",
		},
		{
			id: "TX-2024-0441",
			title: "Evaluación de Impuestos Municipales",
			registrationDate: "22 Nov, 2024",
			status: "PENDING_RESOLUTION",
		},
		{
			id: "DR-2024-0015",
			title: "Disputa Contractual: Autónomo",
			registrationDate: "01 Dic, 2024",
			status: "OPEN",
		},
	];

	return {
		data: mockData,
		totalCount: 4,
		totalPages: 1,
	};
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
		queryFn: () => fetchCasesMock(page, pageSize),
		placeholderData: keepPreviousData,
	});
}
