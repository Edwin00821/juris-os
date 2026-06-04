import { env } from "@juris-os/env/api-gateway";
import { HTTPException } from "hono/http-exception";

// The assignment engine reasons in Spanish category labels, while the rest of
// the platform stores them in English. Translate at this boundary so the
// heuristic can match a judge's specialty against a case's category.
const CATEGORY_TO_SPANISH: Record<string, string> = {
	criminal: "Penal",
	family: "Familiar",
	labor: "Laboral",
};

// No dedicated complexity column exists yet, so we derive it from the case
// priority (the engine expects a 1–5 scale).
const PRIORITY_TO_COMPLEXITY: Record<string, number> = {
	low: 2,
	medium: 3,
	high: 5,
};

const MAX_CASES_WORKLOAD = 10;

export type JudgeForAssignment = {
	id: string;
	name: string;
	specialty: "criminal" | "family" | "labor" | null;
	activeCases: number;
};

export type CaseForAssignment = {
	caseNumber: string;
	category: string;
	priority: string;
};

export type JudgeSuggestion = {
	judgeId: string;
	name: string;
	score: number;
	justification: string;
	estimatedDays: number;
};

export type SuggestJudgeResult = {
	caseId: string;
	suggestions: JudgeSuggestion[];
};

// Shape returned by the FastAPI engine (POST /api/v1/asignar-juez).
type MotorCandidate = {
	id_juez: string;
	nombre: string;
	score_idoneidad: number;
	justificacion: string;
	tiempo_estimado_dias: number;
};

type MotorResponse = {
	caso_id: string;
	ganador: MotorCandidate;
	alternativas: MotorCandidate[];
};

function toWorkloadPct(activeCases: number): number {
	return Math.min(100, Math.round((activeCases / MAX_CASES_WORKLOAD) * 100));
}

function toSuggestion(candidate: MotorCandidate): JudgeSuggestion {
	return {
		judgeId: candidate.id_juez,
		name: candidate.nombre,
		score: candidate.score_idoneidad,
		justification: candidate.justificacion,
		estimatedDays: candidate.tiempo_estimado_dias,
	};
}

export async function suggestJudge({
	case_,
	judges,
}: {
	case_: CaseForAssignment;
	judges: JudgeForAssignment[];
}): Promise<SuggestJudgeResult> {
	const payload = {
		caso: {
			id_caso: case_.caseNumber,
			categoria_caso: CATEGORY_TO_SPANISH[case_.category] ?? case_.category,
			complejidad: PRIORITY_TO_COMPLEXITY[case_.priority] ?? 3,
		},
		jueces: judges.map((j) => ({
			id: j.id,
			nombre: j.name,
			especialidad: j.specialty ? CATEGORY_TO_SPANISH[j.specialty] : "",
			carga_trabajo_pct: toWorkloadPct(j.activeCases),
		})),
	};

	let response: Response;
	try {
		response = await fetch(`${env.MOTOR_IA_URL}/api/v1/asignar-juez`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (err) {
		throw new HTTPException(503, {
			message:
				"El motor de asignación con IA no está disponible en este momento. Verifique que el servicio esté en ejecución.",
			cause: err,
		});
	}

	// The engine returns 404 when every judge is over its workload threshold.
	if (response.status === 404) {
		throw new HTTPException(404, {
			message:
				"No se encontraron jueces disponibles con carga de trabajo aceptable para este caso.",
		});
	}

	if (!response.ok) {
		throw new HTTPException(502, {
			message: "El motor de asignación con IA devolvió un error inesperado.",
		});
	}

	const data = (await response.json()) as MotorResponse;

	return {
		caseId: data.caso_id,
		suggestions: [data.ganador, ...data.alternativas].map(toSuggestion),
	};
}
