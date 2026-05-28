import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";

import ClosedCasesPage from "@/modules/assigned-cases/pages/closed-cases-page";

export const metadata: Metadata = {
	title: "Casos Terminados | Juez - Juris OS",
};

export default async function JudgeResolvedCases() {
	await guardJudge();

	return <ClosedCasesPage />;
}
