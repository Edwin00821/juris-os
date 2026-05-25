"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@juris-os/ui/components/table";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCitizensQuery } from "../hooks/use-citizens-query";
import { PromoteJudgeButton } from "./promote-judge-button";

export function CitizensTable() {
	const [searchQuery] = useQueryState("q", { defaultValue: "" });
	const { data: citizens, isLoading, isError } = useCitizensQuery(searchQuery);

	if (isLoading) {
		return (
			<div className="flex h-32 items-center justify-center text-on-surface-variant">
				<Loader2 className="h-5 w-5 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="m-4 rounded-xl border border-error-container bg-error-container/20 p-4 text-on-error-container text-sm">
				No se pudo cargar el registro de ciudadanos. Intenta recargar la página.
			</div>
		);
	}

	return (
		<div className="custom-scrollbar overflow-x-auto">
			<Table className="w-full text-left">
				<TableHeader className="bg-surface-container font-bold text-on-surface-variant text-xs uppercase tracking-widest">
					<TableRow className="border-none hover:bg-transparent">
						<TableHead className="px-6 py-4">Nombre</TableHead>
						<TableHead className="px-6 py-4">Hash de Identidad</TableHead>
						<TableHead className="px-6 py-4">Estado</TableHead>
						<TableHead className="px-6 py-4">Última Actividad</TableHead>
						<TableHead className="px-6 py-4 text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className="divide-y-0">
					{citizens?.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-24 text-center text-on-surface-variant text-sm"
							>
								No se encontraron ciudadanos.
							</TableCell>
						</TableRow>
					) : (
						citizens?.map((citizen) => (
							<TableRow
								key={citizen.id}
								className="border-none bg-surface-container-lowest transition-colors hover:bg-surface-container"
							>
								<TableCell className="flex items-center gap-3 px-6 py-4 font-medium text-on-surface">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed font-bold text-primary-container text-xs">
										{citizen.initials}
									</div>
									{citizen.name}
								</TableCell>
								<TableCell className="px-6 py-4 font-mono text-xs">
									{citizen.hash}
								</TableCell>
								<TableCell className="px-6 py-4">
									<span
										className={
											citizen.status === "Verificado"
												? "rounded-full bg-primary-fixed px-3 py-1 font-bold text-primary-container text-xs uppercase tracking-tighter"
												: "rounded-full bg-secondary-container px-3 py-1 font-bold text-xs uppercase tracking-tighter"
										}
									>
										{citizen.status}
									</span>
								</TableCell>
								<TableCell className="px-6 py-4 text-sm">
									{citizen.lastActivity}
								</TableCell>
								<TableCell className="px-6 py-4 text-right">
									<PromoteJudgeButton
										userId={citizen.id}
										isVerified={citizen.status === "Verificado"}
									/>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
