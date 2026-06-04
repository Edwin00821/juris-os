import { ApiError, GoogleGenAI } from "@google/genai";
import { env } from "@juris-os/env/api-gateway";
import { HTTPException } from "hono/http-exception";
import { eventBus } from "../../../../core/events/event-bus";
import type {
	AiGenerationCompletedEvent,
	AiGenerationStartedEvent,
} from "../../../../core/events/event-types";

const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Eres un asistente judicial experto en derecho. Ayudas a jueces a analizar expedientes de casos legales.
Tu rol es:
- Analizar documentos del expediente y responder preguntas concretas
- Identificar hechos relevantes, partes involucradas, fechas clave y evidencias
- Sugerir precedentes legales aplicables cuando corresponda
- Ser conciso, preciso y objetivo

Siempre cita los documentos específicos que sustentan tu respuesta.`;

export type CopilotResponse = {
	answer: string;
	refs: string[];
};

export async function askCopilot({
	caseNumber,
	question,
	documents,
}: {
	caseNumber: string;
	question: string;
	documents: { fileName: string; markdownContent: string | null }[];
}): Promise<CopilotResponse> {
	await eventBus.emit<AiGenerationStartedEvent>({
		id: crypto.randomUUID(),
		type: "AiGenerationStarted",
		occurredAt: new Date(),
		payload: { caseId: caseNumber, prompt: question },
	});

	const docsWithContent = documents.filter((d) => d.markdownContent);

	const documentContext =
		docsWithContent.length > 0
			? docsWithContent
					.map((d) => `### ${d.fileName}\n\n${d.markdownContent}`)
					.join("\n\n---\n\n")
			: "No hay documentos con contenido extraído disponibles.";

	const userMessage = `Expediente: ${caseNumber}

## Documentos del expediente

${documentContext}

## Pregunta del juez

${question}`;

	try {
		const response = await client.models.generateContent({
			model: "gemini-2.5-flash",
			config: { systemInstruction: SYSTEM_PROMPT },
			contents: userMessage,
		});

		const answer = response.text ?? "";

		const refs = docsWithContent
			.filter((d) => answer.includes(d.fileName))
			.map((d) => d.fileName);

		await eventBus.emit<AiGenerationCompletedEvent>({
			id: crypto.randomUUID(),
			type: "AiGenerationCompleted",
			occurredAt: new Date(),
			payload: { caseId: caseNumber, documentId: "", storageKey: "" },
		});

		return { answer, refs };
	} catch (err) {
		if (err instanceof ApiError) {
			if (err.status === 429) {
				throw new HTTPException(503, {
					message:
						"El servicio de IA no está disponible en este momento (límite de cuota alcanzado). Intente más tarde.",
					cause: err,
				});
			}
			if (err.status === 404) {
				throw new HTTPException(503, {
					message: "El modelo de IA configurado no está disponible.",
					cause: err,
				});
			}
		}
		throw err;
	}
}
