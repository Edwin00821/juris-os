"use client";

import { Button } from "@juris-os-/ui/components/button";
import { Input } from "@juris-os-/ui/components/input";
import { Label } from "@juris-os-/ui/components/label";
import { AtSign, Eye, EyeOff, LockKeyholeOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="email">Correo Institucional</Label>
				<div className="relative">
					<AtSign className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-on-surface-variant" />
					<Input
						id="email"
						type="email"
						placeholder="funcionario.justicia@tribunal.gob"
						className="pl-12"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="password">Contraseña Segura</Label>
					<Link
						href="#"
						className="font-bold text-primary text-xs transition-all hover:underline"
					>
						¿Olvidada?
					</Link>
				</div>
				<div className="relative">
					<LockKeyholeOpen className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-on-surface-variant" />
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••••••"
						className="pr-12 pl-12"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-variant"
						aria-label={
							showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
						}
					>
						{showPassword ? (
							<EyeOff className="size-5" />
						) : (
							<Eye className="size-5" />
						)}
					</button>
				</div>
			</div>

			<div className="pt-4">
				<Button type="submit" size="lg" className="w-full">
					ACCEDER AL SISTEMA
				</Button>
			</div>
		</div>
	);
}
