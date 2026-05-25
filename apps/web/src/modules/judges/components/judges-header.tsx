import { Download, Plus } from "lucide-react";

export function JudgesHeader() {
	return (
		<section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<h1 className="font-extrabold font-headline text-3xl text-primary tracking-tight">
					Gestión de Jueces
				</h1>
				<p className="mt-2">
					Administre el registro de usuarios y gestione la elevación de
					ciudadanos a jueces del sistema.
				</p>
			</div>

			<div className="flex flex-wrap gap-3">
				<button
					type="button"
					className="flex items-center gap-2 rounded-lg bg-surface-container-high px-4 py-2 font-bold text-on-surface-variant text-sm transition-colors hover:bg-surface-dim"
				>
					Exportar Libro Mayor
					<Download className="h-4 w-4" />
				</button>

				<button
					type="button"
					className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-sm text-white shadow-sm transition-opacity hover:opacity-90"
				>
					<Plus className="h-4 w-4" />
					Invitar Usuario
				</button>
			</div>
		</section>
	);
}
