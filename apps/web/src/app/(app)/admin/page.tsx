import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Panel de Control | Administrador - Juris OS",
	description: "Vista general y métricas del sistema judicial",
};

export default async function AdminDashboard() {
	await guardAdmin();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Panel de Control - Administrador</h1>
			<p className="mt-2 text-muted-foreground">
				Métricas y vista general del sistema judicial.
			</p>
		</div>
	);
}
