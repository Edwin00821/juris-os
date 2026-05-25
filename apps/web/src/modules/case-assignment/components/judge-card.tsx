import { cn } from "@juris-os/ui/lib/utils";
import { CheckCircle2, Loader2, Timer, Users } from "lucide-react";

export interface Judge {
	id: string;
	name: string;
	specialty: string; // email for now
	workload: number; // 0–100 derived from activeCases
	activeCases: number;
}

interface JudgeCardProps {
	judge: Judge;
	isAiMode: boolean;
	canAssign: boolean;
	isAssigning?: boolean;
	onAssign: (judgeId: string) => void;
}

export function JudgeCard({
	judge,
	isAiMode,
	canAssign,
	isAssigning = false,
	onAssign,
}: JudgeCardProps) {
	return (
		<div className="flex items-center gap-5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
			<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary-container">
				<Users className="h-6 w-6 text-on-secondary-container" />
			</div>

			<div className="min-w-0 flex-1">
				<p className="mb-1 font-bold text-primary">{judge.name}</p>
				<p className="text-on-surface-variant text-sm">{judge.specialty}</p>

				<div className="mt-2 flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-1">
						<div
							className={cn(
								"h-1.5 w-8 rounded-full",
								judge.workload > 20
									? "bg-primary"
									: "bg-surface-container-highest",
							)}
						/>
						<div
							className={cn(
								"h-1.5 w-8 rounded-full",
								judge.workload > 50
									? "bg-primary"
									: "bg-surface-container-highest",
							)}
						/>
						<div
							className={cn(
								"h-1.5 w-8 rounded-full",
								judge.workload > 80
									? "bg-primary"
									: "bg-surface-container-highest",
							)}
						/>
						<span className="ml-1 font-medium text-[10px]">
							{judge.workload}% carga
						</span>
					</div>

					<span className="flex items-center gap-1 font-medium text-[10px]">
						<Timer className="h-3 w-3" /> {judge.activeCases} casos activos
					</span>
				</div>
			</div>

			{/** biome-ignore lint/a11y/useButtonType: <> */}
			<button
				disabled={!canAssign || isAssigning}
				onClick={() => onAssign(judge.id)}
				className={cn(
					"flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 font-bold text-xs transition-all",
					canAssign
						? "bg-primary text-white shadow-sm hover:opacity-90"
						: "cursor-not-allowed bg-surface-container-high text-on-surface-variant opacity-50",
					isAssigning && "cursor-wait opacity-70",
				)}
			>
				{isAssigning ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<CheckCircle2 className="h-4 w-4" />
				)}
				{isAssigning ? "Asignando..." : "Asignar"}
			</button>
		</div>
	);
}
