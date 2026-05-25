import { ClipboardList, Users } from "lucide-react";
import { CitizensSearchInput } from "../components/citizens-search-input";
import { CitizensTable } from "../components/citizens-table";
import { JudgesDirectoryTable } from "../components/judges-directory-table";
import { JudgesHeader } from "../components/judges-header";

export function JudgesManagementPage() {
	return (
		<main className="min-h-screen flex-1 bg-surface p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<JudgesHeader />

				<section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
					<div className="flex items-center gap-2 bg-surface-container-low px-6 py-4">
						<Users className="h-5 w-5 text-primary" />
						<h2 className="font-bold text-lg text-primary">Jueces Activos</h2>
					</div>
					<JudgesDirectoryTable />
				</section>

				<section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
					<div className="flex items-center justify-between bg-surface-container-low px-6 py-4">
						<div className="flex items-center gap-2">
							<ClipboardList className="h-5 w-5 text-primary" />
							<h2 className="font-bold text-lg text-primary">
								Registro de Ciudadanos
							</h2>
						</div>
						<CitizensSearchInput />
					</div>
					<CitizensTable />
				</section>
			</div>
		</main>
	);
}
