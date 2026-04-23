"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@juris-os-/ui/components/avatar";
import { Badge } from "@juris-os-/ui/components/badge";
import { Brain, CheckCircle2, Sparkles } from "lucide-react";

export function AiSuggestion() {
	return (
		<div className="space-y-4 lg:col-span-5">
			<div className="sticky top-24 space-y-4">
				<div className="overflow-hidden rounded-2xl bg-primary-container p-1 shadow-2xl">
					<div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
						<div className="flex flex-col justify-between gap-4">
							<Badge variant="optimal">Coincidencia Óptima</Badge>
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-container">
									<Sparkles className="size-5 text-white" />
								</div>
								<h3 className="font-bold text-lg text-white">
									Sugerencia de Asignación de IA
								</h3>
							</div>
						</div>

						<div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4">
							<Avatar size="xl">
								<AvatarImage
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuD29s9ot81XzNTVUBjqfaJEE4_wecf7w6fa4BklLeJPsQqvYIhnqoV_ix1DBQkjzCwzF0sLE6MAmVYxXMJ09TKFxzgv5BcExORDGrvWoynUU4xGp_fAvht6l08bHT3h9akv6YMGcuT0Y0ftNjJk5WtHC1SJ0BWIq7AcHDOgfr3y8ZWt999BD5qtuWVY0i1G0neEE2j2YILZzDQ6P-TRzNaFXFeeJpY5QQNVtjej553HT1hG5lfitF-3dDr0RV1rv328Kwug8vao1wM"
									alt="Juez Thorne"
								/>
								<AvatarFallback>AT</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-bold text-primary">Juez Alistair Thorne</p>
								<p className="text-foreground/75 text-sm">
									Especialidad: Ley de Privacidad y Tecnología
								</p>
								<div className="mt-1 flex items-center gap-1">
									<div className="h-1 w-8 rounded-full bg-primary" />
									<div className="h-1 w-8 rounded-full bg-primary" />
									<div className="h-1 w-8 rounded-full bg-surface-container-highest" />
									<span className="ml-1 text-[10px] text-foreground/75">
										65% Carga de Trabajo
									</span>
								</div>
							</div>
						</div>

						<div className="rounded-xl border border-white/5 bg-surface-container-high/20 p-4">
							<h4 className="mb-3 flex items-center gap-2 font-bold text-white text-xs uppercase tracking-widest">
								<Brain className="size-4" />
								¿Por qué esta recomendación?
							</h4>
							<p className="text-on-primary-container text-sm italic leading-relaxed">
								"El Juez Thorne ha resuelto el 85% de los casos que involucran a
								entidades de 'Global Net Protocol' en el último trimestre. Su
								tiempo de respuesta promedio para Apelaciones de Privacidad es
								un 14% más rápido que la media del tribunal, y su agenda actual
								permite una deliberación inmediata."
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<button
								type="button"
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-fixed to-primary-fixed-dim py-3 font-bold text-primary transition-transform hover:scale-[1.02]"
							>
								Confirmar Asignación
								<CheckCircle2 className="size-5" />
							</button>
							<button
								type="button"
								className="w-full py-2 font-bold text-on-primary-container text-xs transition-colors hover:text-white"
							>
								Ignorar y Anular Manualmente
							</button>
						</div>
					</div>
				</div>

				<div className="space-y-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
					<h4 className="font-bold text-foreground text-xs uppercase tracking-widest">
						Eficiencia Judicial Diaria
					</h4>
					<div className="flex h-20 items-end justify-between gap-2">
						<div className="h-[40%] w-full rounded-t bg-surface-container-high" />
						<div className="h-[60%] w-full rounded-t bg-surface-container-high" />
						<div className="h-[90%] w-full rounded-t bg-primary" />
						<div className="h-[50%] w-full rounded-t bg-surface-container-high" />
						<div className="h-[30%] w-full rounded-t bg-surface-container-high" />
						<div className="h-[75%] w-full rounded-t bg-primary-container" />
						<div className="h-[45%] w-full rounded-t bg-surface-container-high" />
					</div>
					<p className="text-[11px] text-foreground leading-tight">
						El tiempo de respuesta promedio para nuevas demandas es actualmente
						de <span className="font-bold text-primary">1.4 horas</span>.
					</p>
				</div>
			</div>
		</div>
	);
}
