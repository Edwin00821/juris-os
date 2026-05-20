"use client";

import { SidebarTrigger } from "@juris-os/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- 1. Importar usePathname

import type { User, UserRole } from "@/types/user.type";
import { HeaderActionGroup, NotificationAction } from "../header-actions";
import { SearchInput } from "../search-input";
import { UserMenuNavbar } from "../user-menu/user-menu-navbar";

export function TopBar({ user, role }: { user: User; role: UserRole }) {
	const hasSidebar = role === "admin" || role === "judge";

	const pathname = usePathname();

	const isHomeActive = pathname === "/" || pathname === `/${role}`;

	return (
		<header className="sticky top-0 z-50 flex w-full max-w-full items-center gap-8 border-slate-200 border-b bg-slate-50 px-6 py-3">
			<div className="flex items-center gap-4">
				{hasSidebar && <SidebarTrigger className="text-blue-900 md:hidden" />}
				<div className="font-bold font-headline text-blue-950 text-xl tracking-tighter">
					Justicia Soberana
				</div>
			</div>

			<nav className="hidden gap-4 md:flex">
				<Link
					href="/"
					className={`border-b-2 py-1 font-manrope font-semibold text-sm tracking-tight transition-colors hover:text-blue-900 ${
						isHomeActive
							? "border-black text-blue-950"
							: "border-transparent text-slate-500"
					}`}
				>
					Inicio
				</Link>
			</nav>

			<HeaderActionGroup className="ml-auto">
				{role === "citizen" && (
					<SearchInput placeholder="Buscar casos o identificaciones..." />
				)}

				<NotificationAction />

				<UserMenuNavbar user={user} />
			</HeaderActionGroup>
		</header>
	);
}
