"use client";

import { Badge } from "@juris-os-/ui/components/badge";
import { Input } from "@juris-os-/ui/components/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@juris-os-/ui/components/table";
import { ArrowUpCircle, Search } from "lucide-react";
import { MOCK_CITIZENS } from "@/modules/admin/constants/mock-data";

export function CitizenRegistry() {
	return (
		<section className="overflow-hidden rounded-xl bg-surface-container-lowest p-1 shadow-sm">
			<div className="flex items-center justify-between bg-surface-container-low px-6 py-4">
				<h2 className="font-bold text-lg text-primary">Registro Ciudadano</h2>
				<div className="relative w-64">
					<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
					<Input
						variant="search"
						placeholder="Buscar ciudadanos..."
						className="pl-10"
					/>
				</div>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nombre</TableHead>
						<TableHead>Hash de Identidad</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Última Actividad</TableHead>
						<TableHead className="text-right">
							Acciones Administrativas
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{MOCK_CITIZENS.map((citizen) => (
						<TableRow key={citizen.id}>
							<TableCell className="flex items-center gap-3 font-medium text-on-surface">
								<div
									className={`flex size-8 items-center justify-center rounded-full font-bold text-xs ${citizen.color}`}
								>
									{citizen.id}
								</div>
								{citizen.name}
							</TableCell>
							<TableCell className="font-mono text-on-surface-variant text-xs">
								{citizen.hash}
							</TableCell>
							<TableCell>
								<Badge variant={citizen.isPending ? "secondary" : "default"}>
									{citizen.status}
								</Badge>
							</TableCell>
							<TableCell className="text-on-surface-variant text-sm">
								{citizen.time}
							</TableCell>
							<TableCell className="text-right">
								<button
									type="button"
									disabled={citizen.isPending}
									className="ml-auto flex items-center gap-1 font-bold text-primary text-xs hover:underline disabled:cursor-not-allowed disabled:text-on-surface-variant disabled:hover:no-underline"
								>
									<ArrowUpCircle className="size-4" />
									Elevar a Juez
								</button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</section>
	);
}
