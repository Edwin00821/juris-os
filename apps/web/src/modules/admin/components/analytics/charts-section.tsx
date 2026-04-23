"use client";

export function ChartsSection() {
	return (
		<>
			<div className="rounded-xl border border-transparent bg-surface-container-lowest p-8 shadow-sm md:col-span-3">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h4 className="font-bold font-headline text-primary text-xl">
							Volumen de Procesamiento de Casos
						</h4>
						<p className="text-on-surface-variant text-sm">
							Rendimiento mensual de demandas civiles y penales.
						</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1.5">
							<span className="h-3 w-3 rounded-full bg-primary" />
							<span className="font-bold text-on-surface-variant text-xs">
								Procesados
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<span className="h-3 w-3 rounded-full bg-primary-fixed-dim" />
							<span className="font-bold text-on-surface-variant text-xs">
								Objetivo
							</span>
						</div>
					</div>
				</div>
				<div className="flex h-64 items-end justify-between gap-4 px-2">
					{/* Mock Bars */}
					{[
						{ label: "Ene", val1: "h-3/4", val2: "h-2/3", mt: "-mt-3/4" },
						{ label: "Feb", val1: "h-4/5", val2: "h-3/4", mt: "-mt-4/5" },
						{ label: "Mar", val1: "h-5/6", val2: "h-full", mt: "-mt-5/6" },
						{ label: "Abr", val1: "h-3/4", val2: "h-1/2", mt: "-mt-3/4" },
						{ label: "May", val1: "h-4/5", val2: "h-3/5", mt: "-mt-4/5" },
						{ label: "Jun", val1: "h-5/6", val2: "h-2/3", mt: "-mt-5/6" },
					].map((bar, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <>
							key={i}
							className="group flex flex-1 flex-col items-center gap-2"
						>
							<div
								className={`w-full rounded-t-lg bg-primary-fixed-dim ${bar.val1} opacity-40`}
							/>
							<div
								className={`w-full rounded-t-lg bg-primary ${bar.val2} ${bar.mt} relative z-10 transition-opacity hover:opacity-80`}
							/>
							<span className="font-bold text-on-surface-variant text-xs">
								{bar.label}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Gráfico de Mezcla de Resultados */}
			<div className="rounded-xl bg-surface-container-lowest p-8 shadow-sm md:col-span-1">
				<h4 className="mb-1 font-bold font-headline text-primary text-xl">
					Mezcla de Resultados
				</h4>
				<p className="mb-8 text-on-surface-variant text-sm">
					Distribución de decisiones de casos.
				</p>
				<div className="relative mx-auto flex h-48 w-48 items-center justify-center">
					{/** biome-ignore lint/a11y/noSvgWithoutTitle: <> */}
					<svg
						className="h-full w-full -rotate-90 transform"
						viewBox="0 0 100 100"
					>
						<circle
							cx="50"
							cy="50"
							fill="transparent"
							r="40"
							stroke="#eceef0"
							strokeWidth="20"
						/>
						<circle
							cx="50"
							cy="50"
							fill="transparent"
							r="40"
							stroke="#002045"
							strokeDasharray="160 251.2"
							strokeWidth="20"
						/>
						<circle
							cx="50"
							cy="50"
							fill="transparent"
							r="40"
							stroke="#ba1a1a"
							strokeDasharray="60 251.2"
							strokeDashoffset="-160"
							strokeWidth="20"
						/>
						<circle
							cx="50"
							cy="50"
							fill="transparent"
							r="40"
							stroke="#515f74"
							strokeDasharray="31.2 251.2"
							strokeDashoffset="-220"
							strokeWidth="20"
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
						<span className="font-extrabold text-2xl text-primary leading-none">
							1.4k
						</span>
						<span className="font-bold text-[10px] text-on-surface-variant uppercase">
							Total
						</span>
					</div>
				</div>
				<div className="mt-8 flex flex-col gap-3">
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-2">
							<span className="h-2.5 w-2.5 rounded-full bg-primary" />
							<span className="font-medium">Admitidos</span>
						</div>
						<span className="font-bold">64%</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-2">
							<span className="h-2.5 w-2.5 rounded-full bg-error" />
							<span className="font-medium">Desechados</span>
						</div>
						<span className="font-bold">24%</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-2">
							<span className="h-2.5 w-2.5 rounded-full bg-secondary" />
							<span className="font-medium">Apelados</span>
						</div>
						<span className="font-bold">12%</span>
					</div>
				</div>
			</div>
		</>
	);
}
