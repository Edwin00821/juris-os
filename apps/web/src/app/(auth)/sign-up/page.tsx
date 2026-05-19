import type { Metadata } from "next";

import { SignUpPage } from "@/modules/iam/sign-up/sign-up.page";

export const metadata: Metadata = {
	title: "Acceso | Justicia Soberana",
	description: "Sistema de Apoyo Judicial - Juris OS",
};

export default function SignUp() {
	return <SignUpPage />;
}
