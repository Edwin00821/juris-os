"use client";

import { Bot, X } from "lucide-react";
import { useState } from "react";

interface AiInsightFabProps {
	message: string;
	title?: string;
}

export function AiInsightFab({
	message,
	title = "Perspectiva Soberana",
}: AiInsightFabProps) {
	const [visible, setVisible] = useState(true);

	if (!visible) return null;

	return (
		<div className="fixed right-8 bottom-8 z-50">
			<div className="flex max-w-sm items-center gap-4 rounded-xl border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur-md">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#002045]">
					<Bot className="h-6 w-6 text-white" />
				</div>
				<div className="flex-1">
					<p className="font-bold text-[#002045] text-sm">{title}</p>
					<p className="mt-0.5 text-slate-500 text-xs">{message}</p>
				</div>
				<button
					type="button"
					onClick={() => setVisible(false)}
					className="shrink-0 rounded-lg p-1 transition-colors hover:bg-slate-100"
					aria-label="Cerrar sugerencia"
				>
					<X className="h-4 w-4 text-slate-400" />
				</button>
			</div>
		</div>
	);
}
