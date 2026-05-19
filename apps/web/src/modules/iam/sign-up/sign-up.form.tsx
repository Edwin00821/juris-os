"use client";

import { Field } from "@juris-os/ui/components/field";
import { Mail, User } from "lucide-react";

import { AuthErrorAlert } from "../components/auth-error-alert";

import { useSignUp } from "./use-sign-up.hook";

export function SignUpForm() {
	const { form, error } = useSignUp();

	return (
		<form.AppForm>
			<form
				action="#"
				method="POST"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
				className="space-y-6"
			>
				<AuthErrorAlert message={error ?? undefined} />

				<form.AppField name="name">
					{(field) => (
						<field.InputGroup
							label="Nombre Completo"
							type="text"
							autoComplete="name"
							placeholder="Ej. Juan Pérez"
							startAdornment={<User className="size-5" />}
						/>
					)}
				</form.AppField>

				<form.AppField name="email">
					{(field) => (
						<field.InputGroup
							label="Correo Electrónico"
							type="email"
							autoComplete="email"
							placeholder="usuario@correo.com"
							startAdornment={<Mail className="size-5" />}
						/>
					)}
				</form.AppField>

				<form.AppField name="password">
					{(field) => (
						<field.Password
							label="Contraseña Segura"
							autoComplete="new-password"
							placeholder="••••••••••••"
						/>
					)}
				</form.AppField>

				<Field className="pt-4">
					<form.SubscribeButton className="w-full" size="lg">
						CREAR CUENTA
					</form.SubscribeButton>
				</Field>
			</form>
		</form.AppForm>
	);
}
