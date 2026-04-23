"use client";

import { Badge } from "@juris-os-/ui/components/badge";
import { Button } from "@juris-os-/ui/components/button";

import { Download } from "lucide-react";

export function PerformanceTable() {
	const officials: {
		initials: string;
		name: string;
		division: string;
		active: number;
		closed: number;
		days: number;
		status: string;
		statusVariant:
			| "default"
			| "secondary"
			| "error"
			| "tag"
			| "optimal"
			| "outline";
		avatarColor: string;
		bgClass?: string;
	}[] = [
		{
			initials: "HJ",
			name: "Hon. Elena Jacobs",
			division: "División Civil",
			active: 142,
			closed: 89,
			days: 31,
			status: "Óptimo",
			statusVariant: "default",
			avatarColor: "bg-primary-fixed text-on-primary-fixed",
		},
		{
			initials: "MW",
			name: "Hon. Marcus Wright",
			division: "Tribunal Penal",
			active: 98,
			closed: 42,
			days: 58,
			status: "Revisión Pendiente",
			statusVariant: "secondary",
			avatarColor: "bg-secondary-container text-on-secondary-container",
			bgClass: "bg-surface-container-low/30",
		},
		{
			initials: "SC",
			name: "Hon. Sophia Chen",
			division: "Litigio Comercial",
			active: 167,
			closed: 112,
			days: 28,
			status: "Óptimo",
			statusVariant: "default",
			avatarColor: "bg-tertiary-fixed text-on-tertiary-fixed",
		},
		{
			initials: "DM",
			name: "Hon. David Miller",
			division: "Tribunal de Familia",
			active: 205,
			closed: 12,
			days: 84,
			status: "Alerta",
			statusVariant: "error",
			avatarColor: "bg-error-container text-error",
			bgClass: "bg-surface-container-low/30",
		},
	];

	return (
		<div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm md:col-span-4">
			<div className="flex items-center justify-between border-surface-container border-b bg-surface-container-low p-6">
				<h4 className="font-bold font-headline text-primary text-xl">
					Rendimiento de Funcionarios del Caso
				</h4>
				<Button variant="link">
					Exportar Auditoría Detallada
					<Download className="ml-2 h-4 w-4" />
				</Button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-surface-container text-on-surface-variant">
							<th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">
								Funcionario Judicial
							</th>
							<th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-widest">
								Casos Activos
							</th>
							<th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-widest">
								Cerrados (Mes Actual)
							</th>
							<th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-widest">
								Días Promedio
							</th>
							<th className="px-6 py-4 text-right font-bold text-xs uppercase tracking-widest">
								Estado
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-surface-container">
						{officials.map((official, idx) => (
							<tr
								// biome-ignore lint/suspicious/noArrayIndexKey: <>
								key={idx}
								className={`${official.bgClass || ""} transition-colors hover:bg-surface`}
							>
								<td className="px-6 py-4">
									<div className="flex items-center gap-3">
										<div
											className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${official.avatarColor}`}
										>
											{official.initials}
										</div>
										<div>
											<p className="font-bold text-primary">{official.name}</p>
											<p className="text-on-surface-variant text-xs">
												{official.division}
											</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 text-center font-semibold">
									{official.active}
								</td>
								<td className="px-6 py-4 text-center font-semibold">
									{official.closed}
								</td>
								<td className="px-6 py-4 text-center font-semibold">
									{official.days}
								</td>
								<td className="px-6 py-4 text-right">
									<Badge variant={official.statusVariant}>
										{official.status}
									</Badge>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
