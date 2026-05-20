"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@juris-os/ui/components/sidebar";
import { cn } from "@juris-os/ui/lib/utils";
import { Gavel, HelpCircle, ShieldAlert } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_CONFIG } from "@/lib/nav-config";
import type { UserRole } from "@/types/user.type";

interface AppSidebarProps {
	role: UserRole;
	userName?: string;
	userCourt?: string;
}

export function AppSidebar({
	role,
	userName = "Funcionario Judicial",
	userCourt = "Tribunal de Distrito",
}: AppSidebarProps) {
	const pathname = usePathname();

	const links = NAV_CONFIG[role as "admin" | "judge"] || [];

	return (
		<Sidebar
			collapsible="icon"
			className="z-40 border-slate-200 border-r bg-slate-100 font-inter"
		>
			<SidebarHeader className="mb-6 px-4 pt-6">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a365d] text-white">
						<Gavel className="size-6" />
					</div>
					<div className="group-data-[collapsible=icon]:hidden">
						<p className="truncate font-bold text-blue-950 text-sm">
							{userName}
						</p>
						<p className="truncate text-slate-500 text-xs">{userCourt}</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-2">
				<SidebarMenu className="gap-1">
					{links.map((link) => {
						const isActive =
							pathname === link.href || pathname.startsWith(`${link.href}/`);
						return (
							<SidebarMenuItem key={link.href}>
								<SidebarMenuButton
									render={
										<Link href={link.href}>
											<link.icon className="size-4 shrink-0" />
											<span className="font-medium text-sm">{link.title}</span>
										</Link>
									}
									isActive={isActive}
									tooltip={link.title}
									className={cn(
										"flex h-auto items-center gap-3 rounded-sm px-3 py-2 transition-transform duration-200",
										isActive
											? "bg-white font-bold text-blue-900 shadow-sm hover:bg-white hover:text-blue-900"
											: "text-slate-600 hover:translate-x-1 hover:bg-slate-200 hover:text-slate-900",
									)}
								/>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="mt-auto flex flex-col gap-1 border-slate-200 border-t px-2 pt-4 pb-4">
				<SidebarMenu className="gap-1">
					<SidebarMenuItem>
						<SidebarMenuButton
							render={
								<Link
									href={"/support/help" as Route<string>}
									className="flex items-center gap-3"
								>
									<HelpCircle className="h-4 w-4 shrink-0" />
									<span className="text-xs group-data-[collapsible=icon]:hidden">
										Centro de Ayuda
									</span>
								</Link>
							}
							className="h-auto py-2 text-slate-500 transition-colors hover:text-blue-900"
						/>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton
							render={
								<Link
									href={"/support/privacy" as Route<string>}
									className="flex items-center gap-3"
								>
									<ShieldAlert className="h-4 w-4 shrink-0" />
									<span className="text-xs group-data-[collapsible=icon]:hidden">
										Privacidad Legal
									</span>
								</Link>
							}
							className="h-auto py-2 text-slate-500 transition-colors hover:text-blue-900"
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
