"use client";

import { Loader2, Sparkles, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useAssignCase } from "../hooks/use-assign-case";
import { useAvailableJudges } from "../hooks/use-available-judges";
import { useSuggestJudges } from "../hooks/use-suggest-judges";
import { AiRecommendation, type RankedJudge } from "./ai-recommendation";
import { JudgeCard } from "./judge-card";

const MAX_CASES_WORKLOAD = 10;

const SPECIALTY_LABELS: Record<string, string> = {
	criminal: "Penal",
	family: "Familiar",
	labor: "Laboral",
};

function workloadPct(activeCases: number): number {
	return Math.min(100, Math.round((activeCases / MAX_CASES_WORKLOAD) * 100));
}

function specialtyLabel(specialty: string | null): string {
	if (!specialty) return "Sin especialidad";
	return SPECIALTY_LABELS[specialty] ?? specialty;
}

export function AvailableJudgesList() {
	const [sortMode] = useQueryState("sort", { defaultValue: "manual" });
	const [selectedCaseId, setSelectedCaseId] = useQueryState("caseId");

	const isAiMode = sortMode === "ai";

	const { data: judges, isLoading, isError } = useAvailableJudges();
	const { mutate: assignCase, isPending } = useAssignCase();
	const {
		data: suggestions,
		isLoading: isSuggesting,
		isError: isSuggestError,
	} = useSuggestJudges({ caseId: selectedCaseId, enabled: isAiMode });

	// Manual list: judges sorted by workload (lightest first).
	const manualJudges = useMemo(() => {
		if (!judges) return [];
		return judges
			.map((j) => ({
				id: j.id,
				name: j.name,
				specialty: specialtyLabel(j.specialty),
				workload: workloadPct(j.activeCases),
				activeCases: j.activeCases,
			}))
			.sort((a, b) => a.workload - b.workload);
	}, [judges]);

	// AI ranking: engine order enriched with each judge's specialty/workload.
	const rankedJudges = useMemo<RankedJudge[]>(() => {
		if (!judges || !suggestions) return [];
		const byId = new Map(judges.map((j) => [j.id, j]));
		return suggestions
			.map((s) => {
				const judge = byId.get(s.judgeId);
				if (!judge) return null;
				return {
					judgeId: s.judgeId,
					name: s.name,
					specialtyLabel: specialtyLabel(judge.specialty),
					score: Math.round(s.score),
					estimatedDays: Math.round(s.estimatedDays),
					justification: s.justification,
					workload: workloadPct(judge.activeCases),
				} satisfies RankedJudge;
			})
			.filter((j): j is RankedJudge => j !== null);
	}, [judges, suggestions]);

	const handleAssign = (judgeId: string) => {
		if (!selectedCaseId) return;
		assignCase(
			{ caseId: selectedCaseId, judgeId },
			{ onSuccess: () => setSelectedCaseId(null) },
		);
	};

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
			<div className="mb-4 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-bold text-primary text-xl">
					<Users className="h-5 w-5" />
					{isAiMode ? "Recomendación de IA" : "Jueces Disponibles"}
				</h2>

				{isAiMode && (
					<div className="fade-in zoom-in flex animate-in items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 font-bold text-[10px] text-on-primary-fixed uppercase tracking-widest duration-300">
						{isSuggesting ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : (
							<Sparkles className="h-3 w-3" />
						)}
						{isSuggesting ? "Analizando" : "IA"}
					</div>
				)}
			</div>

			{/* ---- AI mode ---- */}
			{isAiMode ? (
				<AiModeContent
					hasCase={!!selectedCaseId}
					isSuggesting={isSuggesting}
					isSuggestError={isSuggestError}
					ranked={rankedJudges}
					isAssigning={isPending}
					onAssign={handleAssign}
				/>
			) : /* ---- Manual mode ---- */
			manualJudges.length === 0 ? (
				<p className="py-8 text-center text-on-surface-variant text-sm">
					No hay jueces registrados.
				</p>
			) : (
				<div className="space-y-4">
					{manualJudges.map((judge) => (
						<JudgeCard
							key={judge.id}
							judge={judge}
							canAssign={!!selectedCaseId}
							isAssigning={isPending}
							onAssign={handleAssign}
						/>
					))}
				</div>
			)}
		</>
	);
}

function AiModeContent({
	hasCase,
	isSuggesting,
	isSuggestError,
	ranked,
	isAssigning,
	onAssign,
}: {
	hasCase: boolean;
	isSuggesting: boolean;
	isSuggestError: boolean;
	ranked: RankedJudge[];
	isAssigning: boolean;
	onAssign: (judgeId: string) => void;
}) {
	if (!hasCase) {
		return (
			<div className="flex flex-col items-center gap-3 rounded-2xl border border-outline-variant/30 border-dashed bg-surface-container-low p-10 text-center">
				<Sparkles className="h-8 w-8 text-primary/60" />
				<p className="font-medium text-on-surface-variant text-sm">
					Seleccione un caso pendiente y la IA recomendará al juez más adecuado.
				</p>
			</div>
		);
	}

	if (isSuggesting) {
		return (
			<div className="flex h-48 flex-col items-center justify-center gap-3 text-on-surface-variant">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				<p className="text-sm">Analizando jueces con IA…</p>
			</div>
		);
	}

	if (isSuggestError) {
		return (
			<div className="rounded-xl border border-error-container bg-error-container/20 p-5 text-on-error-container text-sm">
				No se pudo obtener la recomendación del motor de IA. Verifique que el
				servicio esté en ejecución e intente de nuevo.
			</div>
		);
	}

	if (ranked.length === 0) {
		return (
			<p className="py-8 text-center text-on-surface-variant text-sm">
				No se encontraron jueces disponibles para este caso.
			</p>
		);
	}

	return (
		<AiRecommendation
			ranked={ranked}
			isAssigning={isAssigning}
			onAssign={onAssign}
		/>
	);
}
