import { Sparkles } from "lucide-react";

export function JudgeAiAssistantFab() {
	return (
		<div className="fixed right-6 bottom-6 z-50">
			<button
				type="button"
				className="group flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105"
			>
				<Sparkles className="size-6 fill-accent" />
				<div className="absolute right-full bottom-2 mr-4 whitespace-nowrap rounded-xl border border-outline-variant/10 bg-surface-container-low/80 px-4 py-2 font-medium text-primary text-xs opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100">
					Consultar al Asistente Legal de IA
				</div>
			</button>
		</div>
	);
}
