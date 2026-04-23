import Link from "next/link";
import {
	HeaderActionGroup,
	NotificationAction,
	UserAccountAction,
} from "@/components/header-actions";
import { SearchInput } from "@/components/search-input";

export function TopNav() {
	return (
		<nav className="sticky top-0 z-50 flex w-full max-w-full items-center justify-between border-outline-variant/20 border-b bg-background px-6 py-3">
			<div className="flex items-center gap-8">
				<span className="font-bold font-headline text-primary text-xl tracking-tighter">
					Justicia Soberana
				</span>
				<div className="hidden items-center gap-6 md:flex">
					<Link
						href="/citizen"
						className="border-primary border-b-2 pb-1 font-bold font-headline text-primary text-sm tracking-tight"
					>
						Ciudadano
					</Link>
					<Link
						href="/admin"
						className="font-bold font-headline text-on-surface-variant text-sm tracking-tight transition-colors hover:text-primary"
					>
						Administrador
					</Link>
					<Link
						href="/judge/cases/1"
						className="font-bold font-headline text-on-surface-variant text-sm tracking-tight transition-colors hover:text-primary"
					>
						Juez
					</Link>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="relative hidden w-64 sm:block">
					<SearchInput
						placeholder="Buscar casos o identificaciones..."
						className="hidden sm:block"
					/>
				</div>

				<HeaderActionGroup>
					<NotificationAction />
					<UserAccountAction />
				</HeaderActionGroup>
			</div>
		</nav>
	);
}
