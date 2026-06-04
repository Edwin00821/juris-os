import { user } from "@juris-os/db/schema/auth.schema";
import { cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import { and, eq, sql } from "drizzle-orm";
import type { JudgeResponseDto } from "../../application/dtos/user.response.dto";

export class PgUserRepository {
	async listJudges(): Promise<JudgeResponseDto[]> {
		return db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				specialty: user.specialty,
				activeCases: sql<number>`cast(count(${cases.id}) as int)`,
			})
			.from(user)
			.leftJoin(
				cases,
				and(eq(cases.judgeId, user.id), eq(cases.status, "UNDER_REVIEW")),
			)
			.where(eq(user.role, "judge"))
			.groupBy(user.id, user.name, user.email, user.specialty);
	}
}
