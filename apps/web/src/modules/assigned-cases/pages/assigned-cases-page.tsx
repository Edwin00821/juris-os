import { ClipboardCheck } from "lucide-react";

import { AssignedCasesHeader } from "../components/assigned-cases-header";
import { AssignedCasesSearch } from "../components/assigned-cases-search";
import { AssignedCasesTable } from "../components/assigned-cases-table";

export function AssignedCasesPage() {
	return (
		<main className="min-h-screen flex-1 bg-surface p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<AssignedCasesHeader />

				<section className="overflow-hidden rounded-xl bg-surface-container-lowest p-1 shadow-sm">
					<div className="flex flex-col items-start justify-between gap-4 bg-surface-container-low px-6 py-4 sm:flex-row sm:items-center">
						<h2 className="flex items-center gap-2 font-bold text-lg text-primary">
							<ClipboardCheck className="h-5 w-5" />
							Registro de Asignaciones
						</h2>
						<AssignedCasesSearch />
					</div>

					<AssignedCasesTable />
				</section>
			</div>
		</main>
	);
}
