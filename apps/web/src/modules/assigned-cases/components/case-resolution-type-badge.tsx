import { cn } from "@juris-os/ui/lib/utils";
import type { CaseResolution } from "../types";

const config: Record<CaseResolution, { label: string; className: string }> = {
	admitted: {
		label: "Admitida",
		className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
	},
	conditioned: {
		label: "Prevenida",
		className: "bg-amber-100 text-amber-800 border border-amber-300",
	},
	rejected: {
		label: "Rechazada",
		className: "bg-red-100 text-red-800 border border-red-300",
	},
};

export function CaseResolutionTypeBadge({
	resolution,
}: {
	resolution: CaseResolution | null;
}) {
	if (!resolution) {
		return (
			<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-500 text-xs">
				—
			</span>
		);
	}
	const { label, className } = config[resolution];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold text-xs",
				className,
			)}
		>
			{label}
		</span>
	);
}
