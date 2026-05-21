import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

import { CitizenDashboardPage } from "@/modules/cases/pages/citizen-dashboard.page";

export const metadata: Metadata = {
	title: "Mis Casos | Ciudadano - Juris OS",
	description: "Portal de seguimiento de demandas ciudadanas",
};

export default async function CitizenDashboard() {
	await guardCitizen();

	return <CitizenDashboardPage />;
}
