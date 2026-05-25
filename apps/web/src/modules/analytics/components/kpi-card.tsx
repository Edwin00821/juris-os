import { cn } from "@juris-os/ui/lib/utils";
import type { KpiData } from "../hooks/use-dashboard-analytics";

const accentMap: Record<KpiData["accentColor"], string> = {
	primary: "border-l-[#002045]",
	secondary: "border-l-[#515f74]",
	warning: "border-l-[#adc7f7]",
	danger: "border-l-[#ba1a1a]",
};

const valueColorMap: Record<KpiData["accentColor"], string> = {
	primary: "text-[#002045]",
	secondary: "text-[#39608a]",
	warning: "text-[#002045]",
	danger: "text-[#93000a]",
};

interface KpiCardProps {
	kpi: KpiData;
}

export function KpiCard({ kpi }: KpiCardProps) {
	const { Icon, text, color } = kpi.trend;

	return (
		<div
			className={cn(
				"rounded-xl border-l-4 bg-white p-6 shadow-sm",
				accentMap[kpi.accentColor],
			)}
		>
			<p className="mb-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
				{kpi.label}
			</p>
			<h3
				className={cn(
					"font-[Manrope,sans-serif] font-extrabold text-4xl tracking-tighter",
					valueColorMap[kpi.accentColor],
				)}
			>
				{kpi.value}
			</h3>
			<p
				className={cn(
					"mt-2 flex items-center gap-1 font-medium text-sm",
					color,
				)}
			>
				<Icon className="size-4 shrink-0" />
				{text}
			</p>
		</div>
	);
}
