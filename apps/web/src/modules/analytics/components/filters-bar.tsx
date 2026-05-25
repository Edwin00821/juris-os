"use client";

import { Calendar } from "lucide-react";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import type { CategoryFilter } from "../hooks/use-dashboard-analytics";

const SPECIALTY_OPTIONS: { value: CategoryFilter; label: string }[] = [
	{ value: "all", label: "Todas las Especialidades" },
	{ value: "criminal", label: "Justicia Penal" },
	{ value: "family", label: "Tribunal de Familia" },
	{ value: "labor", label: "Derecho Laboral" },
];

export const analyticsFiltersParsers = {
	specialty: parseAsStringLiteral([
		"all",
		"criminal",
		"family",
		"labor",
	] as const).withDefault("all"),
	date: parseAsString.withDefault(""),
};

export function FiltersBar() {
	const [{ specialty, date }, setFilters] = useQueryStates(
		analyticsFiltersParsers,
	);

	const [localSpecialty, setLocalSpecialty] =
		useState<CategoryFilter>(specialty);
	const [localDate, setLocalDate] = useState(date);

	useEffect(() => {
		setLocalSpecialty(specialty);
		setLocalDate(date);
	}, [specialty, date]);

	return (
		<div className="col-span-4 flex flex-wrap items-end gap-6 rounded-xl border-[#002045] border-b-2 bg-white p-5 shadow-sm">
			<div className="min-w-[200px] flex-1">
				<label
					htmlFor="specialty-filter"
					className="mb-2 block font-bold text-slate-500 text-xs uppercase tracking-widest"
				>
					Especialidad del Juez
				</label>
				<select
					id="specialty-filter"
					value={localSpecialty}
					onChange={(e) => setLocalSpecialty(e.target.value as CategoryFilter)}
					className="w-full rounded-lg border-none bg-slate-50 px-3 py-2.5 font-medium text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#002045]"
				>
					{SPECIALTY_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="min-w-[200px] flex-1">
				<label
					htmlFor="date-filter"
					className="mb-2 block font-bold text-slate-500 text-xs uppercase tracking-widest"
				>
					Período de Reporte
				</label>
				<div className="flex items-center rounded-lg bg-slate-50 px-3">
					<Calendar className="size-4 shrink-0 text-slate-400" />
					<input
						id="date-filter"
						type="date"
						value={localDate}
						onChange={(e) => setLocalDate(e.target.value)}
						className="w-full border-none bg-transparent py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-0"
					/>
				</div>
			</div>

			<button
				type="button"
				onClick={() =>
					setFilters({ specialty: localSpecialty, date: localDate })
				}
				className="rounded-lg bg-[#002045] px-8 py-2.5 font-bold text-white shadow-md hover:opacity-90"
			>
				Aplicar Filtros
			</button>
		</div>
	);
}
