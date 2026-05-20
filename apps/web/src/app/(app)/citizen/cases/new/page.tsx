import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Registrar Nuevo Caso | Juris OS",
	description: "Selecciona el método de registro para tu demanda",
};

export default async function NewCaseSelector() {
	await guardCitizen();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Registrar Nuevo Caso</h1>
			<p className="mt-2 text-muted-foreground">
				Selecciona si deseas rellenar el formulario de forma manual o asistida
				por Inteligencia Artificial.
			</p>
		</div>
	);
}
