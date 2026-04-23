"use client";

import { AIInsightWidget } from "@/modules/admin/components/analytics/ai-insight-widget";
import { AnalyticsFilters } from "@/modules/admin/components/analytics/analytics-filters";
import { ChartsSection } from "@/modules/admin/components/analytics/charts-section";
import { MetricCards } from "@/modules/admin/components/analytics/metric-cards";
import { PerformanceTable } from "@/modules/admin/components/analytics/performance-table";

export default function AnalyticsDashboardPage() {
	return (
		<>
			<main className="flex-1 bg-surface p-4 md:p-8">
				<div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
					<div>
						<h1 className="font-extrabold font-headline text-3xl text-primary tracking-tight">
							Libro Mayor de Analíticas Judiciales
						</h1>
						<p className="mt-1 font-medium text-on-surface-variant">
							Visión general del rendimiento institucional y visualización de
							métricas.
						</p>
					</div>
					<div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-1.5">
						<button
							type="button"
							className="rounded-lg border border-slate-100 bg-white px-4 py-2 font-bold text-primary text-sm shadow-sm transition-colors"
						>
							Últimos 30 Días
						</button>
						<button
							type="button"
							className="rounded-lg px-4 py-2 font-medium text-on-surface-variant text-sm transition-colors hover:bg-white/50"
						>
							Trimestral
						</button>
						<button
							type="button"
							className="rounded-lg px-4 py-2 font-medium text-on-surface-variant text-sm transition-colors hover:bg-white/50"
						>
							Anual
						</button>
					</div>
				</div>

				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
					<div className="md:col-span-4">
						<AnalyticsFilters />
					</div>
					<MetricCards />
					<ChartsSection />
					<PerformanceTable />
				</div>
			</main>

			<AIInsightWidget />
		</>
	);
}
