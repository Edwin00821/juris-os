"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { ChevronLeft, ChevronRight, Eye, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { CaseMatterBadge } from "../components/case-matter-badge";
import { CaseResolutionTypeBadge } from "../components/case-resolution-type-badge";
import { useClosedCases } from "../hooks/use-cases";
import type { CaseResolution } from "../types";

const RESOLUTION_TABS: {
	value: CaseResolution | "all";
	label: string;
}[] = [
	{ value: "all", label: "Todos" },
	{ value: "admitted", label: "Admitidas" },
	{ value: "conditioned", label: "Prevenidas" },
	{ value: "rejected", label: "Rechazadas" },
];

export default function ClosedCasesPage() {
	const [params, setParams] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(10),
	});
	const [search, setSearch] = useQueryState("q", { defaultValue: "" });
	const [activeTab, setActiveTab] = useQueryState("res", {
		defaultValue: "all",
	});

	const { data, isLoading, isError } = useClosedCases({
		page: params.page,
		pageSize: params.pageSize,
	});

	const cases = data?.data ?? [];
	const totalCount = data?.meta?.totalCount ?? 0;
	const totalPages = data?.meta?.totalPages ?? 1;

	const filtered = cases.filter((c) => {
		const matchTab =
			activeTab === "all" || c.resolution === (activeTab as CaseResolution);
		const q = search.toLowerCase();
		const matchSearch =
			!q ||
			c.id.toLowerCase().includes(q) ||
			c.title.toLowerCase().includes(q) ||
			c.plaintiffName.toLowerCase().includes(q) ||
			(c.counterpartyName ?? "").toLowerCase().includes(q);
		return matchTab && matchSearch;
	});

	const admittedCount = cases.filter((c) => c.resolution === "admitted").length;
	const conditionedCount = cases.filter(
		(c) => c.resolution === "conditioned",
	).length;
	const rejectedCount = cases.filter((c) => c.resolution === "rejected").length;

	return (
		<div className="mx-auto max-w-7xl p-8">
			<div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-[#002045] tracking-tight">
						Casos Terminados
					</h1>
					<p className="mt-1 font-medium text-slate-500">
						Expedientes con resolución judicial emitida y sentencia publicada.
					</p>
				</div>
				<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
					<Search className="h-4 w-4 text-slate-400" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-56 border-none bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
						placeholder="Buscar por expediente o parte..."
					/>
				</div>
			</div>

			{/* KPI Row — 4 columns matching HTML design */}
			<div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div className="rounded-xl border-emerald-500 border-l-4 bg-white p-5 shadow-sm">
					<p className="mb-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
						Total Resueltos
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-emerald-700 tracking-tighter">
						{totalCount}
					</h3>
					<p className="mt-1 text-slate-500 text-xs">casos cerrados</p>
				</div>
				<div className="rounded-xl border-[#002045] border-l-4 bg-white p-5 shadow-sm">
					<p className="mb-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
						Admitidas
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-[#002045] tracking-tighter">
						{admittedCount}
					</h3>
					<p className="mt-1 flex items-center gap-1 text-emerald-600 text-xs">
						{totalCount > 0
							? `${Math.round((admittedCount / totalCount) * 100)}% del total`
							: "sin datos"}
					</p>
				</div>
				<div className="rounded-xl border-amber-500 border-l-4 bg-white p-5 shadow-sm">
					<p className="mb-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
						Prevenidas
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-amber-700 tracking-tighter">
						{conditionedCount}
					</h3>
					<p className="mt-1 text-slate-500 text-xs">con condiciones</p>
				</div>
				<div className="rounded-xl border-[#ba1a1a] border-l-4 bg-white p-5 shadow-sm">
					<p className="mb-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
						Rechazadas
					</p>
					<h3 className="font-[Manrope,sans-serif] font-extrabold text-3xl text-[#93000a] tracking-tighter">
						{rejectedCount}
					</h3>
					<p className="mt-1 text-slate-500 text-xs">desestimadas</p>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="mb-6 flex items-center gap-2 border-slate-200 border-b pb-1">
				{RESOLUTION_TABS.map((tab) => (
					<button
						type="button"
						key={tab.value}
						onClick={() => setActiveTab(tab.value)}
						className={cn(
							"px-4 py-2 text-sm transition-colors",
							activeTab === tab.value
								? "-mb-px border-[#002045] border-b-2 font-bold text-[#002045]"
								: "font-medium text-slate-500 hover:text-[#002045]",
						)}
					>
						{tab.label}
						{tab.value !== "all" && (
							<span className="ml-1 text-slate-400">
								(
								{tab.value === "admitted"
									? admittedCount
									: tab.value === "conditioned"
										? conditionedCount
										: rejectedCount}
								)
							</span>
						)}
					</button>
				))}
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-xl bg-white shadow-sm">
				{isLoading ? (
					<div className="flex h-48 items-center justify-center text-slate-400">
						<Loader2 className="h-5 w-5 animate-spin" />
					</div>
				) : isError ? (
					<div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 text-sm">
						No se pudieron cargar los casos. Intenta recargar la página.
					</div>
				) : (
					<table className="w-full text-left">
						<thead>
							<tr className="border-slate-100 border-b bg-slate-50 text-slate-500">
								{[
									"Expediente",
									"Partes Involucradas",
									"Materia",
									"Resolución",
									"Acción",
								].map((col, i) => (
									<th
										key={col}
										className={cn(
											"px-6 py-4 font-bold text-xs uppercase tracking-widest",
											i === 3 ? "text-center" : "",
											i === 4 ? "text-right" : "",
										)}
									>
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{filtered.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="h-32 text-center text-slate-400 text-sm"
									>
										No se encontraron expedientes terminados.
									</td>
								</tr>
							) : (
								filtered.map((c, idx) => (
									<tr
										key={c.id}
										className={cn(
											"transition-colors hover:bg-slate-50/60",
											idx % 2 === 1 && "bg-slate-50/20",
										)}
									>
										<td className="px-6 py-4">
											<p className="font-bold font-mono text-[#002045] text-sm">
												{c.id}
											</p>
											<p className="mt-0.5 text-slate-400 text-xs">
												Cerrado:{" "}
												{new Date(c.createdAt).toLocaleDateString("es-MX", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})}
											</p>
										</td>
										<td className="px-6 py-4">
											<p className="font-semibold text-slate-800 text-sm">
												{c.plaintiffName}
											</p>
											<p className="text-slate-400 text-xs">
												{c.counterpartyName
													? `vs. ${c.counterpartyName}`
													: "Sin contraparte"}
											</p>
										</td>
										<td className="px-6 py-4">
											<CaseMatterBadge matter={c.category} />
										</td>
										<td className="px-6 py-4 text-center">
											<CaseResolutionTypeBadge resolution={c.resolution} />
										</td>
										<td className="px-6 py-4 text-right">
											<Link
												href={`/judge/cases/${c.id}/closed`}
												className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 font-bold text-slate-600 text-xs transition-colors hover:bg-slate-200"
											>
												<Eye className="h-3.5 w-3.5" />
												Ver Sentencia
											</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}

				<div className="flex items-center justify-between border-slate-100 border-t bg-slate-50/30 px-6 py-4">
					<p className="text-slate-500 text-sm">
						Mostrando{" "}
						<span className="font-bold text-slate-800">{filtered.length}</span>{" "}
						de <span className="font-bold text-slate-800">{totalCount}</span>{" "}
						expedientes resueltos
					</p>
					<div className="flex items-center gap-2">
						<span className="text-slate-500 text-xs">
							Página {params.page} de {totalPages}
						</span>
						<button
							type="button"
							onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
							disabled={params.page === 1}
							className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
							disabled={params.page >= totalPages}
							className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
