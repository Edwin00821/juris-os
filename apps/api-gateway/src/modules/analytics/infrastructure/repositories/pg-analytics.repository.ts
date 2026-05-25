import { user } from "@juris-os/db/schema/auth.schema";
import { cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import { and, count, eq, gte, isNull, lte, sql } from "drizzle-orm";
import type { CaseCategory } from "../../../cases/domain/case.types";

export interface DashboardParams {
	from: Date;
	to: Date;
	category?: CaseCategory;
}

export interface JudgePerformanceRow {
	id: string;
	name: string;
	email: string;
	activeCases: number;
	closedInPeriod: number;
	avgDays: number;
}

export interface StatusDistributionRow {
	status: string;
	count: number;
}

export interface MonthlyVolumeRow {
	month: number;
	count: number;
}

export interface KpiRow {
	totalCases: number;
	pendingAssignment: number;
	underReview: number;
	closedInPeriod: number;
}

export class PgAnalyticsRepository {
	async getKpis({ from, to, category }: DashboardParams): Promise<KpiRow> {
		const categoryFilter = category ? eq(cases.category, category) : undefined;
		const periodFilter = and(
			gte(cases.createdAt, from),
			lte(cases.createdAt, to),
		);
		const baseWhere = and(periodFilter, categoryFilter);

		const [total, pending, reviewing, closed] = await Promise.all([
			db.select({ c: count() }).from(cases).where(baseWhere),
			db
				.select({ c: count() })
				.from(cases)
				.where(and(baseWhere, isNull(cases.judgeId))),
			db
				.select({ c: count() })
				.from(cases)
				.where(and(baseWhere, eq(cases.status, "UNDER_REVIEW"))),
			db
				.select({ c: count() })
				.from(cases)
				.where(and(baseWhere, eq(cases.status, "CLOSED"))),
		]);

		return {
			totalCases: Number(total[0]?.c ?? 0),
			pendingAssignment: Number(pending[0]?.c ?? 0),
			underReview: Number(reviewing[0]?.c ?? 0),
			closedInPeriod: Number(closed[0]?.c ?? 0),
		};
	}

	async getActiveJudgesCount(): Promise<number> {
		const result = await db
			.select({ c: count() })
			.from(user)
			.where(eq(user.role, "judge"));
		return Number(result[0]?.c ?? 0);
	}

	async getStatusDistribution({
		from,
		to,
		category,
	}: DashboardParams): Promise<StatusDistributionRow[]> {
		const categoryFilter = category ? eq(cases.category, category) : undefined;

		return db
			.select({
				status: cases.status,
				count: sql<number>`cast(count(*) as int)`,
			})
			.from(cases)
			.where(
				and(
					gte(cases.createdAt, from),
					lte(cases.createdAt, to),
					categoryFilter,
				),
			)
			.groupBy(cases.status);
	}

	async getMonthlyVolume(year: number): Promise<MonthlyVolumeRow[]> {
		return db
			.select({
				month: sql<number>`cast(extract(month from ${cases.createdAt}) as int)`,
				count: sql<number>`cast(count(*) as int)`,
			})
			.from(cases)
			.where(sql`extract(year from ${cases.createdAt}) = ${year}`)
			.groupBy(sql`extract(month from ${cases.createdAt})`)
			.orderBy(sql`extract(month from ${cases.createdAt})`);
	}

	async getJudgesPerformance({
		from,
		to,
	}: DashboardParams): Promise<JudgePerformanceRow[]> {
		const fromIso = from.toISOString();
		const toIso = to.toISOString();

		return db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				activeCases: sql<number>`cast(count(case when ${cases.status} = 'UNDER_REVIEW' then 1 end) as int)`,
				closedInPeriod: sql<number>`cast(count(case when ${cases.status} = 'CLOSED' and ${cases.updatedAt} >= ${fromIso}::timestamptz and ${cases.updatedAt} <= ${toIso}::timestamptz then 1 end) as int)`,
				avgDays: sql<number>`coalesce(round(avg(case when ${cases.status} = 'CLOSED' then extract(epoch from (${cases.updatedAt} - ${cases.createdAt})) / 86400 end))::int, 0)`,
			})
			.from(user)
			.leftJoin(cases, eq(cases.judgeId, user.id))
			.where(eq(user.role, "judge"))
			.groupBy(user.id, user.name, user.email);
	}
}
