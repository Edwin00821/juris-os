import Link from "next/link";

export function CitizenFooter() {
	return (
		<footer className="mt-auto w-full border-outline-variant/20 border-t bg-surface px-8 py-8">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
				<span className="font-bold font-headline text-on-surface-variant/50 uppercase tracking-widest">
					Justicia Soberana
				</span>

				<div className="flex flex-wrap justify-center gap-6">
					<Link
						href="#privacy"
						className="font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest transition-colors hover:text-primary"
					>
						Política de Privacidad
					</Link>
					<Link
						href="#terms"
						className="font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest transition-colors hover:text-primary"
					>
						Términos de Servicio
					</Link>
					<Link
						href="#accessibility"
						className="font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest transition-colors hover:text-primary"
					>
						Accesibilidad
					</Link>
					<Link
						href="#contact"
						className="font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest transition-colors hover:text-primary"
					>
						Contacto
					</Link>
				</div>

				<span className="font-medium text-[10px] text-outline-variant">
					© 2026 Juris OS - Sistema Judicial Digital
				</span>
			</div>
		</footer>
	);
}
