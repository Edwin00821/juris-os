import type { Metadata } from "next";
import { JudgeCaseReviewPage } from "@/modules/judge/pages/judge-case-review-page";

export const metadata: Metadata = {
	title: "Revisión de Expediente | Justicia Soberana",
	description: "Análisis detallado y revisión de documentos del caso legal.",
};

export default function CaseReview({ params }: { params: { id: string } }) {
	const _id = params.id;

	return <JudgeCaseReviewPage />;
}
