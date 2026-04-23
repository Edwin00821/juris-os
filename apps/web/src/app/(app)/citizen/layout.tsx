import { CitizenFooter } from "@/modules/citizen/components/citizen-footer";
import { TopNav } from "@/modules/citizen/components/top-nav";

export default function CitizenLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
			<TopNav />

			{children}

			<CitizenFooter />
		</div>
	);
}
