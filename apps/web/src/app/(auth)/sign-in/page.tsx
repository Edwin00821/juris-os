import type { Metadata } from "next";

import { SignInPage } from "@/modules/iam/sign-in/sign-in.page";

export const metadata: Metadata = {
	title: "Acceso | Justicia Soberana",
	description: "Sistema de Apoyo Judicial - Juris OS",
};

export default function SignIn() {
	return <SignInPage />;
}
