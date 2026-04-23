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
	SidebarSeparator,
} from "@juris-os-/ui/components/sidebar";
import { cn } from "@juris-os-/ui/lib/utils";
import {
	Calendar,
	FileText,
	Gavel,
	HelpCircle,
	History,
	LayoutDashboard,
	Paperclip,
	Settings,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { NavItem } from "@/types/nav.types";

const MAIN_NAV_ITEMS: NavItem[] = [
	{ title: "Panel de Control", icon: LayoutDashboard, href: "/judge" },
	{ title: "Casos", icon: Gavel, href: "/judge/cases", isActive: true },
	{ title: "Documentos", icon: FileText, href: "/judge/signatures" },
	{ title: "Calendario", icon: Calendar, href: "/judge/calendar" },
	{ title: "Configuración", icon: Settings, href: "#judge#settings" },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
	{ title: "Centro de Ayuda", icon: HelpCircle, href: "#help" },
	{ title: "Privacidad Legal", icon: ShieldCheck, href: "#privacy" },
];

type CaseStatus = "Nuevo" | "Pendiente" | "En Revisión";

interface CaseRecord {
	id: string;
	docketNumber: string;
	status: CaseStatus;
	title: string;
	description: string;
	timeAgo: string;
	docCount: number;
	isActive?: boolean;
}

const MOCK_PENDING_CASES: CaseRecord[] = [
	{
		id: "case-1",
		docketNumber: "Expediente #2024-XP-082",
		status: "Nuevo",
		title: "Hernandez vs. Urban Logistics Corp.",
		description:
			"Disputa laboral sobre terminación de contrato sin indemnización por despido. Demanda por $45,000 USD en daños...",
		timeAgo: "Hace 2h",
		docCount: 12,
		isActive: true,
	},
	{
		id: "case-2",
		docketNumber: "Expediente #2024-CV-119",
		status: "Pendiente",
		title: "Global Tech S.A. vs. Local Dev Co.",
		description:
			"Reclamo por infracción de propiedad intelectual relacionado con módulos de software patentados utilizados en aplicaciones de terceros...",
		timeAgo: "Hace 5h",
		docCount: 4,
	},
	{
		id: "case-3",
		docketNumber: "Expediente #2024-RE-044",
		status: "En Revisión",
		title: "Liquidación del Fideicomiso de Propiedad Smith",
		description:
			"Sucesión y distribución de propiedades entre múltiples herederos tras la disolución del fideicomiso patrimonial...",
		timeAgo: "Hace 1d",
		docCount: 28,
	},
];

export function JudgeSidebar() {
	return (
		<Sidebar
			collapsible="icon"
			className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
		>
			<Sidebar
				collapsible="none"
				className="w-[calc(var(--sidebar-width-icon)+1px)]! border-outline-variant/10 border-r bg-surface-container-low"
			>
				<SidebarHeader className="p-4">
					<div className="flex flex-col gap-0.5">
						<h1 className="font-bold text-lg text-primary">JS</h1>
					</div>
				</SidebarHeader>

				<SidebarContent className="px-2">
					<SidebarMenu>
						{MAIN_NAV_ITEMS.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={{ children: item.title, hidden: false }}
									render={
										<Link href={item.href} className="flex items-center gap-3">
											{item.icon && (
												<item.icon
													className={`size-4 ${item.isActive ? "text-primary" : "text-on-surface-variant"}`}
												/>
											)}
											<span
												className={`font-medium text-sm ${item.isActive ? "font-bold text-primary" : "text-on-surface-variant"}`}
											>
												{item.title}
											</span>
										</Link>
									}
									isActive={item.isActive}
									className={cn(
										"px-2.5 md:px-2",
										item.isActive
											? "bg-surface-container-lowest shadow-sm"
											: "",
									)}
								/>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarContent>

				<SidebarFooter className="flex flex-col gap-4">
					<SidebarSeparator className="bg-outline-variant/10" />

					<SidebarMenu>
						{SECONDARY_NAV_ITEMS.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={{ children: item.title, hidden: false }}
									render={
										<Link href={item.href} className="flex items-center gap-3">
											{item.icon && (
												<item.icon className="size-4 text-on-surface-variant" />
											)}
											<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
												{item.title}
											</span>
										</Link>
									}
									className="h-8 px-2.5 md:px-2"
								/>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>

			<Sidebar
				collapsible="none"
				className="hidden flex-1 border-outline-variant/10 border-r bg-surface-container-low md:flex"
			>
				<SidebarHeader className="border-outline-variant/10 border-b px-6 py-7">
					<h2 className="font-bold font-headline text-primary text-xl tracking-tight">
						Bandeja de Pendientes
					</h2>
					<p className="mt-1.5 font-body text-on-surface-variant text-xs">
						{MOCK_PENDING_CASES.length} casos que requieren revisión inmediata
					</p>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup className="p-0">
						<SidebarGroupContent>
							{MOCK_PENDING_CASES.map((caseItem) => (
								<Link key={caseItem.id} href={`/judge/cases/${caseItem.id}`}>
									<div
										className={cn(
											"relative cursor-pointer border-outline-variant/10 border-b px-6 py-6 transition-colors hover:bg-surface-bright",
											caseItem.isActive ? "bg-surface-container-lowest" : "",
										)}
									>
										{caseItem.isActive && (
											<div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
										)}

										<div className="mb-3 flex items-start justify-between gap-2">
											<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
												{caseItem.docketNumber}
											</span>
											<span
												className={cn(
													"shrink-0 rounded-full px-2 py-0.5 font-bold text-[10px] uppercase",
													caseItem.status === "Nuevo"
														? "bg-primary-fixed text-on-primary-fixed"
														: "bg-secondary-container text-on-secondary-container",
												)}
											>
												{caseItem.status}
											</span>
										</div>

										<h3 className="mb-2 font-bold font-headline text-primary text-sm leading-snug">
											{caseItem.title}
										</h3>
										<p className="line-clamp-2 font-body text-on-surface-variant text-xs leading-relaxed">
											{caseItem.description}
										</p>

										<div className="mt-4 flex items-center gap-5">
											<div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
												<History className="size-3" />
												{caseItem.timeAgo}
											</div>
											<div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
												<Paperclip className="size-3" />
												{caseItem.docCount} Docs
											</div>
										</div>
									</div>
								</Link>
							))}
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</Sidebar>
	);
}
