import {
	SidebarInset,
	SidebarProvider,
} from "@juris-os-/ui/components/sidebar";
import { AdminSidebar } from "@/modules/admin/components/admin-sidebar";
import { Header } from "@/modules/admin/components/header";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset>
				<Header />
				<main className="flex flex-1 flex-col gap-4 p-4 lg:p-8">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
