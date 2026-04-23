import { Separator } from "@juris-os-/ui/components/separator";
import { SidebarTrigger } from "@juris-os-/ui/components/sidebar";
import Link from "next/link";
import {
	HeaderActionGroup,
	NotificationAction,
	UserAccountAction,
} from "@/components/header-actions";
import { SearchInput } from "@/components/search-input";

export function DashboardHeader() {
	return (
		<header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-outline-variant/10 border-b bg-background px-4">
			<div className="flex items-center gap-3">
				<SidebarTrigger className="text-on-surface-variant hover:text-primary" />
				<Separator
					orientation="vertical"
					className="h-10 bg-outline-variant/20"
				/>

				<nav className="hidden gap-6 md:flex">
					<Link
						href="/citizen"
						className="font-semibold text-on-surface-variant text-sm transition-colors hover:text-primary"
					>
						Ciudadano
					</Link>
					<Link
						href="/admin"
						className="font-semibold text-on-surface-variant text-sm transition-colors hover:text-primary"
					>
						Administrador
					</Link>
					<Link
						href="/judge/cases/1"
						className="border-primary border-b-2 pb-1 font-bold text-primary text-sm"
					>
						Juez
					</Link>
				</nav>
			</div>

			<div className="flex items-center gap-4">
				<div className="group relative w-64">
					<SearchInput
						placeholder="Búsqueda global.."
						className="hidden sm:block"
					/>
				</div>

				<HeaderActionGroup>
					<NotificationAction unreadCount={10} />
					<UserAccountAction />
				</HeaderActionGroup>
			</div>
		</header>
	);
}
