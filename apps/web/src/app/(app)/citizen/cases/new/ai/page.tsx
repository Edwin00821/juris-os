import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Demanda con Asistente IA | Juris OS",
};

export default async function AILawsuit() {
	await guardCitizen();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Asistente de Demanda con IA</h1>
			<p className="mt-2 text-muted-foreground">
				Describe tu situación en lenguaje natural para que el copiloto genere el
				borrador judicial.
			</p>
		</div>
	);
}
