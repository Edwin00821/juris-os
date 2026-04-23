import type { Metadata } from "next";
import { JudgeDashboardPage } from "@/modules/judge/pages/judge-dashboard-page";

export const metadata: Metadata = {
	title: "Panel de Control | Justicia Soberana",
	description:
		"Resumen general de actividades, audiencias y carga de trabajo judicial.",
};

export default function JudgeDashboard() {
	return <JudgeDashboardPage />;
}
