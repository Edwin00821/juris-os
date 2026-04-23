import { Input } from "@juris-os-/ui/components/input";
import { Bell, Search, User } from "lucide-react";
import Link from "next/link";

export function TopNav() {
	return (
		<nav className="sticky top-0 z-50 flex w-full max-w-full items-center justify-between border-outline-variant/20 border-b bg-background bg-surface px-6 py-3">
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
						href="#judge"
						className="font-bold font-headline text-on-surface-variant text-sm tracking-tight transition-colors hover:text-primary"
					>
						Juez
					</Link>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="relative hidden w-64 sm:block">
					<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant/50" />
					<Input
						variant="search"
						className="pl-10"
						placeholder="Buscar casos o identificaciones..."
					/>
				</div>
				<button
					type="button"
					className="relative rounded-full p-2 transition-colors hover:bg-surface-container"
				>
					<Bell className="size-5 text-on-surface-variant" />
					<span className="absolute top-2 right-2 size-2 rounded-full border-2 border-surface bg-error" />
				</button>
				<button
					type="button"
					className="rounded-full p-2 transition-colors hover:bg-surface-container"
				>
					<User className="size-5 text-on-surface-variant" />
				</button>
			</div>
		</nav>
	);
}
