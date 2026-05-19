"use client";

import { Checkbox } from "@juris-os/ui/components/checkbox";
import { Field, FieldLabel } from "@juris-os/ui/components/field";
import Link from "next/link";

import { AuthErrorAlert } from "../components/auth-error-alert";
import { useSignIn } from "./use-sign-in.hook";

export function SignInForm() {
	const { form, error } = useSignIn();

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

				<form.AppField name="email">
					{(field) => (
						<field.Input
							label="Correo Institucional"
							type="email"
							autoComplete="email"
							placeholder="funcionario.justicia@tribunal.gob"
						/>
					)}
				</form.AppField>

				<form.AppField name="password">
					{(field) => (
						<field.Password
							label="Contraseña Segura"
							autoComplete="current-password"
							placeholder="••••••••••••"
						/>
					)}
				</form.AppField>

				<form.AppField name="rememberMe">
					{(field) => (
						<Field orientation="horizontal" className="items-center gap-2">
							<Checkbox
								id={field.name}
								checked={field.state.value}
								onCheckedChange={(checked) => field.handleChange(!!checked)}
							/>
							<FieldLabel
								htmlFor={field.name}
								className="cursor-pointer font-normal text-muted-foreground text-sm"
							>
								Recuérdame
							</FieldLabel>

							<Link
								href="#forgot-password"
								className="ml-auto font-medium text-primary text-sm underline-offset-4 hover:underline"
							>
								¿Olvidaste tu contraseña?
							</Link>
						</Field>
					)}
				</form.AppField>

				<Field>
					<form.SubscribeButton className="w-full" size="lg">
						ACCEDER AL SISTEMA
					</form.SubscribeButton>
				</Field>
			</form>
		</form.AppForm>
	);
}
