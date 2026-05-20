import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Casos Terminados | Juez - Juris OS",
};

export default async function JudgeResolvedCases() {
	await guardJudge();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Casos Terminados</h1>
			<p className="mt-2 text-muted-foreground">
				Historial de resoluciones emitidas.
			</p>
		</div>
	);
}
