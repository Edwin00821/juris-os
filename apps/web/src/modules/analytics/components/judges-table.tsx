import { cn } from "@juris-os/ui/lib/utils";
import { Download } from "lucide-react";
import type {
	JudgePerformance,
	JudgeStatus,
} from "../hooks/use-dashboard-analytics";

const statusMap: Record<JudgeStatus, { label: string; className: string }> = {
	optimal: { label: "Óptimo", className: "bg-[#d6e3ff] text-[#2d476f]" },
	alert: { label: "Carga alta", className: "bg-[#fff3cd] text-[#7a5c00]" },
	overloaded: {
		label: "Sobrecargado",
		className: "bg-[#ffdad6] text-[#93000a]",
	},
};

function exportToCsv(judges: JudgePerformance[], period: string) {
	const headers = [
		"Nombre",
		"Correo",
		"Casos Activos",
		"Cerrados en Período",
		"Días Promedio",
		"Estado",
	];
	const rows = judges.map((j) => [
		j.name,
		j.email,
		j.activeCases,
		j.closedInPeriod,
		j.avgDays,
		statusMap[j.status].label,
	]);

	const csv = [headers, ...rows]
		.map((row) => row.map((cell) => `"${cell}"`).join(","))
		.join("\n");

	const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `auditoria-jueces-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}

interface JudgesTableProps {
	judges: JudgePerformance[];
	period: string;
}

export function JudgesTable({ judges, period }: JudgesTableProps) {
	return (
		<div className="col-span-4 overflow-hidden rounded-xl bg-white shadow-sm">
			<div className="flex items-center justify-between border-slate-100 border-b bg-slate-50 px-6 py-4">
				<h4 className="font-[Manrope,sans-serif] font-bold text-[#002045] text-xl">
					Rendimiento de Jueces
				</h4>
				<button
					type="button"
					onClick={() => exportToCsv(judges, period)}
					disabled={judges.length === 0}
					className="flex items-center gap-1 font-bold text-[#002045] text-sm hover:underline disabled:cursor-not-allowed disabled:opacity-40"
				>
					Exportar Auditoría
					<Download className="h-4 w-4" />
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-slate-50 text-slate-500">
							{[
								"Juez",
								"Casos Activos",
								"Cerrados (Período)",
								"Días Promedio",
								"Estado",
							].map((col, i) => (
								<th
									key={col}
									className={cn(
										"px-6 py-4 font-bold text-xs uppercase tracking-widest",
										i > 0 && i < 4 ? "text-center" : "",
										i === 4 ? "text-right" : "",
									)}
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{judges.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-10 text-center text-slate-400 text-sm"
								>
									No hay jueces registrados.
								</td>
							</tr>
						) : (
							judges.map((judge, idx) => {
								const status = statusMap[judge.status];
								return (
									<tr
										key={judge.id}
										className={cn(
											"transition-colors hover:bg-slate-50",
											idx % 2 === 1 ? "bg-slate-50/30" : "",
										)}
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d6e3ff] font-bold text-[#001b3c] text-xs">
													{judge.initials}
												</div>
												<div>
													<p className="font-bold text-[#002045]">
														{judge.name}
													</p>
													<p className="text-slate-500 text-xs">
														{judge.email}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-center font-semibold text-slate-700">
											{judge.activeCases}
										</td>
										<td className="px-6 py-4 text-center font-semibold text-slate-700">
											{judge.closedInPeriod}
										</td>
										<td className="px-6 py-4 text-center font-semibold text-slate-700">
											{judge.avgDays > 0 ? `${judge.avgDays}d` : "—"}
										</td>
										<td className="px-6 py-4 text-right">
											<span
												className={cn(
													"rounded-full px-2 py-1 font-bold text-[10px] uppercase",
													status.className,
												)}
											>
												{status.label}
											</span>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
