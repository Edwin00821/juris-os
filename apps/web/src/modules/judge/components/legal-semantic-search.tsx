import { Button } from "@juris-os-/ui/components/button";
import { Input } from "@juris-os-/ui/components/input";
import { Sparkles } from "lucide-react";

export function LegalSemanticSearch() {
	return (
		<div className="z-10 bg-surface-container-lowest p-4 shadow-sm">
			<div className="relative mx-auto max-w-4xl">
				<div className="flex items-center gap-3 rounded-xl border-primary border-b-2 bg-surface-container-high px-4 py-1">
					<Sparkles className="size-6 fill-primary-container text-primary-container" />
					<Input
						type="text"
						defaultValue="Identificar evidencia de aviso de terminación previo"
						placeholder="Pida a la IA que busque puntos legales específicos o evidencia..."
						className="w-full border-none bg-transparent font-medium text-sm shadow-none placeholder:text-on-surface-variant focus-visible:ring-0 focus-visible:ring-offset-0"
					/>
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap rounded bg-primary-fixed px-2 py-1 font-bold text-[10px] text-primary-container">
							IA de Búsqueda Semántica
						</span>
						<Button size="sm">Ejecutar</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
