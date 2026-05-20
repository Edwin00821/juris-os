import {
	CheckCircle,
	ClipboardList,
	Clock,
	FileText,
	LayoutDashboard,
	type LucideIcon,
	PlusCircle,
	Users,
} from "lucide-react";
import type { Route } from "next";
import type { UserRole } from "@/types/user.type";

export interface NavItem {
	title: string;
	href: Route;
	icon: LucideIcon;
}

export const NAV_CONFIG: Record<UserRole, NavItem[]> = {
	admin: [
		{ title: "Panel de Control", href: "/admin", icon: LayoutDashboard },
		{ title: "Jueces", href: "#admin/directory", icon: Users },
		{
			title: "Asignación de Casos",
			href: "#admin/assignments",
			icon: ClipboardList,
		},
	],
	judge: [
		{ title: "Casos Pendientes", href: "/judge", icon: Clock },
		{ title: "Casos Terminados", href: "#judge/history", icon: CheckCircle },
	],
	citizen: [
		{ title: "Mis Casos", href: "/citizen", icon: FileText },
		{ title: "Nueva Demanda", href: "#citizen/cases/new", icon: PlusCircle },
	],
};
