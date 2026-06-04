import { ApiError, GoogleGenAI } from "@google/genai";
import { env } from "@juris-os/env/api-gateway";
import { HTTPException } from "hono/http-exception";

const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Eres un asistente legal que ayuda a ciudadanos comunes a redactar demandas judiciales.
Tu rol:
- Guiar al usuario paso a paso para recopilar la información necesaria
- Hacer UNA sola pregunta concreta a la vez
- Usar lenguaje sencillo y empático, no términos jurídicos complejos
- Extraer información estructurada de las respuestas del usuario

Flujo de recopilación (en orden):
1. Descripción de los hechos: qué pasó, cuándo, cómo
2. Quién es el demandado (persona física o empresa)
3. Qué pretende obtener del tribunal (rescisión, pago, restitución, etc.)
4. Confirmar y resumir

Categorías válidas del sistema: "criminal" (delitos penales), "family" (derecho de familia: divorcio, custodia, alimentos), "labor" (relaciones laborales: despido, prestaciones).
Si el caso no encaja claramente, usa "labor" como fallback.

IMPORTANTE: Responde SIEMPRE en JSON válido con este formato exacto sin markdown ni texto adicional:
{
  "reply": "Tu respuesta conversacional aquí",
  "caseData": {
    "title": "Título conciso (máx 80 chars) o null si no hay suficiente info",
    "description": "Narración de los hechos en tercera persona o null",
    "category": "criminal|family|labor o null",
    "incidentDate": "YYYY-MM-DD o null",
    "counterpartyName": "Nombre del demandado o null",
    "legalBasis": "Fundamentos legales aplicables o null",
    "claims": "Lo que el demandante solicita al tribunal o null"
  },
  "progress": número entre 0 y 100 que refleja qué tan completa está la información
}`;

export type CaseData = {
	title: string | null;
	description: string | null;
	category: string | null;
	incidentDate: string | null;
	counterpartyName: string | null;
	legalBasis: string | null;
	claims: string | null;
};

export type DraftAssistResponse = {
	reply: string;
	caseData: CaseData;
	progress: number;
};

const EMPTY_CASE_DATA: CaseData = {
	title: null,
	description: null,
	category: null,
	incidentDate: null,
	counterpartyName: null,
	legalBasis: null,
	claims: null,
};

export async function askDraftAssist({
	messages,
	counterparty,
}: {
	messages: { role: "user" | "bot"; text: string }[];
	counterparty?: { name?: string; address?: string; id?: string };
}): Promise<DraftAssistResponse> {
	const conversationHistory = messages
		.map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.text}`)
		.join("\n\n");

	let prompt = `## Historial de conversación\n\n${conversationHistory}`;

	if (counterparty?.name || counterparty?.address) {
		prompt += "\n\n## Datos de contraparte (formulario separado)";
		if (counterparty.name) prompt += `\nNombre: ${counterparty.name}`;
		if (counterparty.address) prompt += `\nDirección: ${counterparty.address}`;
		if (counterparty.id) prompt += `\nID: ${counterparty.id}`;
	}

	prompt +=
		"\n\nResponde al último mensaje del Usuario. Mantén el contexto de toda la conversación.";

	try {
		const response = await client.models.generateContent({
			model: "gemini-2.5-flash",
			config: {
				systemInstruction: SYSTEM_PROMPT,
				responseMimeType: "application/json",
			},
			contents: prompt,
		});

		const text = response.text ?? "{}";

		try {
			const parsed = JSON.parse(text) as DraftAssistResponse;
			return {
				reply:
					typeof parsed.reply === "string"
						? parsed.reply
						: "Lo siento, no pude procesar su respuesta. Por favor intente de nuevo.",
				caseData: {
					...EMPTY_CASE_DATA,
					...(parsed.caseData ?? {}),
				},
				progress:
					typeof parsed.progress === "number"
						? Math.min(100, Math.max(0, Math.round(parsed.progress)))
						: 0,
			};
		} catch {
			return {
				reply: text.length < 500 ? text : "Error al procesar la respuesta.",
				caseData: EMPTY_CASE_DATA,
				progress: 0,
			};
		}
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
