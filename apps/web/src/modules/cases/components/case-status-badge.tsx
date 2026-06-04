import type { CaseStatus } from "../types/case.types";

interface CaseStatusBadgeProps {
	status: CaseStatus;
}

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
	const styles: Record<CaseStatus, string> = {
		OPEN: "bg-primary-fixed text-on-primary-fixed",
		UNDER_REVIEW: "bg-secondary-container text-on-secondary-container",
		PENDING_RESOLUTION: "bg-error-container text-error-container-foreground",
		CLOSED: "bg-tertiary-container text-on-tertiary-container",
	};

	const labels: Record<CaseStatus, string> = {
		OPEN: "Abierto",
		UNDER_REVIEW: "En Revisión",
		PENDING_RESOLUTION: "Resolución Pendiente",
		CLOSED: "Cerrado",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-tight ${styles[status]}`}
		>
			{labels[status]}
		</span>
	);
}
