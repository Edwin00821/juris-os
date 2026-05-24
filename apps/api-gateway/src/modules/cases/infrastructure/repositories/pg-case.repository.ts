import { cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import { and, count, eq } from "drizzle-orm";
import type { CreateCaseDto } from "../../application/dtos/create-case.dto";
import type { CaseCategory } from "../../domain/case.types";
import type {
	CaseRecord,
	ICaseRepository,
	PaginatedResult,
	PaginationParams,
} from "./case.repository";
import { generateCaseNumber } from "./case-number.generator";

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

	async findByCaseNumber(
		caseNumber: string,
		userId: string,
	): Promise<CaseRecord | null> {
		const record = await db.query.cases.findFirst({
			where: and(eq(cases.caseNumber, caseNumber), eq(cases.userId, userId)),
		});
		return (record as CaseRecord) ?? null;
	}

	async findAllByUser(
		userId: string,
		{ page, pageSize }: PaginationParams,
	): Promise<PaginatedResult<CaseRecord>> {
		const offset = (page - 1) * pageSize;

		const [records, countResult] = await Promise.all([
			db.query.cases.findMany({
				where: eq(cases.userId, userId),
				orderBy: (cases, { desc }) => [desc(cases.createdAt)],
				limit: pageSize,
				offset,
			}),
			db.select({ total: count() }).from(cases).where(eq(cases.userId, userId)),
		]);

		const total = countResult[0]?.total ?? 0;

		return {
			data: records as CaseRecord[],
			totalCount: Number(total),
		};
	}
}
