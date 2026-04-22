import type { Metadata } from "next";

import { SignInPage } from "@/modules/auth/pages/sign-in";

export const metadata: Metadata = {
  title: "Acceso | Justicia Soberana",
  description: "Sistema de Apoyo Judicial - Juris OS",
};

export default function SignIn() {
  return <SignInPage />;
}
