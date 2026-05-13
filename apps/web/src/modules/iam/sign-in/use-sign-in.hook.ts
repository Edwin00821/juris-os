import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAppForm } from "@/forms/form-context";
import { authClient } from "@/lib/auth-client";

import { signInSchema } from "./sign-in.schema";

export function useSignIn() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onChange: signInSchema,
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			setError(null);

			console.log({ value });

			const { data, error } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
				rememberMe: value.rememberMe,
			});

			if (error) {
				setError("Credenciales inválidas. Por favor, verifica tus datos.");
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
