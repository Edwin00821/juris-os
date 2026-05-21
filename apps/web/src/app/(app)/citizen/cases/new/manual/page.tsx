import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";
import { ManualLawsuitPage } from "@/modules/cases/pages/manual-lawsuit.page";

export const metadata: Metadata = {
	title: "Demanda Manual | Juris OS",
};

export default async function ManualLawsuit() {
	await guardCitizen();

	return <ManualLawsuitPage />;
}
