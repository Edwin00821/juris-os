"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { Clock, Search } from "lucide-react";
import type { WorkingCaseStatus } from "../hooks/use-update-case-status";

const OPTIONS: {
	value: WorkingCaseStatus;
	label: string;
	icon: React.ReactNode;
	className: string;
}[] = [
	{
		value: "UNDER_REVIEW",
		label: "En revisión",
		icon: <Search className="h-3.5 w-3.5" />,
		className: "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100",
	},
	{
		value: "PENDING_RESOLUTION",
		label: "Pend. resolución",
		icon: <Clock className="h-3.5 w-3.5" />,
		className:
			"bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100",
	},
];

interface CaseStatusSelectorProps {
	value: WorkingCaseStatus | null;
	onChange: (value: WorkingCaseStatus) => void;
	disabled?: boolean;
}

export function CaseStatusSelector({
	value,
	onChange,
	disabled,
}: CaseStatusSelectorProps) {
	return (
		<div className="flex items-center gap-3">
			<span className="font-bold text-slate-500 text-xs uppercase tracking-widest">
				Estado:
			</span>
			<div className="flex gap-2">
				{OPTIONS.map((opt) => (
					<button
						type="button"
						key={opt.value}
						onClick={() => onChange(opt.value)}
						disabled={disabled || value === opt.value}
						className={cn(
							"flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-bold text-xs transition-all disabled:cursor-default",
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
