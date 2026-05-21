import { useQuery } from "@tanstack/react-query";

export type UpdateType = "HEARING" | "SIGNATURE" | "SYSTEM";

export interface LiveUpdate {
	id: string;
	type: UpdateType;
	title: string;
	description: string;
	timestamp: string;
}

async function fetchLiveUpdates(): Promise<LiveUpdate[]> {
	await new Promise((resolve) => setTimeout(resolve, 1200));

	return [
		{
			id: "upd-1",
			type: "HEARING",
			title: "Audiencia Programada",
			description: "Caso #2024-DR-082 actualizado por el Secretario.",
			timestamp: "Hace 14 min",
		},
		{
			id: "upd-2",
			type: "SIGNATURE",
			title: "Firma Requerida",
			description: "El borrador del Generador de Demandas necesita aprobación.",
			timestamp: "Hace 2 horas",
		},
	];
}

export function useLiveUpdates() {
	return useQuery({
		queryKey: ["live-updates"],
		queryFn: fetchLiveUpdates,

		refetchInterval: 60000,
	});
}
