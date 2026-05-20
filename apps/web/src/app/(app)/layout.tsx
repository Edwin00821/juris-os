import { SidebarInset, SidebarProvider } from "@juris-os/ui/components/sidebar";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { getSession } from "@/lib/auth";
import type { User, UserRole } from "@/types/user.type";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	if (!session) redirect("/sign-in");

	const user = session.user as User;
	const role = user.role as UserRole;

	if (role === "citizen") {
		return (
			<div className="flex min-h-screen flex-col bg-[#f7f9fb] text-[#191c1e]">
				<TopBar user={user} role={role} />
				<main className="flex-1 p-8">{children}</main>
			</div>
		);
	}

	return (
		<SidebarProvider defaultOpen={true}>
			<div className="flex min-h-screen w-full bg-[#f7f9fb] text-[#191c1e]">
				<AppSidebar role={role} />
				<SidebarInset className="flex flex-1 flex-col bg-transparent">
					<TopBar user={user} role={role} />
					<main className="flex-1 overflow-y-auto">{children}</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
