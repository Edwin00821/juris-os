import {
	SidebarInset,
	SidebarProvider,
} from "@juris-os-/ui/components/sidebar";
import type { Metadata } from "next";
import { JudgeAiAssistantFab } from "@/modules/judge/components/judge-ai-assistant-fab";
import { DashboardHeader } from "@/modules/judge/components/judge-header";
import { JudgeSidebar } from "@/modules/judge/components/judge-sidebar";

export const metadata: Metadata = {
	title: "Panel del Juez | Justicia Soberana",
	description: "Espacio de trabajo y gestión de causas judiciales.",
};

export default function JudgeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "420px",
				} as React.CSSProperties
			}
		>
			<JudgeSidebar />

			<SidebarInset className="flex min-h-screen flex-col">
				<DashboardHeader />
				<main className="flex flex-1 overflow-hidden">{children}</main>
			</SidebarInset>

			<JudgeAiAssistantFab />
		</SidebarProvider>
	);
}
