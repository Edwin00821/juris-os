import type { Metadata } from "next";
import { CitizenPortalPage } from "@/modules/citizen/pages/citizen-portal-page";

export const metadata: Metadata = {
	title: "Portal Ciudadano | Justicia Soberana",
	description: "Acceso ciudadano a servicios y trámites judiciales.",
};

export default function CitizenPortal() {
	return <CitizenPortalPage />;
}
