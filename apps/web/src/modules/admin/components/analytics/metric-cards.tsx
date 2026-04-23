"use client";

import { CheckCircle2, History, TrendingDown, TrendingUp } from "lucide-react";

export function MetricCards() {
	return (
		<>
			<div className="rounded-xl border-primary border-l-4 bg-surface-container-lowest p-6 md:col-span-1">
				<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Demandas Totales
				</p>
				<h3 className="font-extrabold text-4xl text-primary tracking-tighter">
					1,429
				</h3>
				<p className="mt-2 flex items-center gap-1 font-medium text-emerald-600 text-sm">
					<TrendingUp className="h-4 w-4" />
					12% vs mes anterior
				</p>
			</div>

			<div className="rounded-xl border-secondary border-l-4 bg-surface-container-lowest p-6 md:col-span-1">
				<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Resolución Promedio
				</p>
				<h3 className="font-extrabold text-4xl text-tertiary tracking-tighter">
					42d
				</h3>
				<p className="mt-2 flex items-center gap-1 font-medium text-amber-600 text-sm">
					<TrendingDown className="h-4 w-4" />
					Retraso de 4 días
				</p>
			</div>

			<div className="rounded-xl border-primary-fixed-dim border-l-4 bg-surface-container-lowest p-6 md:col-span-1">
				<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Tasa de Admisión
				</p>
				<h3 className="font-extrabold text-4xl text-primary tracking-tighter">
					74.2%
				</h3>
				<p className="mt-2 flex items-center gap-1 font-medium text-emerald-600 text-sm">
					<CheckCircle2 className="h-4 w-4" />
					Umbral óptimo
				</p>
			</div>

			<div className="rounded-xl border-error border-l-4 bg-surface-container-lowest p-6 md:col-span-1">
				<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Revisión Pendiente
				</p>
				<h3 className="font-extrabold text-4xl text-on-error-container tracking-tighter">
					204
				</h3>
				<p className="mt-2 flex items-center gap-1 font-medium text-on-surface-variant text-sm">
					<History className="h-4 w-4" />
					Cola de alta prioridad
				</p>
			</div>
		</>
	);
}
