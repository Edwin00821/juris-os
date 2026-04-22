import Link from "next/link";

const active: "sign-in" | "sign-up" = "sign-in";

export function AuthTabs() {
	return (
		<div className="mb-10 flex gap-8">
			<Link
				href="#"
				className={[
					"border-b-2 pb-2 font-bold font-headline text-sm transition-colors",
					active === "sign-in"
						? "border-primary text-primary"
						: "border-transparent text-on-surface-variant hover:text-primary",
				].join(" ")}
			>
				INICIAR SESIÓN
			</Link>
			<Link
				href="#"
				className={[
					"border-b-2 pb-2 font-bold font-headline text-sm transition-colors",
					active === "sign-up"
						? "border-primary text-primary"
						: "border-transparent text-on-surface-variant hover:text-primary",
				].join(" ")}
			>
				REGISTRARSE
			</Link>
		</div>
	);
}
