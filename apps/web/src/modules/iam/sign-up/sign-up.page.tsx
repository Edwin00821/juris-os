"use client";

import { Info } from "lucide-react";
import { StatusCard } from "../components/auth-status-card";
import { AuthTabs } from "../components/auth-tabs";
import { SignUpForm } from "./sign-up.form";

export function SignUpPage() {
	return (
		<div className="space-y-8">
			<div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-lg">
				<AuthTabs />
				<SignUpForm />
			</div>

			<StatusCard icon={Info} title="Información de Registro">
				Las cuentas de nuevo ingreso tendrán <strong>acceso estándar</strong>.
				Si requiere permisos especializados (Juez, Administrador), estos serán
				asignados posteriormente por la administración.
			</StatusCard>
		</div>
	);
}
