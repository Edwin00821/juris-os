"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@juris-os/ui/components/table";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

import { useActiveCases } from "../hooks/use-active-cases";
import { useCaseTableParams } from "../hooks/use-case-table-params";
import type { Case } from "../types/case.types";

import { CaseStatusBadge } from "./case-status-badge";

export function ActiveCasesTable() {
	const { page, pageSize, setPagination } = useCaseTableParams();

	const { data, isLoading, isFetching } = useActiveCases({ page, pageSize });

	const columns = useMemo<ColumnDef<Case>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID Digital",
				cell: (info) => (
					<span className="font-mono text-primary text-sm">
						{info.getValue() as string}
					</span>
				),
			},
			{
				accessorKey: "title",
				header: "Título del Asunto",
				cell: (info) => (
					<span className="font-semibold text-sm">
						{info.getValue() as string}
					</span>
				),
			},
			{
				accessorKey: "registrationDate",
				header: "Fecha de Registro",
				cell: (info) => (
					<span className="text-on-surface-variant text-sm">
						{info.getValue() as string}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "Estado",
				cell: (info) => (
					<CaseStatusBadge status={info.getValue() as Case["status"]} />
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: data?.data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		pageCount: data?.totalPages ?? -1,
	});

	return (
		<div className="overflow-hidden rounded-md bg-surface-container-lowest p-6">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<h3 className="font-bold font-headline text-primary">
						Libro Mayor de Casos Activos
					</h3>
					{isFetching && (
						<span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
					)}
				</div>
				<button
					type="button"
					className="flex items-center gap-1 font-semibold text-primary text-sm transition-opacity hover:opacity-80"
				>
					Ver Archivos <ArrowRight className="size-4" />
				</button>
			</div>

			<div className="overflow-x-auto">
				<Table className="w-full border-collapse text-left">
					<TableHeader className="border-outline-variant border-b">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="bg-surface-container font-label text-[10px] text-on-surface-variant uppercase tracking-wider"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-on-surface-variant text-sm"
								>
									Cargando registros...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="cursor-pointer border-outline-variant/50 border-b transition-colors last:border-0 hover:bg-surface-container"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-on-surface-variant text-sm"
								>
									No se encontraron casos activos.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="mt-6 flex items-center justify-between border-outline-variant border-t pt-4">
				<span className="text-on-surface-variant text-xs">
					Mostrando página{" "}
					<span className="font-semibold text-primary">{page}</span> de{" "}
					<span className="font-semibold text-primary">
						{data?.totalPages ?? 1}
					</span>
				</span>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setPagination({ page: page - 1 })}
						disabled={page === 1}
						className="rounded-md p-1.5 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
					>
						<ChevronLeft className="size-4 text-on-surface-variant" />
					</button>
					<button
						type="button"
						onClick={() => setPagination({ page: page + 1 })}
						disabled={page === (data?.totalPages ?? 1)}
						className="rounded-md p-1.5 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
					>
						<ChevronRight className="size-4 text-on-surface-variant" />
					</button>
				</div>
			</div>
		</div>
	);
}
