import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";
import CaseReviewPage from "@/modules/resolutions/pages/case-review-page";

export const metadata: Metadata = {
	title: "Revisión de Expediente | Juez - Juris OS",
};

interface CasePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function JudgeCaseView({ params }: CasePageProps) {
	await guardJudge();
	const { id } = await params;

	return <CaseReviewPage params={{ id }} />;
}
