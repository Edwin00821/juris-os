"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useQueryState } from "nuqs";

export function AssignmentHeader() {
	const [sortMode, setSortMode] = useQueryState("sort", {
		defaultValue: "manual",
	});

	const isAiMode = sortMode === "ai";

	const toggleAiSort = () => {
		setSortMode(isAiMode ? "manual" : "ai");
	};

	return (
		<section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<h1 className="font-extrabold font-headline text-3xl text-primary tracking-tight">
					Asignación de Casos
				</h1>
				<p className="mt-2">
					Seleccione un caso pendiente y asigne el juez más adecuado. Use la IA
					para obtener recomendaciones inteligentes.
				</p>
			</div>

			<button
				type="button"
				onClick={toggleAiSort}
				className={cn(
					"flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm shadow-lg transition-all",
					isAiMode
						? "bg-linear-to-r from-emerald-600 to-emerald-700 text-white"
						: "bg-linear-to-r from-primary to-primary-container text-white hover:scale-[1.02] hover:shadow-xl",
				)}
			>
				{isAiMode ? (
					<>
						<CheckCircle2 className="h-5 w-5" />
						Jueces Ordenados por IA
					</>
				) : (
					<>
						<Sparkles className="h-5 w-5" />
						Ordenar Jueces con IA
					</>
				)}
			</button>
		</section>
	);
}
