import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";

import { CaseAssignmentPage } from "@/modules/case-assignment/pages/case-assignment-page";

export const metadata: Metadata = {
	title: "Asignación de Casos | Administrador - Juris OS",
};

export default async function AdminAssignments() {
	await guardAdmin();

	return <CaseAssignmentPage />;
}
