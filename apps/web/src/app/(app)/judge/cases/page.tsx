import type { Metadata } from "next";
import { JudgeCaseListPage } from "@/modules/judge/pages/judge-case-list-page";

export const metadata: Metadata = {
	title: "Directorio de Casos | Justicia Soberana",
	description: "Gestión y búsqueda de expedientes judiciales asignados.",
};

export default function Cases() {
	return <JudgeCaseListPage />;
}
