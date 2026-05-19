import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAppForm } from "@/forms/form-context";
import { authClient } from "@/lib/auth-client";

import { signUpSchema } from "./sign-up.schema";

export function useSignUp() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onChange: signUpSchema,
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			setError(null);

			const { data, error: authError } = await authClient.signUp.email({
				name: value.name,
				email: value.email,
				password: value.password,
			});

			if (authError) {
				switch (authError.code) {
					case "PASSWORD_TOO_SHORT":
						setError(
							"La contraseña es muy corta. Debe tener al menos 8 caracteres.",
						);
						break;

					default:
						setError(
							authError.message ||
								"Ocurrió un error al registrarse. Por favor, verifica tus datos.",
						);
						break;
				}
				return;
			}

			if (data) {
				router.push("/");
				router.refresh();
			}
		},
	});

	return { form, error };
}
