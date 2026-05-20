import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Demanda Manual | Juris OS",
};

export default async function ManualLawsuit() {
	await guardCitizen();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Formulario de Demanda Manual</h1>
			<p className="mt-2 text-muted-foreground">
				Ingresa los datos del caso, hechos y pruebas del expediente de forma
				tradicional.
			</p>
		</div>
	);
}
