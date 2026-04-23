"use client";

import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface JudicialCopilotProps {
	initialSuggestion: string;
}

export function JudicialCopilot({ initialSuggestion }: JudicialCopilotProps) {
	const [query, setQuery] = useState("");

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setQuery("");
	};

	return (
		<section className="glass-effect rounded-xl border border-white/40 p-6 shadow-xl">
			<h3 className="mb-4 flex items-center gap-2 font-extrabold text-primary text-xs uppercase tracking-widest">
				<Sparkles className="h-4 w-4" />
				Copiloto Judicial
			</h3>
			<div className="mb-4 rounded-sm border-primary border-l-4 bg-surface-container-lowest/60 p-4 text-muted-foreground text-sm italic leading-relaxed">
				"{initialSuggestion}"
			</div>
			<form onSubmit={handleSend} className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full rounded-lg border-none bg-surface-container-high p-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary"
					placeholder="Pregunte por precedentes legales..."
				/>
				<button
					type="submit"
					className="absolute top-2.5 right-3 text-outline transition-colors hover:text-primary"
					aria-label="Enviar consulta"
				>
					<Send className="h-4 w-4" />
				</button>
			</form>
		</section>
	);
}
