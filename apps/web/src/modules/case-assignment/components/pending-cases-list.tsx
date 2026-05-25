"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { Clock, Inbox, Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useAssignCaseTableParams } from "../hooks/use-assign-case-table-params";
import { usePendingCases } from "../hooks/use-pending-cases";

function timeAgo(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const days = Math.floor(diff / 86_400_000);
	if (days === 0) return "Hoy";
	if (days === 1) return "Ayer";
	return `Hace ${days} días`;
}

const CATEGORY_LABELS: Record<string, string> = {
	criminal: "Penal",
	family: "Familiar",
	labor: "Laboral",
};

export function PendingCasesList() {
	const [selectedCaseId, setSelectedCaseId] = useQueryState("caseId", {
		defaultValue: "",
		shallow: false,
	});

	const { page, pageSize } = useAssignCaseTableParams();
	const { data, isLoading, isError } = usePendingCases({ page, pageSize });

	const cases = data?.data ?? [];

	if (isLoading) {
		return (
			<div className="flex h-40 items-center justify-center text-on-surface-variant">
				<Loader2 className="h-5 w-5 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-xl border border-error-container bg-error-container/20 p-5 text-on-error-container text-sm">
				No se pudieron cargar los casos. Intenta recargar la página.
			</div>
		);
	}

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-bold text-primary text-xl">
					<Inbox className="h-5 w-5" />
					Casos Pendientes
				</h2>
				{data?.meta && (
					<span className="rounded bg-surface-container-high px-2 py-0.5 font-bold text-on-surface-variant text-xs">
						{data.meta.totalCount} casos
					</span>
				)}
			</div>

			{cases.length === 0 ? (
				<p className="py-8 text-center text-on-surface-variant text-sm">
					No hay casos pendientes de asignación.
				</p>
			) : (
				<div className="flex flex-col gap-4">
					{cases.map((lawsuit) => {
						const isSelected = selectedCaseId === lawsuit.id;

						return (
							// biome-ignore lint/a11y/noStaticElementInteractions: <>
							// biome-ignore lint/a11y/useKeyWithClickEvents: <>
							<div
								key={lawsuit.id}
								onClick={() => setSelectedCaseId(isSelected ? "" : lawsuit.id)}
								className={cn(
									"flex cursor-pointer flex-col gap-4 rounded-xl border-2 bg-surface-container-lowest p-5 transition-all duration-200",
									isSelected
										? "border-primary shadow-[0_0_0_2px_#d6e3ff]"
										: "border-transparent opacity-75 hover:border-outline-variant/30 hover:opacity-100",
								)}
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<span className="font-bold text-[10px] uppercase tracking-widest">
											Ref.: {lawsuit.id}
										</span>
										<h3 className="mt-1 font-bold text-lg text-primary-container leading-tight">
											{lawsuit.title}
										</h3>
									</div>
									<div className="shrink-0 rounded bg-surface-container-high px-2 py-1 font-semibold text-xs">
										{CATEGORY_LABELS[lawsuit.category] ?? lawsuit.category}
									</div>
								</div>

								<div className="flex items-center gap-4 text-on-surface-variant text-sm">
									<span className="flex items-center gap-1 font-medium">
										<Clock className="h-4 w-4" />
										{timeAgo(lawsuit.registrationDate)}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}
