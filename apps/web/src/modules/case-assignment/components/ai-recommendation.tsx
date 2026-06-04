import { cn } from "@juris-os/ui/lib/utils";
import {
	CheckCircle2,
	Gauge,
	Loader2,
	Sparkles,
	Timer,
	Trophy,
} from "lucide-react";

export interface RankedJudge {
	judgeId: string;
	name: string;
	specialtyLabel: string;
	score: number;
	estimatedDays: number;
	justification: string;
	workload: number;
}

interface AiRecommendationProps {
	ranked: RankedJudge[];
	isAssigning: boolean;
	onAssign: (judgeId: string) => void;
}

function firstName(name: string): string {
	// "Hon. Elena Jacobs" -> "Elena"
	const parts = name.replace(/^Hon\.?\s+/i, "").split(" ");
	return parts[0] ?? name;
}

export function AiRecommendation({
	ranked,
	isAssigning,
	onAssign,
}: AiRecommendationProps) {
	const [winner, ...alternatives] = ranked;
	if (!winner) return null;

	return (
		<div className="fade-in slide-in-from-bottom-2 animate-in space-y-5 duration-300">
			{/* Hero — winning judge */}
			<div className="overflow-hidden rounded-2xl border-2 border-primary shadow-[0_0_0_3px_#d6e3ff]">
				<div className="flex items-center gap-2 bg-primary px-4 py-2 font-bold text-[11px] text-white uppercase tracking-widest">
					<Sparkles className="h-3.5 w-3.5" />
					Recomendado por IA
				</div>

				<div className="bg-surface-container-lowest p-6">
					<div className="flex items-start gap-5">
						<div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-container">
							<Trophy className="h-7 w-7 text-on-primary-container" />
							<span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-white text-xs shadow">
								1
							</span>
						</div>

						<div className="min-w-0 flex-1">
							<p className="font-bold text-primary text-xl leading-tight">
								{winner.name}
							</p>
							<p className="text-on-surface-variant text-sm">
								Especialidad: {winner.specialtyLabel}
							</p>

							{/* Idoneidad bar */}
							<div className="mt-3">
								<div className="mb-1 flex items-center justify-between font-bold text-[11px] text-on-surface-variant uppercase tracking-wide">
									<span>Idoneidad</span>
									<span className="text-primary">{winner.score}%</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
									<div
										className="h-full rounded-full bg-primary transition-all duration-500"
										style={{ width: `${Math.min(100, winner.score)}%` }}
									/>
								</div>
							</div>

							{/* Stats */}
							<div className="mt-3 flex flex-wrap items-center gap-4 text-on-surface-variant text-xs">
								<span className="flex items-center gap-1 font-medium">
									<Gauge className="h-3.5 w-3.5" />~{winner.estimatedDays} días
									estimados
								</span>
								<span className="flex items-center gap-1 font-medium">
									<Timer className="h-3.5 w-3.5" />
									{winner.workload}% carga
								</span>
							</div>
						</div>
					</div>

					{/* Justification */}
					<p className="mt-4 rounded-lg border border-primary/15 bg-primary-fixed/40 p-3 text-on-primary-fixed text-sm italic">
						“{winner.justification}”
					</p>

					{/* CTA */}
					{/** biome-ignore lint/a11y/useButtonType: <> */}
					<button
						disabled={isAssigning}
						onClick={() => onAssign(winner.judgeId)}
						className={cn(
							"mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-sm text-white shadow-sm transition-all hover:opacity-90",
							isAssigning && "cursor-wait opacity-70",
						)}
					>
						{isAssigning ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<CheckCircle2 className="h-4 w-4" />
						)}
						{isAssigning
							? "Asignando..."
							: `Asignar a ${firstName(winner.name)}`}
					</button>
				</div>
			</div>

			{/* Alternatives */}
			{alternatives.length > 0 && (
				<div>
					<p className="mb-2 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
						Alternativas
					</p>
					<div className="space-y-2">
						{alternatives.map((judge, index) => (
							<div
								key={judge.judgeId}
								className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 transition-all hover:border-outline-variant/60"
							>
								<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-bold text-on-surface-variant text-xs">
									{index + 2}
								</span>

								<div className="min-w-0 flex-1">
									<p className="truncate font-bold text-primary text-sm">
										{judge.name}
									</p>
									<p className="flex flex-wrap items-center gap-2 text-[11px] text-on-surface-variant">
										<span>{judge.specialtyLabel}</span>
										<span>·</span>
										<span className="font-semibold">
											{judge.score}% idoneidad
										</span>
										<span>·</span>
										<span>~{judge.estimatedDays}d</span>
									</p>
								</div>

								{/** biome-ignore lint/a11y/useButtonType: <> */}
								<button
									disabled={isAssigning}
									onClick={() => onAssign(judge.judgeId)}
									className={cn(
										"shrink-0 rounded-lg bg-surface-container-high px-3 py-1.5 font-bold text-on-surface text-xs transition-all hover:bg-primary hover:text-white",
										isAssigning && "cursor-wait opacity-70",
									)}
								>
									Asignar
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
