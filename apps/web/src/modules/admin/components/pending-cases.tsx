"use client";

import { Badge } from "@juris-os-/ui/components/badge";
import { Clock, FileText, Inbox } from "lucide-react";
import { MOCK_CASES } from "@/modules/admin/constants/mock-data";

export function PendingCases() {
	return (
		<div className="space-y-4 lg:col-span-7">
			<div className="mb-2 flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-bold text-primary text-xl">
					<Inbox className="size-5" />
					Asignaciones de Casos Pendientes
				</h2>
				<Badge variant="error">3 Urgentes</Badge>
			</div>

			<div className="flex flex-col gap-4">
				{MOCK_CASES.map((caseItem) => (
					<div
						key={caseItem.id}
						className={[
							"flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-sm transition-all",
							caseItem.priority === "normal"
								? "opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
								: "",
						].join(" ")}
					>
						<div className="flex items-start justify-between">
							<div>
								<span className="font-bold text-on-surface-variant text-xs uppercase tracking-widest">
									Ref. del Caso: {caseItem.id}
								</span>
								<h3 className="mt-1 font-bold text-lg text-primary leading-tight">
									{caseItem.title}
								</h3>
							</div>
							<Badge variant="tag">{caseItem.tag}</Badge>
						</div>
						<div className="flex items-center gap-4 text-on-surface-variant text-sm">
							<span className="flex items-center gap-1">
								<Clock className="size-4" />
								Presentado hace {caseItem.time}
							</span>
							<span className="flex items-center gap-1">
								<FileText className="size-4" />
								{caseItem.docs} Docs
							</span>
						</div>
						{caseItem.priority === "urgent" && (
							<div className="flex gap-2 pt-2">
								<button
									type="button"
									className="flex-1 rounded-lg bg-primary py-2 font-bold text-primary-foreground text-sm shadow-sm hover:opacity-90"
								>
									Revisar Archivos
								</button>
								<button
									type="button"
									className="flex-1 rounded-lg border-2 border-primary py-2 font-bold text-primary text-sm transition-all hover:bg-primary hover:text-primary-foreground"
								>
									Asignación Manual
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
