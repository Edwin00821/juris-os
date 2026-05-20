import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Casos Pendientes | Juez - Juris OS",
	description: "Bandeja de expedientes por revisar",
};

export default async function JudgeDashboard() {
	await guardJudge();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Casos Pendientes</h1>
			<p className="mt-2 text-muted-foreground">
				Bandeja de expedientes asignados por revisar.
			</p>
		</div>
	);
}
