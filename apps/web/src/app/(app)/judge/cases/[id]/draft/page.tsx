"use client";

import { use } from "react";
import DraftResolutionPage from "@/modules/judge/pages/draft-resolution-page";

const MOCK_CASE_DATA = {
	id: "2024-FJ-882",
	title: "Metropolis Development Corp vs. Junta Ambiental de la Ciudad",
	dispute:
		"Incumplimiento de la Sección 14.B de la Ley de Expansión Urbana. El demandado alega retraso burocrático.",
	filingDate: "12 Oct, 2023",
	value: "$2.4M USD",
	documents: [
		{ id: "doc-1", title: "Anexo A: Auditoría Ambiental" },
		{ id: "doc-2", title: "Anexo D: Adenda Contractual" },
	],
	copilotSuggestion:
		"Basado en los precedentes del 3er Circuito para disputas de zonificación, podría considerar citar *Harrison v. Stone* respecto a la cláusula de 'Buena Fe'...",
	parties:
		'Metropolis Development Corp ("Demandante") y Junta Ambiental de la Ciudad ("Demandado").',
	preamble:
		"Habiendo revisado la evidencia presentada durante la sesión del 14 de noviembre, el Tribunal determina que las citaciones ambientales fueron emitidas sin causa suficiente de peligro inmediato, sin embargo, el hecho de que el Demandante no notificara a la junta sobre los cambios estructurales sigue siendo una violación técnica.",
};

export default function DraftResolution({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const _resolvedParams = use(params);

	const caseData = MOCK_CASE_DATA;

	return <DraftResolutionPage caseData={caseData} />;
}
