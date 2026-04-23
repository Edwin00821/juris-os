import { Badge } from "@juris-os-/ui/components/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@juris-os-/ui/components/table";
import { ArrowRight } from "lucide-react";

const ACTIVE_CASES = [
	{
		id: "DR-2024-0012",
		title: "Vane vs. CloudCorp Logistics",
		date: "12 Oct, 2024",
		status: "Abierto",
		statusVariant: "default" as const,
	},
	{
		id: "JD-2023-8902",
		title: "Revisión de Límites de Propiedad",
		date: "05 Sep, 2024",
		status: "En Revisión",
		statusVariant: "secondary" as const,
	},
	{
		id: "TX-2024-0441",
		title: "Evaluación de Impuestos Municipales",
		date: "22 Nov, 2024",
		status: "Resolución Pendiente",
		statusVariant: "error" as const,
	},
	{
		id: "DR-2024-0015",
		title: "Disputa Contractual: Autónomo",
		date: "01 Dic, 2024",
		status: "Abierto",
		statusVariant: "default" as const,
	},
];

export function ActiveCasesLedger() {
	return (
		<div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-6">
			<div className="mb-6 flex items-center justify-between">
				<h3 className="font-bold font-headline text-primary">
					Libro Mayor de Casos Activos
				</h3>
				<button
					type="button"
					className="flex items-center gap-1 font-semibold text-primary text-sm"
				>
					Ver Archivos <ArrowRight className="size-4" />
				</button>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="border-none hover:bg-transparent">
						<TableHead>ID Digital</TableHead>
						<TableHead>Título del Asunto</TableHead>
						<TableHead>Fecha de Registro</TableHead>
						<TableHead>Estado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ACTIVE_CASES.map((caseItem) => (
						<TableRow
							key={caseItem.id}
							className="cursor-pointer border-surface-container-low"
						>
							<TableCell className="font-mono text-primary text-sm">
								{caseItem.id}
							</TableCell>
							<TableCell className="font-semibold text-sm">
								{caseItem.title}
							</TableCell>
							<TableCell className="text-on-surface-variant text-sm">
								{caseItem.date}
							</TableCell>
							<TableCell>
								<Badge variant={caseItem.statusVariant}>
									{caseItem.status}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
