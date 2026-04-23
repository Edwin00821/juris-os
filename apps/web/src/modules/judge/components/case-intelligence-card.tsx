"use client";

import { ClipboardCheck, FileText } from "lucide-react";

interface DocumentRef {
	id: string;
	title: string;
}

interface CaseIntelligenceProps {
	dispute: string;
	filingDate: string;
	value: string;
	documents: DocumentRef[];
}

export function CaseIntelligenceCard({
	dispute,
	filingDate,
	value,
	documents,
}: CaseIntelligenceProps) {
	return (
		<section className="rounded-xl border-primary-container border-b-2 bg-surface-container-lowest p-6 shadow-sm">
			<h3 className="mb-4 flex items-center gap-2 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
				<ClipboardCheck className="h-4 w-4" />
				Inteligencia del Caso
			</h3>
			<div className="space-y-4">
				<div>
					<p className="mb-1 font-bold text-[10px] text-outline uppercase">
						Disputa Principal
					</p>
					<p className="text-on-surface text-sm leading-relaxed">{dispute}</p>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="rounded-lg bg-surface-container-low p-3">
						<p className="font-bold text-[10px] text-outline uppercase">
							Fecha de Presentación
						</p>
						<p className="font-semibold text-sm">{filingDate}</p>
					</div>
					<div className="rounded-lg bg-surface-container-low p-3">
						<p className="font-bold text-[10px] text-outline uppercase">
							Valor
						</p>
						<p className="font-semibold text-sm">{value}</p>
					</div>
				</div>
				<div>
					<p className="mb-2 font-bold text-[10px] text-outline uppercase">
						Documentos Clave Referenciados
					</p>
					<ul className="space-y-2 text-xs">
						{documents.map((doc) => (
							<li
								key={doc.id}
								className="flex cursor-pointer items-center gap-2 rounded bg-surface p-2 transition-colors hover:bg-surface-container"
							>
								<FileText className="h-4 w-4 text-primary" />
								<span>{doc.title}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
