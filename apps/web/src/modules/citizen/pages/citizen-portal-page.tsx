"use client";

import { ActiveCasesLedger } from "../components/active-cases-ledger";
import { CitizenSidebar } from "../components/citizen-sidebar";

export function CitizenPortalPage() {
	return (
		<main className="mx-auto flex w-full max-w-[1600px] grow flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
			<CitizenSidebar />

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
					<ActiveCasesLedger />
				</div>
			</div>
		</main>
	);
}
