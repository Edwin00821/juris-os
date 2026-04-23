import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

export interface NavItem {
	title: string;
	href: Route;
	icon?: LucideIcon;
	isActive?: boolean;
}
