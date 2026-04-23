import type { Metadata } from "next";
import { JudgePendingSignaturesPage } from "@/modules/judge/pages/judge-pending-signatures-page";

export const metadata: Metadata = {
	title: "Firmas Electrónicas | Justicia Soberana",
	description: "Documentos legales pendientes de firma electrónica oficial.",
};

export default function Signatures() {
	return <JudgePendingSignaturesPage />;
}
