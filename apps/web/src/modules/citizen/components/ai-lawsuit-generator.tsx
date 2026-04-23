import { Sparkles } from "lucide-react";

export function AiLawsuitGenerator() {
	return (
		<div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-primary-container p-6 text-white">
			<div className="absolute top-0 right-0 -mt-16 -mr-16 size-32 rounded-full bg-white/5 backdrop-blur-md transition-transform group-hover:scale-110" />

			<div className="mb-4 flex items-center gap-3">
				<Sparkles className="size-6 text-primary-fixed-dim" />
				<h3 className="font-bold font-headline text-lg">
					Generador de Demandas
				</h3>
			</div>

			<p className="mb-6 grow text-on-primary-container text-sm">
				Use nuestra guía asistida por IA para redactar su demanda legal. Exponga
				su caso en lenguaje sencillo y nosotros lo estructuraremos para el
				tribunal.
			</p>

			<div className="mb-6 rounded-lg bg-black/20 p-3 backdrop-blur-sm">
				<div className="mb-3 flex gap-2">
					<div className="size-6 shrink-0 rounded-full bg-primary-fixed-dim" />
					<div className="rounded-lg rounded-tl-none bg-white/10 p-2 text-[11px] leading-relaxed">
						"Dígame qué sucedió con el retraso logístico."
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<div className="max-w-[80%] rounded-lg rounded-tr-none bg-primary p-2 text-[11px] leading-relaxed">
						"Perdieron la ventana de entrega tres veces y se negaron a
						reembolsar el costo de envío..."
					</div>
				</div>
			</div>

			<button
				type="button"
				className="rounded-lg bg-white py-2.5 font-bold text-primary text-sm transition-colors hover:bg-primary-fixed"
			>
				Iniciar Registro Guiado
			</button>
		</div>
	);
}
