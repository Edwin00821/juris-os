"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client";
import { CaseDetailCard } from "../components/case-detail-card";

interface CaseDetailPageProps {
	caseId: string;
}

interface CaseResponseData {
	id: string;
	uuid: string;
	title: string;
	category: string;
	registrationDate: string;
	status: "OPEN" | "UNDER_REVIEW" | "PENDING_RESOLUTION" | "CLOSED";
	resolution: "admitted" | "conditioned" | "rejected" | null;
	resolutionText: string | null;
	judgeId: string | null;
	judgeName: string | null;
	judgeEmail: string | null;
}

interface ApiResponse<T> {
	success: boolean;
	data: T;
	meta?: Record<string, unknown>;
}

export function CaseDetailPage({ caseId }: CaseDetailPageProps) {
	const router = useRouter();
	const {
		data: response,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["case", caseId],
		queryFn: () => apiClient<ApiResponse<CaseResponseData>>(`/cases/${caseId}`),
	});

	const caseData = response?.data;

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
			<button
				type="button"
				onClick={() => router.back()}
				className="flex w-fit items-center gap-2 text-primary transition-opacity hover:opacity-80"
			>
				<ChevronLeft className="size-4" />
				Volver
			</button>

			{isLoading ? (
				<div className="rounded-md bg-surface-container-lowest p-8">
					<p className="text-center text-on-surface-variant">
						Cargando detalle del caso...
					</p>
				</div>
			) : isError || !caseData ? (
				<div className="rounded-md bg-surface-container-lowest p-8">
					<p className="text-center text-error">
						Error al cargar el caso. Por favor, intente nuevamente.
					</p>
				</div>
			) : (
				<CaseDetailCard case={caseData} />
			)}
		</div>
	);
}
