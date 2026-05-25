"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@juris-os/ui/components/table";
import { cn } from "@juris-os/ui/lib/utils";
import { ArrowDownToLine, Loader2, Users } from "lucide-react";
import { useAvailableJudges } from "@/modules/case-assignment/hooks/use-available-judges";
import { useDemoteJudge } from "../hooks/use-demote-judge";

const MAX_CASES_WORKLOAD = 10;

export function JudgesDirectoryTable() {
	const { data: judges, isLoading, isError } = useAvailableJudges();
	const { mutate: demote, isPending } = useDemoteJudge();

	if (isLoading) {
		return (
			<div className="flex h-32 items-center justify-center text-on-surface-variant">
				<Loader2 className="h-5 w-5 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="m-4 rounded-xl border border-error-container bg-error-container/20 p-4 text-on-error-container text-sm">
				No se pudieron cargar los jueces. Intenta recargar la página.
			</div>
		);
	}

	if (!judges || judges.length === 0) {
		return (
			<div className="flex h-32 flex-col items-center justify-center gap-2 text-on-surface-variant">
				<Users className="h-8 w-8 opacity-40" />
				<p className="text-sm">No hay jueces registrados en el sistema.</p>
			</div>
		);
	}

	return (
		<div className="custom-scrollbar overflow-x-auto">
			<Table className="w-full text-left">
				<TableHeader className="bg-surface-container font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					<TableRow className="border-none hover:bg-transparent">
						<TableHead className="px-6 py-4">Juez</TableHead>
						<TableHead className="px-6 py-4">Correo</TableHead>
						<TableHead className="px-6 py-4">Carga de Trabajo</TableHead>
						<TableHead className="px-6 py-4 text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className="divide-y-0">
					{judges.map((judge, index) => {
						const workload = Math.min(
							100,
							Math.round((judge.activeCases / MAX_CASES_WORKLOAD) * 100),
						);

						return (
							<TableRow
								key={judge.id}
								className={cn(
									"border-none transition-colors",
									index % 2 === 0
										? "bg-surface-container-lowest hover:bg-surface-container"
										: "bg-surface-container hover:bg-surface-container-high",
								)}
							>
								<TableCell className="flex items-center gap-3 px-6 py-4 font-medium text-on-surface">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container font-bold text-on-secondary-container text-xs">
										{judge.name.slice(0, 2).toUpperCase()}
									</div>
									{judge.name}
								</TableCell>
								<TableCell className="px-6 py-4 text-on-surface-variant text-sm">
									{judge.email}
								</TableCell>
								<TableCell className="px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-container-highest">
											<div
												className={cn(
													"h-full rounded-full transition-all",
													workload > 80
														? "bg-error"
														: workload > 50
															? "bg-tertiary"
															: "bg-primary",
												)}
												style={{ width: `${workload}%` }}
											/>
										</div>
										<span className="text-on-surface-variant text-xs">
											{judge.activeCases} casos activos
										</span>
									</div>
								</TableCell>
								<TableCell className="px-6 py-4 text-right">
									<button
										type="button"
										onClick={() => demote(judge.id)}
										disabled={isPending}
										className="ml-auto flex items-center gap-1.5 font-bold text-error text-xs transition-opacity hover:opacity-70 disabled:cursor-wait disabled:opacity-50"
									>
										{isPending ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<ArrowDownToLine className="h-3.5 w-3.5" />
										)}
										Degradar a ciudadano
									</button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
