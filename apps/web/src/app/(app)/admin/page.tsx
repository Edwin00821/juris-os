import type { Metadata } from "next";
import { AdminDashboardPage } from "@/modules/admin/pages/admin-dashboard";

export const metadata: Metadata = {
	title: "Libro Mayor | Justicia Soberana",
	description: "Panel de control administrativo judicial.",
};

export default function AdminDashboard() {
	return <AdminDashboardPage />;
}
