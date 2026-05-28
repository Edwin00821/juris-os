import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";
import PendingCasesPage from "@/modules/assigned-cases/pages/pending-cases-page";

export const metadata: Metadata = {
	title: "Casos Pendientes | Juez - Juris OS",
	description: "Bandeja de expedientes por revisar",
};

export default async function JudgeDashboard() {
	await guardJudge();

	return <PendingCasesPage />;
}
