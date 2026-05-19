"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthTabs() {
	const pathname = usePathname();

	return (
		<div className="mb-10 flex gap-8">
			<Link
				href="/sign-in"
				className={[
					"border-b-2 pb-2 font-bold font-headline text-sm transition-colors",
					pathname === "/sign-in"
						? "border-primary text-primary"
						: "border-transparent text-on-surface-variant hover:text-primary",
				].join(" ")}
			>
				INICIAR SESIÓN
			</Link>
			<Link
				href="/sign-up"
				className={[
					"border-b-2 pb-2 font-bold font-headline text-sm transition-colors",
					pathname === "/sign-up"
						? "border-primary text-primary"
						: "border-transparent text-on-surface-variant hover:text-primary",
				].join(" ")}
			>
				REGISTRARSE
			</Link>
		</div>
	);
}
