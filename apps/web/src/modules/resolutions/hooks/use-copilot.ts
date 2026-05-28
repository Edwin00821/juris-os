import type { AiResponse, ChatMessage } from "../types";

export const AI_RESPONSES: AiResponse[] = [
	{
		pattern: /prueba|evidencia/i,
		answer:
			"Las pruebas aportadas incluyen: (1) el informe de auditoría ambiental que descarta peligro inmediato, y (2) la adenda contractual que establece la obligación de notificación. Ambas favorecen parcialmente al demandante.",
		refs: ["📄 Anexo A · Hoja 5 · Párr. 2", "📄 Anexo D · Hoja 3 · Párr. 1"],
		docSummary:
			"Las pruebas documentales incluyen la auditoría ambiental (Anexo A) que descarta peligro inmediato, y la adenda contractual (Anexo D) que establece la obligación de notificación previa.",
	},
	{
		pattern: /demandado|junta|ambiental/i,
		answer:
			"La Junta Ambiental argumenta que las citaciones fueron emitidas conforme al Reglamento 22-C, que les faculta a actuar ante cualquier indicio de modificación estructural.",
		refs: ["📄 Contestación de Demanda · Hoja 4 · Párr. 2"],
		docSummary:
			"El Demandado sostiene que la emisión de citaciones fue conforme al Reglamento 22-C, el cual faculta a la Junta para actuar ante indicios de modificación estructural.",
	},
	{
		pattern: /precedente|jurisprudencia|similar/i,
		answer:
			"Existe un precedente relevante: *Harrison v. Stone* (3er Circuito, 2019), donde se estableció que la omisión de notificación constituye violación técnica aunque no genere daño material inmediato.",
		refs: ["📄 Demanda Original · Hoja 12 · Párr. 1"],
		docSummary:
			"Se cita el precedente Harrison v. Stone (3er Circuito, 2019), que establece que la omisión de notificación constituye violación técnica aun sin daño material.",
	},
];

export const AI_FALLBACK: Omit<AiResponse, "pattern"> = {
	answer:
		"He buscado en los documentos del expediente. La información solicitada está relacionada con los argumentos de fondo del caso. Le recomiendo revisar la sección de consideraciones de la Demanda Original para mayor detalle.",
	refs: ["📄 Demanda Original · Hoja 1 · Párr. 1"],
	docSummary:
		"Este punto requiere ponderación de los argumentos de fondo presentados por ambas partes.",
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
	{
		id: "welcome",
		role: "ai",
		text: "He analizado los 4 documentos del expediente <strong>#2024-FJ-882</strong>. Puedo responder preguntas específicas sobre el caso, buscar precedentes y redactar los hallazgos directamente en el documento de resolución. ¿Por dónde empezamos?",
	},
	{
		id: "q1",
		role: "user",
		text: "¿Cuál es la violación técnica que se menciona en la demanda original y qué sección de la ley incumple el demandante?",
	},
	{
		id: "a1",
		role: "ai",
		text: "Según la demanda, Metropolis Development Corp incumplió la <strong>Sección 14.B de la Ley de Expansión Urbana</strong> al no notificar a la Junta Ambiental sobre modificaciones estructurales en el proyecto.",
		refs: [
			"📄 Demanda Original · Hoja 7 · Párr. 3",
			"📄 Anexo A · Hoja 2 · Párr. 1",
		],
		addedToDoc: true,
	},
];
