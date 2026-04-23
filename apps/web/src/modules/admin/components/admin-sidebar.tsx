"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@juris-os-/ui/components/sidebar";
import {
	Calendar,
	FileText,
	Gavel,
	HelpCircle,
	LayoutDashboard,
	Settings,
	Shield,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import type { NavItem } from "@/types/nav.types";

const NAV_MAIN: NavItem[] = [
	{
		title: "Panel de Control",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{ title: "Casos", href: "#", icon: Gavel, isActive: true },
	{ title: "Documentos", href: "#", icon: FileText },
	{ title: "Calendario", href: "#", icon: Calendar },
	{ title: "Configuración", href: "#", icon: Settings },
];

const NAV_FOOTER: NavItem[] = [
	{ title: "Centro de Ayuda", href: "#", icon: HelpCircle },
	{ title: "Privacidad Legal", href: "#", icon: Shield },
];

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="pt-4 pb-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="cursor-default hover:bg-transparent hover:text-inherit"
						>
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-white">
								<Gavel className="size-4" />
							</div>
							<div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
								<span className="truncate font-bold text-primary text-sm dark:text-white">
									Funcionario Judicial
								</span>
								<span className="truncate text-muted-foreground text-xs">
									Tribunal de Distrito
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_MAIN.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={item.isActive}
										tooltip={item.title}
										render={<Link href={item.href} />}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
					<SidebarGroupContent>
						<button
							type="button"
							className="w-full rounded-md bg-primary px-4 py-2 font-bold text-sm text-white shadow-sm transition-opacity hover:opacity-90"
						>
							Registrar Nuevo Caso
						</button>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_FOOTER.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										tooltip={item.title}
										render={
											<Link
												href={item.href}
												className="text-muted-foreground"
											/>
										}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
