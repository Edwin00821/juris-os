// src/modules/cases/views/citizen-dashboard.view.tsx
"use client";

import { ActiveCasesTable } from "../components/active-cases-table";
import { CitizenProfileCard } from "../components/citizen-profile-card";
import { LiveUpdatesFeed } from "../components/live-updates-feed";

export function CitizenDashboardPage() {
	return (
		<div className="mx-auto flex w-full max-w-400 grow flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
			<aside className="flex w-full flex-col gap-6 md:w-80">
				<CitizenProfileCard />
				<LiveUpdatesFeed />
			</aside>

			<div className="flex grow flex-col gap-8">
				<section>
					<h1 className="mb-2 font-extrabold font-headline text-3xl text-primary tracking-tight">
						Resumen del Libro Mayor de Justicia
					</h1>
					<p className="max-w-2xl text-on-surface-variant">
						Tiene 4 casos activos dentro del Sistema Judicial Soberano. Su
						tiempo de resolución promedio es un 22% más rápido que el trimestre
						pasado.
					</p>
				</section>

				<div className="grid grid-cols-1 gap-6">
					<ActiveCasesTable />
				</div>
			</div>
		</div>
	);
}
