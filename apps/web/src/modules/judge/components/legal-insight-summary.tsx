import { BrainCircuit, CheckCircle2, FileText, Gavel } from "lucide-react";

export function LegalInsightSummary() {
	return (
		<div className="group relative col-span-1 overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_40px_40px_0_rgba(25,28,30,0.04)] md:col-span-2">
			<div className="absolute top-0 right-0 p-2 opacity-10 transition-opacity group-hover:opacity-20">
				<Gavel className="size-16" />
			</div>

			<div className="mb-4 flex items-center gap-2">
				<div className="flex size-8 items-center justify-center rounded-full bg-primary-fixed">
					<BrainCircuit className="size-4 text-primary" />
				</div>
				<h4 className="font-bold font-headline text-primary text-sm">
					Resumen Legal y Hallazgos de la IA
				</h4>
			</div>

			<div className="space-y-3">
				<p className="font-body text-on-surface-variant text-xs leading-relaxed">
					El demandante alega despido injustificado el 12 de septiembre. El
					análisis de IA detectó una discrepancia en el Anexo B del Documento
					(Contrato de Empleo), específicamente en la Cláusula 14 respecto a los
					períodos de notificación.
				</p>

				<div className="rounded-lg border-primary border-l-4 bg-surface-container-high p-3">
					<p className="mb-1 font-semibold text-[11px] text-primary">
						Hallazgo Clave:
					</p>
					<p className="text-[11px] text-on-surface-variant italic leading-normal">
						"...la terminación será efectiva 30 días después de la notificación,
						sin embargo, los registros digitales sugieren que el acceso interno
						fue revocado 2 horas después de la notificación verbal."
					</p>
				</div>

				<div className="flex gap-4 pt-2">
					<span className="flex items-center gap-1 font-bold text-[10px] text-on-tertiary-fixed-variant">
						<CheckCircle2 className="size-3" /> 94% de Confianza de Búsqueda
					</span>
					<span className="flex items-center gap-1 font-bold text-[10px] text-on-tertiary-fixed-variant">
						<FileText className="size-3" /> Relacionado con la Página 14
					</span>
				</div>
			</div>
		</div>
	);
}
