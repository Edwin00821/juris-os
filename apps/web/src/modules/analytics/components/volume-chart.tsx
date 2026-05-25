"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@juris-os/ui/components/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { MonthlyVolume } from "../hooks/use-dashboard-analytics";

interface VolumeChartProps {
	data: MonthlyVolume[];
}

const chartConfig = {
	count: {
		label: "Casos",
		color: "#002045",
	},
} satisfies ChartConfig;

export function VolumeChart({ data }: VolumeChartProps) {
	return (
		<div className="col-span-3 flex flex-col rounded-xl bg-white p-8 shadow-sm">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h4 className="font-[Manrope,sans-serif] font-bold text-[#002045] text-xl">
						Volumen de Casos por Mes
					</h4>
					<p className="text-slate-500 text-sm">
						Casos registrados en el año en curso.
					</p>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-3 w-3 rounded-sm bg-[#002045]" />
					<span className="font-bold text-slate-500 text-xs">Casos</span>
				</div>
			</div>

			{data.length === 0 ? (
				<div className="flex flex-1 items-center justify-center text-slate-400 text-sm">
					Sin datos para el período seleccionado.
				</div>
			) : (
				<ChartContainer
					config={chartConfig}
					className="aspect-auto min-h-0 w-full flex-1"
				>
					<BarChart
						data={data}
						margin={{ top: 4, right: 4, bottom: 0, left: -12 }}
						barCategoryGap="30%"
					>
						<CartesianGrid
							vertical={false}
							stroke="#e2e8f0"
							strokeDasharray="4 4"
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 12, fontWeight: 600, fill: "#94a3b8" }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							allowDecimals={false}
							width={32}
							tick={{ fontSize: 12, fontWeight: 600, fill: "#94a3b8" }}
						/>
						<ChartTooltip
							cursor={{ fill: "#f1f5f9", radius: 4 }}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="count"
							fill="var(--color-count)"
							radius={[6, 6, 0, 0]}
							maxBarSize={40}
						/>
					</BarChart>
				</ChartContainer>
			)}
		</div>
	);
}
