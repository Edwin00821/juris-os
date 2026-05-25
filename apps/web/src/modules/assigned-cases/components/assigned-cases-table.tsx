"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@juris-os/ui/components/table";
import { cn } from "@juris-os/ui/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, UserX } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useAssignCaseTableParams } from "@/modules/case-assignment/hooks/use-assign-case-table-params";
import { useAvailableJudges } from "@/modules/case-assignment/hooks/use-available-judges";
import { useAssignedCases } from "../hooks/use-assigned-cases";

const CATEGORY_LABELS: Record<string, string> = {
	criminal: "Penal",
	family: "Familiar",
	labor: "Laboral",
};

const STATUS_LABELS: Record<string, string> = {
	OPEN: "Abierto",
	UNDER_REVIEW: "En revisión",
	PENDING_RESOLUTION: "Pendiente resolución",
	CLOSED: "Cerrado",
};

const STATUS_STYLES: Record<string, string> = {
	OPEN: "bg-blue-100 text-blue-700",
	UNDER_REVIEW: "bg-amber-100 text-amber-700",
	PENDING_RESOLUTION: "bg-purple-100 text-purple-700",
	CLOSED: "bg-green-100 text-green-700",
};

export function AssignedCasesTable() {
	const { page, pageSize, setPagination } = useAssignCaseTableParams();
	const [searchQuery] = useQueryState("q", { defaultValue: "" });

	const { data, isLoading, isError } = useAssignedCases({ page, pageSize });
	const { data: judges } = useAvailableJudges();

	const judgeNameMap = useMemo(() => {
		const map = new Map<string, string>();
		for (const judge of judges ?? []) {
			map.set(judge.id, judge.name);
		}
		return map;
	}, [judges]);

	const cases = data?.data ?? [];

	const filtered = searchQuery
		? cases.filter(
				(c) =>
					c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					c.id.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: cases;

	if (isLoading) {
		return (
			<div className="flex h-48 items-center justify-center text-on-surface-variant">
				<Loader2 className="h-5 w-5 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="m-6 rounded-xl border border-error-container bg-error-container/20 p-5 text-on-error-container text-sm">
				No se pudieron cargar los casos. Intenta recargar la página.
			</div>
		);
	}

	const totalPages = data?.meta?.totalPages ?? 1;
	const totalCount = data?.meta?.totalCount ?? 0;

	return (
		<>
			<div className="custom-scrollbar overflow-x-auto">
				<Table className="w-full border-collapse text-left">
					<TableHeader className="bg-surface-container font-bold text-on-surface-variant text-xs uppercase tracking-widest">
						<TableRow className="border-none hover:bg-transparent">
							<TableHead className="px-6 py-4">Ref. del Caso</TableHead>
							<TableHead className="px-6 py-4">Título del Caso</TableHead>
							<TableHead className="px-6 py-4">Categoría</TableHead>
							<TableHead className="px-6 py-4">Juez Asignado</TableHead>
							<TableHead className="px-6 py-4">Estado</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody className="divide-y-0">
						{filtered.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-32 text-center text-on-surface-variant text-sm"
								>
									No se encontraron casos asignados.
								</TableCell>
							</TableRow>
						) : (
							filtered.map((c, index) => (
								<TableRow
									key={c.id}
									className={cn(
										"border-none transition-colors",
										index % 2 === 0
											? "bg-surface-container-lowest hover:bg-surface-container"
											: "bg-surface-container hover:bg-surface-container-high",
									)}
								>
									<TableCell className="px-6 py-4 font-bold font-mono text-primary text-xs">
										{c.id}
									</TableCell>
									<TableCell className="max-w-xs px-6 py-4 font-medium text-on-surface">
										{c.title}
									</TableCell>
									<TableCell className="px-6 py-4">
										<span className="rounded bg-surface-container-high px-2 py-1 font-semibold text-xs">
											{CATEGORY_LABELS[c.category] ?? c.category}
										</span>
									</TableCell>
									<TableCell className="px-6 py-4">
										{c.judgeId ? (
											<span className="font-medium text-on-surface text-sm">
												{judgeNameMap.get(c.judgeId) ?? c.judgeId}
											</span>
										) : (
											<div className="flex items-center gap-2 text-on-surface-variant">
												<UserX className="h-4 w-4" />
												<span className="text-sm italic">Sin asignar</span>
											</div>
										)}
									</TableCell>
									<TableCell className="px-6 py-4">
										<span
											className={cn(
												"rounded-full px-3 py-1 font-bold text-xs uppercase tracking-tighter",
												STATUS_STYLES[c.status] ??
													"bg-surface-container text-on-surface-variant",
											)}
										>
											{STATUS_LABELS[c.status] ?? c.status}
										</span>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col items-center justify-between gap-2 border-surface-container border-t bg-surface-container-low px-6 py-3 text-xs sm:flex-row">
				<span>
					<strong>{totalCount}</strong> casos en revisión
				</span>
				<div className="flex items-center gap-3">
					<span className="text-on-surface-variant">
						Página {page} de {totalPages}
					</span>
					<div className="flex gap-1">
						<button
							type="button"
							onClick={() => setPagination({ page: page - 1 })}
							disabled={page === 1}
							className="rounded-md p-1.5 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setPagination({ page: page + 1 })}
							disabled={page >= totalPages}
							className="rounded-md p-1.5 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
