export type JudgeStatus = "optimal" | "alert" | "overloaded";

function deriveJudgeStatus(activeCases: number): JudgeStatus {
	if (activeCases <= 3) return "optimal";
	if (activeCases <= 7) return "alert";
	return "overloaded";
}

export interface JudgePerformanceDto {
	id: string;
	name: string;
	email: string;
	initials: string;
	activeCases: number;
	closedInPeriod: number;
	avgDays: number;
	status: JudgeStatus;
}

export interface StatusDistributionDto {
	status: string;
	count: number;
	percentage: number;
}

export interface MonthlyVolumeDto {
	month: string;
	count: number;
}

export interface DashboardDto {
	kpis: {
		totalCases: number;
		pendingAssignment: number;
		underReview: number;
		closedInPeriod: number;
		activeJudges: number;
		totalCasesTrendPct: number;
		admissionRate: number;
		avgResolutionDays: number;
	};
	statusDistribution: StatusDistributionDto[];
	monthlyVolume: MonthlyVolumeDto[];
	judgesPerformance: JudgePerformanceDto[];
}

const MONTH_NAMES = [
	"Ene",
	"Feb",
	"Mar",
	"Abr",
	"May",
	"Jun",
	"Jul",
	"Ago",
	"Sep",
	"Oct",
	"Nov",
	"Dic",
];

export function buildDashboardDto(raw: {
	kpis: {
		totalCases: number;
		pendingAssignment: number;
		underReview: number;
		closedInPeriod: number;
	};
	prevKpis: {
		totalCases: number;
	};
	activeJudges: number;
	statusDistribution: { status: string; count: number }[];
	monthlyVolume: { month: number; count: number }[];
	judgesPerformance: {
		id: string;
		name: string;
		email: string;
		activeCases: number;
		closedInPeriod: number;
		avgDays: number;
	}[];
}): DashboardDto {
	const total = raw.statusDistribution.reduce((sum, r) => sum + r.count, 0);

	const totalCasesTrendPct =
		raw.prevKpis.totalCases > 0
			? Math.round(
					((raw.kpis.totalCases - raw.prevKpis.totalCases) /
						raw.prevKpis.totalCases) *
						100,
				)
			: 0;

	const admissionRate =
		raw.kpis.totalCases > 0
			? Math.round((raw.kpis.closedInPeriod / raw.kpis.totalCases) * 1000) / 10
			: 0;

	const avgResolutionDays =
		raw.judgesPerformance.length > 0
			? Math.round(
					raw.judgesPerformance.reduce((sum, j) => sum + j.avgDays, 0) /
						raw.judgesPerformance.length,
				)
			: 0;

	return {
		kpis: {
			...raw.kpis,
			activeJudges: raw.activeJudges,
			totalCasesTrendPct,
			admissionRate,
			avgResolutionDays,
		},
		statusDistribution: raw.statusDistribution.map((r) => ({
			status: r.status,
			count: r.count,
			percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
		})),
		monthlyVolume: raw.monthlyVolume.map((r) => ({
			month: MONTH_NAMES[r.month - 1] ?? String(r.month),
			count: r.count,
		})),
		judgesPerformance: raw.judgesPerformance.map((j) => ({
			...j,
			initials: j.name.slice(0, 2).toUpperCase(),
			status: deriveJudgeStatus(j.activeCases),
		})),
	};
}
