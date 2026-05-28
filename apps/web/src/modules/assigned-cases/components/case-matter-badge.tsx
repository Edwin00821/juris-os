import { cn } from "@juris-os/ui/lib/utils";
import type { CaseCategory } from "../types";

const config: Record<CaseCategory, { label: string; className: string }> = {
	criminal: {
		label: "Penal",
		className: "bg-error-container/40 text-error-container-foreground",
	},
	family: {
		label: "Familiar",
		className: "bg-tertiary-fixed text-on-tertiary-fixed",
	},
	labor: {
		label: "Laboral",
		className: "bg-primary-fixed text-on-primary-fixed",
	},
};

export function CaseMatterBadge({ matter }: { matter: CaseCategory }) {
	const { label, className } = config[matter] ?? {
		label: matter,
		className: "bg-slate-100 text-slate-600",
	};
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
