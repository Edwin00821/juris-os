import { cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import { and, eq, max } from "drizzle-orm";

import type { CaseCategory } from "../../domain/case.types";

const CATEGORY_PREFIX: Record<CaseCategory, string> = {
	criminal: "CRM",
	family: "FAM",
	labor: "LAB",
};

// Generates a human-readable case number: CIV-2025-0001
// Uses MAX(sequence_number) per year to avoid gaps from sequence resets
// and stays race-condition-safe because the unique index on case_number
// will reject concurrent duplicates at the DB level.
export async function generateCaseNumber(category: CaseCategory): Promise<{
	caseNumber: string;
	sequenceNumber: number;
	year: number;
}> {
	const prefix = CATEGORY_PREFIX[category];
	const year = new Date().getFullYear();

	const result = await db
		.select({ maxSeq: max(cases.sequenceNumber) })
		.from(cases)
		.where(and(eq(cases.year, year), eq(cases.category, category)));

	const sequenceNumber = (result[0]?.maxSeq ?? 0) + 1;
	const padded = String(sequenceNumber).padStart(4, "0");
	const caseNumber = `${prefix}-${year}-${padded}`;

	return { caseNumber, sequenceNumber, year };
}
