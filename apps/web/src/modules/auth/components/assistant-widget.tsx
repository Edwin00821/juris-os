import { Button } from "@juris-os-/ui/components/button";
import { Bot } from "lucide-react";

export function AssistantWidget() {
	return (
		<div className="fixed right-8 bottom-8 z-50">
			<Button
				variant="outline"
				className="flex h-auto w-auto items-center gap-3 rounded-full border-border/50 bg-background/80 p-4 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105 hover:bg-background/90 dark:bg-card/80 dark:hover:bg-card/90"
			>
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
					<Bot className="size-5 text-primary-foreground" />
				</div>
				<div className="hidden pr-4 text-left lg:block">
					<p className="font-bold font-headline text-[10px] text-primary uppercase leading-tight tracking-tighter">
						Asistente de Justicia
					</p>
					<p className="font-medium text-muted-foreground text-xs leading-tight">
						¿Necesitas ayuda para acceder?
					</p>
				</div>
			</Button>
		</div>
	);
}
