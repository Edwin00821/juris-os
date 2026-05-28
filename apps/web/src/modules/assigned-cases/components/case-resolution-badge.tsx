import { cn } from "@juris-os/ui/lib/utils";
import type { JudgeCaseStatus } from "../types";

const config: Record<JudgeCaseStatus, { label: string; className: string }> = {
	UNDER_REVIEW: {
		label: "En revisión",
		className: "bg-amber-100 text-amber-800 border border-amber-300",
	},
	PENDING_RESOLUTION: {
		label: "Pend. resolución",
		className: "bg-purple-100 text-purple-800 border border-purple-300",
	},
	CLOSED: {
		label: "Cerrado",
		className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
	},
};

export function CaseStatusBadge({ status }: { status: JudgeCaseStatus }) {
	const { label, className } = config[status] ?? {
		label: status,
		className: "bg-slate-100 text-slate-600",
	};
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold text-xs",
				className,
			)}
		>
			{label}
		</span>
	);
}
