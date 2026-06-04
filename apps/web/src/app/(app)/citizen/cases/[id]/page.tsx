import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";
import { CaseDetailPage } from "@/modules/cases/pages/case-detail.page";

export const metadata: Metadata = {
	title: "Detalle del Caso | Ciudadano - Juris OS",
	description: "Ver detalles de tu caso",
};

interface CasePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CitizenCaseDetail({ params }: CasePageProps) {
	await guardCitizen();
	const { id } = await params;

	return <CaseDetailPage caseId={id} />;
}
