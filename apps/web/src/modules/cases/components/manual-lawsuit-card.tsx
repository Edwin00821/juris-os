import { Edit3, FileEdit, FileText, Settings2, Upload } from "lucide-react";
import Link from "next/link";

export function ManualLawsuitCard() {
	return (
		<Link
			href="/citizen/cases/new/manual"
			className="card-hover group relative flex min-h-105 flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-8 no-underline transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-surface-container-highest/50 hover:shadow-xl"
		>
			<div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-primary-fixed/30 transition-transform duration-500 group-hover:scale-125" />
			<div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-secondary-container/30 transition-transform duration-500 group-hover:scale-110" />

			<div className="relative z-10 mb-5">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
					<FileEdit className="size-3" /> Modo Clásico
				</span>
			</div>

			<div className="relative z-10 mb-4 flex items-center gap-3">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed">
					<FileText className="size-6 text-primary" />
				</div>
				<h2 className="font-bold font-headline text-primary text-xl">
					Generar Demanda Manualmente
				</h2>
			</div>

			<p className="relative z-10 mb-6 grow text-on-surface-variant text-sm leading-relaxed">
				Redacte su demanda de forma directa utilizando formularios
				estructurados. Ideal si ya cuenta con la documentación y los datos
				preparados para su presentación.
			</p>

			<div className="relative z-10 mb-6 space-y-3 rounded-lg bg-surface-container p-4">
				<div className="flex flex-col gap-1">
					<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
						Título del Caso
					</span>
					<div className="h-8 w-full rounded-md bg-surface-container-highest" />
				</div>
				<div className="flex flex-col gap-1">
					<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
						Descripción de los Hechos
					</span>
					<div className="h-14 w-full rounded-md bg-surface-container-highest" />
				</div>
				<div className="flex gap-2">
					<div className="flex flex-1 flex-col gap-1">
						<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
							Categoría
						</span>
						<div className="h-8 w-full rounded-md bg-surface-container-highest" />
					</div>
					<div className="flex flex-1 flex-col gap-1">
						<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
							Fecha
						</span>
						<div className="h-8 w-full rounded-md bg-surface-container-highest" />
					</div>
				</div>
			</div>

			<div className="relative z-10 mb-6 flex flex-wrap gap-3 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
				<span className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1">
					<Settings2 className="size-3" /> Control Total
				</span>
				<span className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1">
					<Upload className="size-3" /> Adjuntar Docs
				</span>
				<span className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1">
					<Edit3 className="size-3" /> Edición Libre
				</span>
			</div>

			<div className="relative z-10 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-sm text-white transition-colors group-hover:bg-primary/90">
				<FileEdit className="size-4" /> Comenzar Registro Manual
			</div>
		</Link>
	);
}
