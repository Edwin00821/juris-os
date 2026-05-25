"use client";

import { CheckCircle, History, TrendingDown, TrendingUp } from "lucide-react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { AiInsightFab } from "../components/ai-insight-fab";
import { analyticsFiltersParsers, FiltersBar } from "../components/filters-bar";
import { JudgesTable } from "../components/judges-table";
import { KpiCard } from "../components/kpi-card";
import { OutcomeMixChart } from "../components/outcome-mix-chart";
import { PeriodSelector } from "../components/period-selector";
import { VolumeChart } from "../components/volume-chart";
import type {
	CategoryFilter,
	DashboardData,
	KpiData,
} from "../hooks/use-dashboard-analytics";
import { useDashboardAnalytics } from "../hooks/use-dashboard-analytics";

function buildKpis(raw: DashboardData["kpis"]): KpiData[] {
	const trendPct = raw.totalCasesTrendPct;
	const trendPositive = trendPct >= 0;

	return [
		{
			label: "Demandas Totales",
			value: raw.totalCases.toLocaleString("es"),
			trend: {
				Icon: trendPositive ? TrendingUp : TrendingDown,
				text: `${trendPositive ? "+" : ""}${trendPct}% vs período anterior`,
				color: trendPositive ? "text-emerald-600" : "text-red-600",
			},
			accentColor: "primary",
		},
		{
			label: "Resolución Promedio",
			value: `${raw.avgResolutionDays}d`,
			trend: {
				Icon: TrendingDown,
				text: `${raw.avgResolutionDays} días promedio de cierre`,
				color: "text-amber-600",
			},
			accentColor: "secondary",
		},
		{
			label: "Tasa de Admisión",
			value: `${raw.admissionRate}%`,
			trend: {
				Icon: CheckCircle,
				text:
					raw.admissionRate >= 70 ? "Umbral óptimo" : "Por debajo del umbral",
				color: raw.admissionRate >= 70 ? "text-emerald-600" : "text-amber-600",
			},
			accentColor: "warning",
		},
		{
			label: "Revisión Pendiente",
			value: String(raw.pendingAssignment),
			trend: {
				Icon: History,
				text: "Cola de alta prioridad",
				color: "text-slate-500",
			},
			accentColor: "danger",
		},
	];
}

const periodParser = parseAsStringLiteral([
	"30d",
	"quarterly",
	"annual",
] as const).withDefault("30d");

export function AdminDashboardPage() {
	const [period, setPeriod] = useQueryState("period", periodParser);
	const [specialty] = useQueryState(
		"specialty",
		analyticsFiltersParsers.specialty,
	);
	const [date] = useQueryState("date", analyticsFiltersParsers.date);

	const { data, isLoading, isError } = useDashboardAnalytics(
		period,
		specialty as CategoryFilter,
		date,
	);

	const kpis = data ? buildKpis(data.kpis) : [];

	return (
		<>
			<div className="mx-auto max-w-7xl p-8">
				<div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
					<div>
						<h1 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-[#002045] tracking-tight">
							Libro Mayor de Analíticas Judiciales
						</h1>
						<p className="mt-1 font-medium text-slate-500">
							Visión general del rendimiento institucional y visualización de
							métricas.
						</p>
					</div>
					<PeriodSelector value={period} onChange={setPeriod} />
				</div>

				{isError && (
					<div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 text-sm">
						No se pudo cargar el panel. Intente de nuevo más tarde.
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
					<FiltersBar />

					{isLoading
						? Array.from({ length: 4 }).map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
									key={i}
									className="h-32 animate-pulse rounded-xl border-l-4 border-l-slate-200 bg-white shadow-sm"
								/>
							))
						: kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}

					{isLoading ? (
						<div className="col-span-3 h-64 animate-pulse rounded-xl bg-white shadow-sm" />
					) : (
						<VolumeChart data={data?.monthlyVolume ?? []} />
					)}

					{isLoading ? (
						<div className="col-span-1 h-64 animate-pulse rounded-xl bg-white shadow-sm" />
					) : (
						<OutcomeMixChart data={data?.statusDistribution ?? []} />
					)}

					{isLoading ? (
						<div className="col-span-4 h-48 animate-pulse rounded-xl bg-white shadow-sm" />
					) : (
						<JudgesTable
							judges={data?.judgesPerformance ?? []}
							period={period}
						/>
					)}
				</div>
			</div>

			<AiInsightFab message="Los tiempos de resolución en el Tribunal de Familia han aumentado un 15% esta semana. ¿Desea un informe detallado?" />
		</>
	);
}
