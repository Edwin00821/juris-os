import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";

import { JudgesManagementPage } from "@/modules/judges/pages/judges-management-page";

export const metadata: Metadata = {
	title: "Directorio de Jueces | Administrador - Juris OS",
};

export default async function AdminDirectory() {
	await guardAdmin();

	return <JudgesManagementPage />;
}
