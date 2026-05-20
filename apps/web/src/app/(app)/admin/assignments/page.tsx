import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Asignación de Casos | Administrador - Juris OS",
};

export default async function AdminAssignments() {
	await guardAdmin();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Asignación de Casos</h1>
			<p className="mt-2 text-muted-foreground">
				Distribución de expedientes a los juzgados.
			</p>
		</div>
	);
}
