import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

import { AILawsuitPage } from "@/modules/ai-copilot/pages/ai-lawsuit.page";

export const metadata: Metadata = {
	title: "Demanda con Asistente IA | Juris OS",
};

export default async function AILawsuit() {
	await guardCitizen();

	return <AILawsuitPage />;
}
