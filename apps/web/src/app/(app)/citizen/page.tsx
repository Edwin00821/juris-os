import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

export const metadata: Metadata = {
	title: "Mis Casos | Ciudadano - Juris OS",
	description: "Portal de seguimiento de demandas ciudadanas",
};

export default async function CitizenDashboard() {
	await guardCitizen();

	return (
		<div className="p-8">
			<h1 className="font-bold text-2xl">Mis Casos</h1>
			<p className="mt-2 text-muted-foreground">
				Portal de seguimiento de demandas ciudadanas.
			</p>
		</div>
	);
}
