import { Check } from "lucide-react";

export function CompensationWidget() {
	return (
		<div className="flex flex-col justify-between rounded-xl bg-tertiary-container p-6 text-white">
			<div>
				<h4 className="mb-4 font-bold text-[10px] text-on-tertiary-container uppercase tracking-widest">
					Compensación Demandada
				</h4>

				<div className="space-y-4">
					<div>
						<p className="font-bold font-headline text-2xl">$45,000.00</p>
						<p className="text-[10px] text-on-tertiary-container uppercase">
							Indemnización y Daños
						</p>
					</div>

					<div className="h-px bg-white/10" />

					<ul className="space-y-2">
						<li className="flex items-center gap-2 text-[10px]">
							<Check className="size-3 text-primary-fixed-dim" /> Pago Atrasado
							Completo
						</li>
						<li className="flex items-center gap-2 text-[10px]">
							<Check className="size-3 text-primary-fixed-dim" /> Daños Morales
						</li>
					</ul>
				</div>
			</div>

			<button
				type="button"
				className="mt-6 w-full rounded bg-white/10 py-2 font-bold text-[10px] uppercase tracking-wider transition-colors hover:bg-white/20"
			>
				Ver Libro Mayor Financiero
			</button>
		</div>
	);
}
