import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Revisión de Expediente | Juez - Juris OS",
};

interface CasePageProps {
	params: {
		id: string;
	};
}

export default async function JudgeCaseView({ params }: CasePageProps) {
	await guardJudge();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Expediente: {params.id}</h1>
			<p className="mt-2 text-muted-foreground">
				Vista detallada del caso y documentos adjuntos.
			</p>
		</div>
	);
}
