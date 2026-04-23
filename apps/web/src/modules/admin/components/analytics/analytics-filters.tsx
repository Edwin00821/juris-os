"use client";

import { Button } from "@juris-os-/ui/components/button";
import { Calendar } from "lucide-react";

export function AnalyticsFilters() {
	return (
		<div className="flex flex-wrap items-end gap-6 rounded-xl border-primary border-b-2 bg-surface-container-lowest p-5 shadow-sm">
			<div className="min-w-50 flex-1">
				{/** biome-ignore lint/a11y/noLabelWithoutControl: <> */}
				<label className="mb-2 block font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Especialidad del Juez
				</label>
				<select className="w-full rounded-lg border-none bg-surface-container py-2.5 font-medium text-sm outline-none focus:ring-2 focus:ring-primary">
					<option>Todas las Especialidades</option>
					<option>Derecho Civil</option>
					<option>Justicia Penal</option>
					<option>Tribunal de Familia</option>
					<option>Disputas Comerciales</option>
				</select>
			</div>
			<div className="min-w-50 flex-1">
				{/** biome-ignore lint/a11y/noLabelWithoutControl: <> */}
				<label className="mb-2 block font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Período de Reporte
				</label>
				<div className="flex items-center rounded-lg bg-surface-container px-3 focus-within:ring-2 focus-within:ring-primary">
					<Calendar className="h-4 w-4 text-on-surface-variant" />
					<input
						className="w-full border-none bg-transparent py-2.5 text-sm outline-none focus:ring-0"
						type="date"
					/>
				</div>
			</div>
			<div className="min-w-50 flex-1">
				{/** biome-ignore lint/a11y/noLabelWithoutControl: <> */}
				<label className="mb-2 block font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					Sucursal del Distrito
				</label>
				<select className="w-full rounded-lg border-none bg-surface-container py-2.5 font-medium text-sm outline-none focus:ring-2 focus:ring-primary">
					<option>Central Metropolitana</option>
					<option>Circuito Norte</option>
					<option>División Costera</option>
				</select>
			</div>
			<Button>Aplicar Filtros</Button>
		</div>
	);
}
