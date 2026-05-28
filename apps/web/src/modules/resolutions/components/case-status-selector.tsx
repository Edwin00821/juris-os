"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { CheckCircle, Clock } from "lucide-react";

type ResolutionAction = "PENDING_RESOLUTION" | "CLOSED";

const OPTIONS: {
	value: ResolutionAction;
	label: string;
	icon: React.ReactNode;
	className: string;
}[] = [
	{
		value: "PENDING_RESOLUTION",
		label: "Pend. resolución",
		icon: <Clock className="h-3.5 w-3.5" />,
		className:
			"bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100",
	},
	{
		value: "CLOSED",
		label: "Cerrar caso",
		icon: <CheckCircle className="h-3.5 w-3.5" />,
		className: "bg-green-50 text-green-800 border-green-300 hover:bg-green-100",
	},
];

interface CaseStatusSelectorProps {
	value: string | null;
	onChange: (value: string) => void;
}

export function CaseStatusSelector({
	value,
	onChange,
}: CaseStatusSelectorProps) {
	return (
		<div className="flex items-center gap-3">
			<span className="font-bold text-slate-500 text-xs uppercase tracking-widest">
				Acción:
			</span>
			<div className="flex gap-2">
				{OPTIONS.map((opt) => (
					<button
						type="button"
						key={opt.value}
						onClick={() => onChange(opt.value)}
						className={cn(
							"flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-bold text-xs transition-all",
							opt.className,
							value === opt.value
								? "scale-105 opacity-100"
								: "opacity-40 hover:opacity-80",
						)}
					>
						{opt.icon}
						{opt.label}
					</button>
				))}
			</div>
		</div>
	);
}
