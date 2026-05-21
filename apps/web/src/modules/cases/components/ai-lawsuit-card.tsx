import { Bot, CheckCircle, Globe, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export function AILawsuitCard() {
	return (
		<Link
			href="/citizen/cases/new/ai"
			className="card-hover group relative flex min-h-105 flex-col overflow-hidden rounded-xl bg-primary-container p-8 text-white no-underline"
		>
			<div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-white/5 transition-transform group-hover:scale-125" />
			<div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-white/5 transition-transform group-hover:scale-110" />

			<div className="relative z-10 mb-5">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-bold text-[10px] uppercase tracking-widest backdrop-blur-sm">
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
					Recomendado
				</span>
			</div>

			<div className="relative z-10 mb-4 flex items-center gap-3">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
					<Sparkles className="size-6 text-primary-fixed-dim" />
				</div>
				<h2 className="font-bold font-headline text-xl">
					Generador de Demandas con IA
				</h2>
			</div>

			<p className="relative z-10 mb-6 grow text-on-primary-container text-sm leading-relaxed">
				Use nuestra guía asistida por Inteligencia Artificial para redactar su
				demanda legal. Exponga su caso en lenguaje sencillo y nosotros lo
				estructuraremos para el tribunal.
			</p>

			<div className="relative z-10 mb-6 rounded-lg bg-black/20 p-4 backdrop-blur-sm">
				<div className="mb-3 flex gap-2">
					<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-fixed-dim">
						<Bot className="size-4 text-primary" />
					</div>
					<div className="rounded-lg rounded-tl-none bg-white/10 p-2.5 text-[11px] leading-relaxed">
						"Dígame qué sucedió con el retraso logístico."
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<div className="max-w-[80%] rounded-lg rounded-tr-none bg-primary p-2.5 text-[11px] leading-relaxed">
						"Perdieron la ventana de entrega tres veces y se negaron a
						reembolsar el costo de envío..."
					</div>
				</div>
			</div>

			<div className="relative z-10 mb-6 flex flex-wrap gap-3 font-bold text-[10px] uppercase tracking-wider">
				<span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
					<Zap className="size-3" /> Rápido
				</span>
				<span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
					<CheckCircle className="size-3" /> Preciso
				</span>
				<span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
					<Globe className="size-3" /> Lenguaje Simple
				</span>
			</div>

			<div className="relative z-10 flex items-center justify-center gap-2 rounded-lg bg-white py-3 font-bold text-primary text-sm transition-colors group-hover:bg-primary-fixed">
				<Sparkles className="size-4" /> Iniciar Registro Guiado con IA
			</div>
		</Link>
	);
}
