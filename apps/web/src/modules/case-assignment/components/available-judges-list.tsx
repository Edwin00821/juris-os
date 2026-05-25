"use client";

import { Loader2, Sparkles, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useAssignCase } from "../hooks/use-assign-case";
import { useAvailableJudges } from "../hooks/use-available-judges";
import { JudgeCard } from "./judge-card";

export function AvailableJudgesList() {
	const [sortMode] = useQueryState("sort", { defaultValue: "workload" });
	const [selectedCaseId, setSelectedCaseId] = useQueryState("caseId");

	const { data: judges, isLoading, isError } = useAvailableJudges();
	const { mutate: assignCase, isPending } = useAssignCase();

	const MAX_CASES_WORKLOAD = 10;

	const sortedJudges = useMemo(() => {
		if (!judges) return [];

		const mapped = judges.map((j) => ({
			id: j.id,
			name: j.name,
			specialty: j.email,
			workload: Math.min(
				100,
				Math.round((j.activeCases / MAX_CASES_WORKLOAD) * 100),
			),
			activeCases: j.activeCases,
		}));

		if (sortMode === "ai") {
			return [...mapped].sort((a, b) => a.workload - b.workload);
		}

		return [...mapped].sort((a, b) => a.workload - b.workload);
	}, [judges, sortMode]);

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
				No se pudieron cargar los jueces. Intenta recargar la página.
			</div>
		);
	}

	return (
		<>
			<div className="mb-2 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-bold text-primary text-xl">
					<Users className="h-5 w-5" />
					Jueces Disponibles
				</h2>

				{sortMode === "ai" && (
					<div className="fade-in zoom-in flex animate-in items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 font-bold text-[10px] text-on-primary-fixed uppercase tracking-widest duration-300">
						<Sparkles className="h-3 w-3" />
						Ordenado por carga
					</div>
				)}
			</div>

			{sortedJudges.length === 0 ? (
				<p className="py-8 text-center text-on-surface-variant text-sm">
					No hay jueces registrados.
				</p>
			) : (
				<div className="space-y-4">
					{sortedJudges.map((judge) => (
						<JudgeCard
							key={judge.id}
							judge={judge}
							isAiMode={sortMode === "ai"}
							canAssign={!!selectedCaseId}
							isAssigning={isPending}
							onAssign={(judgeId) => {
								if (!selectedCaseId) return;
								assignCase(
									{ caseId: selectedCaseId, judgeId },
									{ onSuccess: () => setSelectedCaseId(null) },
								);
							}}
						/>
					))}
				</div>
			)}
		</>
	);
}
