import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Directorio de Jueces | Administrador - Juris OS",
};

export default async function AdminDirectory() {
	await guardAdmin();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Directorio de Jueces</h1>
			<p className="mt-2 text-muted-foreground">
				Gestión de cuentas y perfiles de jueces.
			</p>
		</div>
	);
}
