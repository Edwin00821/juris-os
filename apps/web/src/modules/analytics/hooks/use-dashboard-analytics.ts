import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export type PeriodFilter = "30d" | "quarterly" | "annual";
export type CategoryFilter = "all" | "criminal" | "family" | "labor";
export type JudgeStatus = "optimal" | "alert" | "overloaded";

export interface KpiData {
	label: string;
	value: string;
	trend: {
		Icon: LucideIcon;
		text: string;
		color: string;
	};
	accentColor: "primary" | "secondary" | "warning" | "danger";
}

export interface MonthlyVolume {
	month: string;
	count: number;
}

export interface StatusDistribution {
	status: string;
	count: number;
	percentage: number;
}

export interface JudgePerformance {
	id: string;
	initials: string;
	name: string;
	email: string;
	activeCases: number;
	closedInPeriod: number;
	avgDays: number;
	status: JudgeStatus;
}

export interface DashboardData {
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
	statusDistribution: StatusDistribution[];
	monthlyVolume: MonthlyVolume[];
	judgesPerformance: JudgePerformance[];
}

interface DashboardApiResponse {
	success: true;
	data: DashboardData;
}

async function fetchDashboard(
	period: PeriodFilter,
	category: CategoryFilter,
	date?: string,
): Promise<DashboardData> {
	const params = new URLSearchParams({ period });
	if (category !== "all") params.set("category", category);
	if (date) params.set("from", date);
	const res = await apiClient<DashboardApiResponse>(
		`/analytics/dashboard?${params.toString()}`,
	);
	return res.data;
}

export function useDashboardAnalytics(
	period: PeriodFilter,
	category: CategoryFilter,
	date?: string,
) {
	return useQuery({
		queryKey: ["dashboard-analytics", period, category, date],
		queryFn: () => fetchDashboard(period, category, date),
		staleTime: 1000 * 60 * 5,
	});
}
