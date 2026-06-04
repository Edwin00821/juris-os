import { ApiError, GoogleGenAI } from "@google/genai";
import { env } from "@juris-os/env/api-gateway";
import { HTTPException } from "hono/http-exception";
import type { GenerateDocumentQueryDto } from "../dtos/generate-document-query.dto";

const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Eres un abogado redactor que convierte datos estructurados en un ESCRITO DE DEMANDA judicial formal, listo para presentar ante un tribunal.

Reglas de redacción:
- Redacta en español jurídico formal pero claro, en tercera persona.
- Usa EXCLUSIVAMENTE la información proporcionada. No inventes hechos, montos, fechas ni nombres que no se te hayan dado. Si falta un dato, usa un marcador entre corchetes como [PENDIENTE: dirección del demandante].
- Devuelve ÚNICAMENTE el documento en formato Markdown, sin explicaciones ni comentarios adicionales.

Estructura obligatoria del documento (usa encabezados Markdown ##):

# DEMANDA [CIVIL|LABORAL|FAMILIAR|PENAL según la categoría]

## I. ENCABEZADO
Tribunal competente (genérico si no se indica), identificación de la demanda y su título.

## II. PARTES
- **Parte demandante:** nombre y datos del demandante.
- **Parte demandada:** nombre, dirección e identificación del demandado.

## III. HECHOS
Narración cronológica de los hechos, numerada (PRIMERO, SEGUNDO, ...), redactada a partir de la descripción provista.

## IV. FUNDAMENTOS DE DERECHO
Fundamentos legales aplicables según la categoría y los hechos. Mantente general; no cites artículos específicos salvo que se proporcionen.

## V. PRETENSIONES
Lista numerada de lo que el demandante solicita al tribunal.

## VI. PETITORIO
Fórmula de cierre solicitando al tribunal que admita la demanda y resuelva conforme a las pretensiones.

## VII. LUGAR, FECHA Y FIRMA
Espacio para lugar, fecha y firma del demandante.`;

export async function generateLawsuitDocument({
	caseData,
	counterparty,
	plaintiff,
}: GenerateDocumentQueryDto): Promise<{ document: string }> {
	const lines: string[] = ["## Datos recopilados del caso"];
	lines.push(`- Título: ${caseData.title ?? "(sin definir)"}`);
	lines.push(`- Categoría: ${caseData.category ?? "(sin definir)"}`);
	lines.push(
		`- Fecha del incidente: ${caseData.incidentDate ?? "(sin definir)"}`,
	);
	lines.push(
		`- Hechos (descripción): ${caseData.description ?? "(sin definir)"}`,
	);
	lines.push(
		`- Fundamentos sugeridos: ${caseData.legalBasis ?? "(sin definir)"}`,
	);
	lines.push(`- Pretensiones: ${caseData.claims ?? "(sin definir)"}`);

	lines.push("\n## Parte demandante");
	lines.push(
		`- Nombre: ${plaintiff?.name ?? "[PENDIENTE: nombre del demandante]"}`,
	);
	if (plaintiff?.email) lines.push(`- Correo: ${plaintiff.email}`);

	lines.push("\n## Parte demandada");
	lines.push(
		`- Nombre: ${counterparty?.name ?? caseData.counterpartyName ?? "[PENDIENTE: nombre del demandado]"}`,
	);
	if (counterparty?.address) lines.push(`- Dirección: ${counterparty.address}`);
	if (counterparty?.id) lines.push(`- Identificación: ${counterparty.id}`);

	const prompt = `${lines.join("\n")}\n\nGenera el escrito de demanda completo siguiendo la estructura indicada.`;

	try {
		const response = await client.models.generateContent({
			model: "gemini-2.5-flash",
			config: { systemInstruction: SYSTEM_PROMPT },
			contents: prompt,
		});

		const document = (response.text ?? "").trim();

		if (!document) {
			throw new HTTPException(502, {
				message:
					"El servicio de IA no devolvió un documento. Intente de nuevo.",
			});
		}

		return { document };
	} catch (err) {
		if (err instanceof HTTPException) throw err;
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
