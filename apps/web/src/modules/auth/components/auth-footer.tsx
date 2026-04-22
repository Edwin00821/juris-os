import Link from "next/link";

export function AuthFooter() {
	return (
		<div className="flex flex-col items-center justify-between gap-4 border-outline-variant/20 border-t pt-8 md:flex-row">
			<p className="font-label text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
				© 2026 Sistema de Apoyo de Justicia Soberana
			</p>
			<div className="flex gap-4">
				{["Privacidad", "Accesibilidad", "Contactar Soporte"].map((label) => (
					<Link
						key={label}
						href="#"
						className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest transition-colors hover:text-primary"
					>
						{label}
					</Link>
				))}
			</div>
		</div>
	);
}
