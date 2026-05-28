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
import {
	ChevronLeft,
	ChevronRight,
	FileEdit,
	Loader2,
	Search,
} from "lucide-react";
import Link from "next/link";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { CaseMatterBadge } from "../components/case-matter-badge";
import { usePendingCases } from "../hooks/use-cases";
import type { CaseCategory, CasePriority } from "../types";

const PRIORITY_CONFIG: Record<
	CasePriority,
	{ label: string; className: string; dotClass?: string }
> = {
	high: {
		label: "Alta",
		className: "bg-error-container text-error-container-foreground",
		dotClass: "bg-destructive animate-pulse",
	},
	medium: {
		label: "Media",
		className: "bg-secondary-container text-on-secondary-container",
	},
	low: {
		label: "Baja",
		className: "bg-surface-container text-on-surface-variant",
	},
};

const CATEGORY_TABS: { value: CaseCategory | "all"; label: string }[] = [
	{ value: "all", label: "Todos" },
	{ value: "criminal", label: "Penal" },
	{ value: "family", label: "Familiar" },
	{ value: "labor", label: "Laboral" },
];

const waitingColor = (days: number) =>
	days >= 50
		? "text-error-container-foreground font-bold"
		: days >= 30
			? "text-amber-700 font-bold"
			: "text-on-surface-variant font-semibold";

export default function PendingCasesPage() {
	const [params, setParams] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(10),
	});
	const [search, setSearch] = useQueryState("q", { defaultValue: "" });
	const [activeTab, setActiveTab] = useQueryState("cat", {
		defaultValue: "all",
	});

	const { data, isLoading, isError } = usePendingCases({
		page: params.page,
		pageSize: params.pageSize,
	});

	const cases = data?.data ?? [];
	const totalCount = data?.meta?.totalCount ?? 0;
	const totalPages = data?.meta?.totalPages ?? 1;

	const filtered = cases.filter((c) => {
		const matchTab = activeTab === "all" || c.category === activeTab;
		const q = search.toLowerCase();
		const matchSearch =
			!q ||
			c.id.toLowerCase().includes(q) ||
			c.title.toLowerCase().includes(q) ||
			c.plaintiffName.toLowerCase().includes(q) ||
			(c.counterpartyName ?? "").toLowerCase().includes(q);
		return matchTab && matchSearch;
	});

	const highPriorityCount = cases.filter((c) => c.priority === "high").length;
	const pendingResolutionCount = cases.filter(
		(c) => c.status === "PENDING_RESOLUTION",
	).length;
	const avgWaitingDays =
		cases.length > 0
			? Math.round(cases.reduce((s, c) => s + c.waitingDays, 0) / cases.length)
			: 0;

	return (
		<div className="mx-auto max-w-7xl p-8">
			{/* Header */}
			<div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-primary tracking-tight">
						Casos Pendientes
					</h1>
					<p className="mt-1 font-medium text-on-surface-variant">
						Expedientes asignados en espera de resolución judicial.
					</p>
				</div>
				<div className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-sm">
					<Search className="h-4 w-4 text-on-surface-variant" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-56 border-none bg-transparent text-sm placeholder:text-on-surface-variant/50 focus:outline-none"
						placeholder="Buscar por expediente o parte..."
					/>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div className="rounded-xl border-primary border-l-4 bg-surface-container-lowest p-5 shadow-sm">
					<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
						Total Pendientes
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-primary tracking-tighter">
						{totalCount}
					</h3>
					<p className="mt-1 text-on-surface-variant text-xs">
						expedientes activos
					</p>
				</div>
				<div className="rounded-xl border-error-container-foreground border-l-4 bg-surface-container-lowest p-5 shadow-sm">
					<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
						Alta Prioridad
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-error-container-foreground tracking-tighter">
						{highPriorityCount}
					</h3>
					<p className="mt-1 text-on-surface-variant text-xs">
						requieren atención urgente
					</p>
				</div>
				<div className="rounded-xl border-on-surface-variant border-l-4 bg-surface-container-lowest p-5 shadow-sm">
					<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
						Pend. Resolución
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-on-surface tracking-tighter">
						{pendingResolutionCount}
					</h3>
					<p className="mt-1 text-on-surface-variant text-xs">
						listos para sentenciar
					</p>
				</div>
				<div className="rounded-xl border-primary-fixed-dim border-l-4 bg-surface-container-lowest p-5 shadow-sm">
					<p className="mb-1 font-bold text-on-surface-variant text-xs uppercase tracking-widest">
						Días Prom. Espera
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-primary tracking-tighter">
						{cases.length > 0 ? avgWaitingDays : "—"}
					</h3>
					<p className="mt-1 text-on-surface-variant text-xs">
						desde asignación
					</p>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="mb-6 flex items-center gap-2 border-outline-variant/30 border-b pb-1">
				{CATEGORY_TABS.map((tab) => (
					<button
						type="button"
						key={tab.value}
						onClick={() => setActiveTab(tab.value)}
						className={cn(
							"px-4 py-2 text-sm transition-colors",
							activeTab === tab.value
								? "-mb-px border-primary border-b-2 font-bold text-primary"
								: "font-medium text-on-surface-variant hover:text-primary",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
				{isLoading ? (
					<div className="flex h-48 items-center justify-center text-on-surface-variant">
						<Loader2 className="h-5 w-5 animate-spin" />
					</div>
				) : isError ? (
					<div className="m-6 rounded-xl border border-error-container bg-error-container/20 p-5 text-error-container-foreground text-sm">
						No se pudieron cargar los casos. Intenta recargar la página.
					</div>
				) : (
					<Table>
						<TableHeader className="border-outline-variant/20 border-b bg-surface-container">
							<TableRow className="hover:bg-transparent">
								{[
									{ label: "Expediente", align: "" },
									{ label: "Partes Involucradas", align: "" },
									{ label: "Materia", align: "" },
									{ label: "Prioridad", align: "text-center" },
									{ label: "Días Espera", align: "text-center" },
									{ label: "Acción", align: "text-right" },
								].map(({ label, align }) => (
									<TableHead
										key={label}
										className={cn(
											"px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest",
											align,
										)}
									>
										{label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>

						<TableBody>
							{filtered.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-32 text-center text-on-surface-variant text-sm"
									>
										No se encontraron expedientes pendientes.
									</TableCell>
								</TableRow>
							) : (
								filtered.map((c, idx) => {
									const priority =
										PRIORITY_CONFIG[c.priority] ?? PRIORITY_CONFIG.medium;
									return (
										<TableRow
											key={c.id}
											className={cn(
												"border-surface-container border-b transition-colors hover:bg-surface-container-low/60",
												idx % 2 === 1 && "bg-surface-container-low/20",
											)}
										>
											<TableCell className="px-6 py-4">
												<p className="font-bold font-mono text-primary text-sm">
													{c.id}
												</p>
												<p className="mt-0.5 text-on-surface-variant text-xs">
													Asignado:{" "}
													{new Date(c.createdAt).toLocaleDateString("es-MX", {
														day: "2-digit",
														month: "short",
														year: "numeric",
													})}
												</p>
											</TableCell>

											<TableCell className="px-6 py-4">
												<p className="font-semibold text-on-surface text-sm">
													{c.plaintiffName}
												</p>
												<p className="text-on-surface-variant text-xs">
													{c.counterpartyName
														? `vs. ${c.counterpartyName}`
														: "Sin contraparte"}
												</p>
											</TableCell>

											<TableCell className="px-6 py-4">
												<CaseMatterBadge matter={c.category} />
											</TableCell>

											<TableCell className="px-6 py-4 text-center">
												<span
													className={cn(
														"inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold text-xs",
														priority.className,
													)}
												>
													{priority.dotClass && (
														<span
															className={cn(
																"inline-block h-1.5 w-1.5 rounded-full",
																priority.dotClass,
															)}
														/>
													)}
													{priority.label}
												</span>
											</TableCell>

											<TableCell className="px-6 py-4 text-center">
												<span
													className={cn("text-sm", waitingColor(c.waitingDays))}
												>
													{c.waitingDays}
												</span>
											</TableCell>

											<TableCell className="px-6 py-4 text-right">
												<Link
													href={`/judge/cases/${c.id}`}
													className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground text-xs shadow-sm transition-opacity hover:opacity-90"
												>
													<FileEdit className="h-3.5 w-3.5" />
													Abrir Caso
												</Link>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				)}

				{/* Pagination */}
				<div className="flex items-center justify-between border-surface-container border-t bg-surface-container-low/30 px-6 py-4">
					<p className="text-on-surface-variant text-sm">
						Mostrando{" "}
						<span className="font-bold text-on-surface">{filtered.length}</span>{" "}
						de <span className="font-bold text-on-surface">{totalCount}</span>{" "}
						expedientes
					</p>
					<div className="flex items-center gap-2">
						<span className="text-on-surface-variant text-xs">
							Página {params.page} de {totalPages}
						</span>
						<button
							type="button"
							onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
							disabled={params.page === 1}
							className="rounded-lg border border-outline-variant bg-surface-container-lowest p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
							disabled={params.page >= totalPages}
							className="rounded-lg border border-outline-variant bg-surface-container-lowest p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
