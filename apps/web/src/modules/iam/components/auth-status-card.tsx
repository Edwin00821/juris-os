import type { LucideIcon } from "lucide-react";
import type React from "react";

interface StatusCardProps {
	icon: LucideIcon;
	title: string;
	children: React.ReactNode;
}

export function StatusCard({ icon: Icon, title, children }: StatusCardProps) {
	return (
		<div className="flex items-center gap-6 rounded-xl border-primary border-l-4 bg-surface-container-low p-6">
			<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
				<Icon className="h-6 w-6 text-primary" strokeWidth={2} />
			</div>
			<div>
				<h4 className="font-bold font-headline text-primary text-sm">
					{title}
				</h4>
				<p className="text-on-surface-variant text-xs leading-relaxed">
					{children}
				</p>
			</div>
		</div>
	);
}
