"use client";

import { Plus } from "lucide-react";

export function DashboardHeader() {
	return (
		<section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div>
				<h1 className="font-extrabold font-headline text-3xl text-primary tracking-tight">
					Libro Mayor de Supervisión Judicial
				</h1>
				<p className="mt-1 text-on-surface-variant">
					Gestione el acceso institucional y la distribución de casos de alta
					prioridad.
				</p>
			</div>
			<div className="flex gap-3">
				<button
					type="button"
					className="rounded-lg bg-surface-container-high px-4 py-2 font-bold text-on-surface-variant text-sm transition-colors hover:bg-surface-dim"
				>
					Exportar Libro Mayor
				</button>
				<button
					type="button"
					className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground text-sm shadow-sm transition-opacity hover:opacity-90"
				>
					<Plus className="size-4" />
					Invitar Usuario
				</button>
			</div>
		</section>
	);
}
