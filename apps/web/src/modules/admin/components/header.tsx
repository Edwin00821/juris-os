"use client";

import { Separator } from "@juris-os-/ui/components/separator";
import { SidebarTrigger } from "@juris-os-/ui/components/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	HeaderActionGroup,
	NotificationAction,
	UserAccountAction,
} from "@/components/header-actions";
import type { NavItem } from "@/types/nav.types";

const NAV_LINKS: NavItem[] = [
	{ title: "Ciudadano", href: "/citizen" },
	{ title: "Administrador", href: "/admin" },
	{ title: "Juez", href: "/judge/cases" },
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-outline-variant/20 border-b bg-surface-container-lowest/80 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-10" />
				<div className="font-bold font-headline text-primary text-xl tracking-tighter">
					Justicia Soberana
				</div>
			</div>

			<nav className="hidden items-center gap-8 md:flex">
				{NAV_LINKS.map((link) => {
					const isActive = pathname?.startsWith(link.href);
					return (
						<Link
							key={link.href}
							href={link.href}
							className={[
								"font-headline font-semibold text-sm tracking-tight transition-colors",
								isActive
									? "border-primary border-b-2 pb-1 text-primary"
									: "rounded-md px-2 py-1 text-on-surface-variant hover:bg-surface-container hover:text-primary",
							].join(" ")}
						>
							{link.title}
						</Link>
					);
				})}
			</nav>

			<HeaderActionGroup>
				<NotificationAction unreadCount={100} />
				<UserAccountAction />
			</HeaderActionGroup>
		</header>
	);
}
