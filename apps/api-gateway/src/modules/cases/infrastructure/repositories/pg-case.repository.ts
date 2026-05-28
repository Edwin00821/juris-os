import { user } from "@juris-os/db/schema/auth.schema";
import { type CaseRecord, cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import {
	aliasedTable,
	and,
	count,
	desc,
	eq,
	getTableColumns,
	inArray,
	isNotNull,
	isNull,
} from "drizzle-orm";
import type { CreateCaseDto } from "../../application/dtos/create-case.dto";
import type { CaseCategory } from "../../domain/case.types";
import type {
	ICaseRepository,
	JudgeCaseRow,
	PaginatedResult,
	PaginationParams,
} from "./case.repository";
import { generateCaseNumber } from "./case-number.generator";

const judgeUser = aliasedTable(user, "judge_user");

export class PgCaseRepository implements ICaseRepository {
	async create(userId: string, dto: CreateCaseDto): Promise<CaseRecord> {
		const { caseNumber, sequenceNumber, year } = await generateCaseNumber(
			dto.category as CaseCategory,
		);

		const [record] = await db
			.insert(cases)
			.values({
				userId,
				caseNumber,
				sequenceNumber,
				year,
				title: dto.title,
				description: dto.description,
				category: dto.category as CaseCategory,
				incidentDate: dto.incidentDate,
				counterpartyName: dto.counterpartyName || null,
				counterpartyAddress: dto.counterpartyAddress || null,
				counterpartyId: dto.counterpartyId || null,
				status: "OPEN",
			})
			.returning();

		return record as CaseRecord;
	}

	async findById(id: string, userId: string): Promise<CaseRecord | null> {
		const record = await db.query.cases.findFirst({
			where: and(eq(cases.id, id), eq(cases.userId, userId)),
		});
		return (record as CaseRecord) ?? null;
	}

	async findByCaseNumber(caseNumber: string): Promise<CaseRecord | null> {
		const record = await db.query.cases.findFirst({
			where: and(eq(cases.caseNumber, caseNumber)),
		});
		return (record as CaseRecord) ?? null;
	}

	async findAllByUser(
		userId: string,
		{ page, pageSize, status }: PaginationParams,
	): Promise<PaginatedResult<CaseRecord>> {
		const offset = (page - 1) * pageSize;

		const where = status
			? and(eq(cases.userId, userId), eq(cases.status, status))
			: eq(cases.userId, userId);

		const [records, countResult] = await Promise.all([
			db.query.cases.findMany({
				where,
				orderBy: (cases, { desc }) => [desc(cases.createdAt)],
				limit: pageSize,
				offset,
			}),
			db.select({ total: count() }).from(cases).where(where),
		]);

		return {
			data: records as CaseRecord[],
			totalCount: Number(countResult[0]?.total ?? 0),
		};
	}

	async findAll({
		page,
		pageSize,
		status,
		assigned,
	}: PaginationParams): Promise<PaginatedResult<CaseRecord>> {
		const offset = (page - 1) * pageSize;

		const conditions = [
			status
				? status === "OPEN"
					? and(eq(cases.status, status), isNull(cases.judgeId))
					: eq(cases.status, status)
				: undefined,
			assigned === true ? isNotNull(cases.judgeId) : undefined,
			assigned === false ? isNull(cases.judgeId) : undefined,
		].filter(Boolean) as Parameters<typeof and>;

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [records, countResult] = await Promise.all([
			db.query.cases.findMany({
				where,
				orderBy: (cases, { desc }) => [desc(cases.createdAt)],
				limit: pageSize,
				offset,
			}),
			db.select({ total: count() }).from(cases).where(where),
		]);

		return {
			data: records as CaseRecord[],
			totalCount: Number(countResult[0]?.total ?? 0),
		};
	}

	async findAllByJudge(
		judgeId: string,
		{ page, pageSize, closed }: PaginationParams,
	): Promise<PaginatedResult<JudgeCaseRow>> {
		const offset = (page - 1) * pageSize;

		const where = closed
			? and(eq(cases.judgeId, judgeId), eq(cases.status, "CLOSED"))
			: and(
					eq(cases.judgeId, judgeId),
					inArray(cases.status, ["UNDER_REVIEW", "PENDING_RESOLUTION"]),
				);

		const [records, countResult] = await Promise.all([
			db
				.select({
					...getTableColumns(cases),
					plaintiffName: user.name,
					judgeName: judgeUser.name,
				})
				.from(cases)
				.leftJoin(user, eq(cases.userId, user.id))
				.leftJoin(judgeUser, eq(cases.judgeId, judgeUser.id))
				.where(where)
				.orderBy(desc(cases.createdAt))
				.limit(pageSize)
				.offset(offset),
			db.select({ total: count() }).from(cases).where(where),
		]);

		return {
			data: records.map((r) => ({
				...r,
				plaintiffName: r.plaintiffName ?? "Desconocido",
				judgeName: r.judgeName ?? null,
			})) as JudgeCaseRow[],
			totalCount: Number(countResult[0]?.total ?? 0),
		};
	}

	async findDetailByCaseNumber(
		caseNumber: string,
	): Promise<JudgeCaseRow | null> {
		const records = await db
			.select({
				...getTableColumns(cases),
				plaintiffName: user.name,
				judgeName: judgeUser.name,
			})
			.from(cases)
			.leftJoin(user, eq(cases.userId, user.id))
			.leftJoin(judgeUser, eq(cases.judgeId, judgeUser.id))
			.where(eq(cases.caseNumber, caseNumber))
			.limit(1);

		const record = records[0];
		if (!record) return null;

		return {
			...record,
			plaintiffName: record.plaintiffName ?? "Desconocido",
			judgeName: record.judgeName ?? null,
		} as JudgeCaseRow;
	}

	async assignJudge(caseId: string, judgeId: string): Promise<void> {
		await db
			.update(cases)
			.set({
				judgeId,
				status: "UNDER_REVIEW",
				updatedAt: new Date(),
			})
			.where(eq(cases.id, caseId));
	}
}
