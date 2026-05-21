import type { Metadata } from "next";
import { guardCitizen } from "@/lib/auth-guard";

import { NewCaseSelectorPage } from "@/modules/cases/pages/new-case-selector.page";

export const metadata: Metadata = {
	title: "Registrar Nuevo Caso | Juris OS",
	description: "Selecciona el método de registro para tu demanda",
};

export default async function NewCaseSelector() {
	await guardCitizen();

	return <NewCaseSelectorPage />;
}
