import type { Metadata } from "next";
import { guardAdmin } from "@/lib/auth-guard";
import { AdminDashboardPage } from "@/modules/analytics/pages/admin-dashboard";

export const metadata: Metadata = {
	title: "Panel de Control | Administrador - Juris OS",
	description: "Vista general y métricas del sistema judicial",
};

export default async function AdminDashboard() {
	await guardAdmin();

	return <AdminDashboardPage />;
}
