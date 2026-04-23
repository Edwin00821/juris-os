import { AlertCircle, Clock, FileCheck, Gavel } from "lucide-react";

export function JudgeDashboardPage() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<header>
				<h1 className="font-bold font-headline text-3xl text-primary tracking-tight">
					Panel de Control
				</h1>
				<p className="mt-2 font-body text-base text-on-surface-variant">
					Bienvenido, Honorable Juez. Este es el resumen de su actividad para
					hoy.
				</p>
			</header>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<StatCard
					title="Casos Pendientes"
					value="12"
					icon={<Gavel className="size-5" />}
					trend="3 nuevos hoy"
				/>
				<StatCard
					title="Audiencias Hoy"
					value="4"
					icon={<Clock className="size-5" />}
					trend="Próxima en 2h"
				/>
				<StatCard
					title="Para Firma"
					value="8"
					icon={<FileCheck className="size-5" />}
					trend="Urgente: 2"
				/>
				<StatCard
					title="Alertas de IA"
					value="5"
					icon={<AlertCircle className="size-5" />}
					trend="Discrepancias detectadas"
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Proximas Audiencias */}
				<div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
					<h3 className="mb-4 font-bold text-lg">Próximas Audiencias</h3>
					<p className="text-on-surface-variant text-sm italic">
						No hay audiencias programadas para las próximas horas.
					</p>
				</div>

				{/* Actividad Reciente */}
				<div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
					<h3 className="mb-4 font-bold text-lg">Actividad Reciente</h3>
					<p className="text-on-surface-variant text-sm italic">
						Has revisado 3 expedientes en la última sesión.
					</p>
				</div>
			</div>
		</div>
	);
}

function StatCard({
	title,
	value,
	icon,
	trend,
}: {
	title: string;
	value: string;
	icon: React.ReactNode;
	trend: string;
}) {
	return (
		<main className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
			<div className="mb-2 flex items-center justify-between">
				<span className="text-on-surface-variant">{icon}</span>
			</div>
			<div className="space-y-1">
				<p className="font-bold text-2xl text-primary">{value}</p>
				<p className="font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
					{title}
				</p>
				<p className="font-medium text-[10px] text-primary">{trend}</p>
			</div>
		</main>
	);
}
