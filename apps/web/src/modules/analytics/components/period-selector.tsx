"use client";

import { cn } from "@juris-os/ui/lib/utils";
import type { PeriodFilter } from "../hooks/use-dashboard-analytics";

const OPTIONS: { value: PeriodFilter; label: string }[] = [
	{ value: "30d", label: "Últimos 30 Días" },
	{ value: "quarterly", label: "Trimestral" },
	{ value: "annual", label: "Anual" },
];

interface PeriodSelectorProps {
	value: PeriodFilter;
	onChange: (value: PeriodFilter) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
	return (
		<div className="flex items-center gap-0.5 rounded-xl bg-slate-100 p-1.5">
			{OPTIONS.map((opt) => (
				<button
					type="button"
					key={opt.value}
					onClick={() => onChange(opt.value)}
					className={cn(
						"rounded-lg px-4 py-2 font-medium text-sm transition-all",
						value === opt.value
							? "border border-slate-100 bg-white font-bold text-[#002045] shadow-sm"
							: "text-slate-500 hover:bg-white/50",
					)}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
