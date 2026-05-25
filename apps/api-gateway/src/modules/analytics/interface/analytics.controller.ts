import type { Context } from "hono";
import { ok } from "../../../core/http/response.helper";
import type { CaseCategory } from "../../cases/domain/case.types";
import { buildDashboardDto } from "../application/dtos/dashboard.dto";
import { PgAnalyticsRepository } from "../infrastructure/repositories/pg-analytics.repository";

const repo = new PgAnalyticsRepository();

const VALID_CATEGORIES = new Set(["criminal", "family", "labor"]);

function getPeriodDates(period: string): { from: Date; to: Date } {
	const to = new Date();
	const from = new Date();

	if (period === "quarterly") {
		from.setDate(from.getDate() - 90);
	} else if (period === "annual") {
		from.setFullYear(from.getFullYear() - 1);
	} else {
		from.setDate(from.getDate() - 30);
	}

	return { from, to };
}

function getPrevPeriodDates(from: Date, to: Date): { from: Date; to: Date } {
	const duration = to.getTime() - from.getTime();
	return {
		from: new Date(from.getTime() - duration),
		to: from,
	};
}

export const analyticsController = {
	async dashboard(c: Context) {
		const {
			period = "30d",
			category = "",
			from: fromParam = "",
		} = c.req.query();

		let { from, to } = getPeriodDates(period);
		if (fromParam) {
			const parsed = new Date(fromParam);
			if (!Number.isNaN(parsed.getTime())) from = parsed;
		}
		const validCategory = VALID_CATEGORIES.has(category)
			? (category as CaseCategory)
			: undefined;

		const params = { from, to, category: validCategory };
		const prevDates = getPrevPeriodDates(from, to);
		const prevParams = {
			from: prevDates.from,
			to: prevDates.to,
			category: validCategory,
		};
		const year = new Date().getFullYear();

		const [
			kpis,
			prevKpis,
			activeJudges,
			statusDistribution,
			monthlyVolume,
			judgesPerformance,
		] = await Promise.all([
			repo.getKpis(params),
			repo.getKpis(prevParams),
			repo.getActiveJudgesCount(),
			repo.getStatusDistribution(params),
			repo.getMonthlyVolume(year),
			repo.getJudgesPerformance(params),
		]);

		return ok(
			c,
			buildDashboardDto({
				kpis,
				prevKpis,
				activeJudges,
				statusDistribution,
				monthlyVolume,
				judgesPerformance,
			}),
		);
	},
};
