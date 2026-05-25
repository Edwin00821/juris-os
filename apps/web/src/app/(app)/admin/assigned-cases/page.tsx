import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";

import { AssignedCasesPage } from "@/modules/assigned-cases/pages/assigned-cases-page";

export const metadata: Metadata = {
	title: "Casos Asignados | Administrador - Juris OS",
};

export default async function AdminAssignedCases() {
	await guardAdmin();

	return <AssignedCasesPage />;
}
