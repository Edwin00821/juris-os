import type { Metadata } from "next";
import { guardJudge } from "@/lib/auth-guard";
import { ClosedCaseViewPage } from "@/modules/resolutions/pages/closed-case-view-page";

export const metadata: Metadata = {
	title: "Sentencia Publicada | Juris OS",
	description:
		"Vista de solo lectura del expediente concluido e integridad criptográfica",
};

interface ResolvedCasePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ResolvedCaseView({
	params,
}: ResolvedCasePageProps) {
	await guardJudge();
	const { id } = await params;

	return <ClosedCaseViewPage params={{ id }} />;
}
