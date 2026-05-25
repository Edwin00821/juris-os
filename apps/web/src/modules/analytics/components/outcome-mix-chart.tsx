"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@juris-os/ui/components/chart";
import { Cell, Pie, PieChart } from "recharts";
import type { StatusDistribution } from "../hooks/use-dashboard-analytics";

const STATUS_META: Record<string, { label: string; color: string }> = {
	OPEN: { label: "Abiertos", color: "#002045" },
	UNDER_REVIEW: { label: "En Revisión", color: "#adc7f7" },
	PENDING_RESOLUTION: { label: "Pendiente Resolución", color: "#515f74" },
	CLOSED: { label: "Cerrados", color: "#4a7c3f" },
	DRAFT: { label: "Borrador", color: "#cbd5e1" },
	ERROR: { label: "Error", color: "#ba1a1a" },
};

const chartConfig: ChartConfig = Object.fromEntries(
	Object.entries(STATUS_META).map(([key, { label, color }]) => [
		key,
		{ label, color },
	]),
);

interface OutcomeMixChartProps {
	data: StatusDistribution[];
}

export function OutcomeMixChart({ data }: OutcomeMixChartProps) {
	const chartData = data
		.filter((d) => d.count > 0)
		.map((d) => {
			const meta = STATUS_META[d.status] ?? {
				label: d.status,
				color: "#cbd5e1",
			};
			return {
				status: d.status,
				label: meta.label,
				count: d.count,
				fill: meta.color,
				percentage: d.percentage,
			};
		});

	const total = chartData.reduce((sum, d) => sum + d.count, 0);

	return (
		<div className="col-span-1 rounded-xl bg-white p-8 shadow-sm">
			<h4 className="mb-1 font-[Manrope,sans-serif] font-bold text-[#002045] text-xl">
				Distribución de Estados
			</h4>
			<p className="mb-4 text-slate-500 text-sm">
				Casos por estado en el período.
			</p>

			{total === 0 ? (
				<div className="flex h-48 items-center justify-center text-slate-400 text-sm">
					Sin datos.
				</div>
			) : (
				<>
					<div className="relative">
						<ChartContainer
							config={chartConfig}
							className="aspect-square h-48 w-full"
						>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent nameKey="status" hideLabel />}
								/>
								<Pie
									data={chartData}
									dataKey="count"
									nameKey="status"
									innerRadius={56}
									outerRadius={76}
									strokeWidth={2}
									stroke="white"
									paddingAngle={2}
								>
									{chartData.map((entry) => (
										<Cell key={entry.status} fill={entry.fill} />
									))}
								</Pie>
							</PieChart>
						</ChartContainer>

						<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
							<span className="font-extrabold text-2xl text-[#002045] leading-none">
								{total}
							</span>
							<span className="font-bold text-[10px] text-slate-500 uppercase tracking-wide">
								Total
							</span>
						</div>
					</div>

					<div className="mt-4 flex flex-col gap-2">
						{chartData.map((seg) => (
							<div
								key={seg.status}
								className="flex items-center justify-between text-sm"
							>
								<div className="flex items-center gap-2">
									<span
										className="h-2.5 w-2.5 shrink-0 rounded-full"
										style={{ backgroundColor: seg.fill }}
									/>
									<span className="font-medium text-slate-700">
										{seg.label}
									</span>
								</div>
								<span className="font-bold text-slate-800 tabular-nums">
									{seg.percentage}%
								</span>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
