import { user } from "@juris-os/db/schema/auth.schema";
import { cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import { and, eq, max } from "drizzle-orm";

export type InternalCaseStatus =
	| "DRAFT"
	| "OPEN"
	| "UNDER_REVIEW"
	| "PENDING_RESOLUTION"
	| "CLOSED"
	| "ERROR";

export type CaseCategory = "criminal" | "family" | "labor";
export type AiMode = "AI_ASSISTED" | "MANUAL";

const CATEGORY_PREFIX: Record<CaseCategory, string> = {
	criminal: "CRM",
	family: "FAM",
	labor: "LAB",
};

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

const SEED_CASES: {
	title: string;
	description: string;
	category: CaseCategory;
	incidentDate: string;
	counterpartyName: string;
	status: InternalCaseStatus;
	userEmail: string;
}[] = [
	{
		title: "Demanda por Despido Injustificado",
		description:
			"El empleado alega despido sin causa justificada y falta de pago de liquidación.",
		category: "labor",
		incidentDate: "2024-10-01",
		counterpartyName: "CloudCorp Logistics S.A.",
		status: "OPEN",
		userEmail: "citizen@juris-os.com",
	},
	{
		title: "Divorcio por Mutuo Consentimiento",
		description: "Acuerdo de separación de bienes y custodia compartida.",
		category: "family",
		incidentDate: "2024-09-05",
		counterpartyName: "Cónyuge",
		status: "UNDER_REVIEW",
		userEmail: "citizen@juris-os.com",
	},
	{
		title: "Estado vs. Martínez",
		description: "Defensa penal por cargos de fraude menor.",
		category: "criminal",
		incidentDate: "2024-11-20",
		counterpartyName: "Ministerio Público",
		status: "PENDING_RESOLUTION",
		userEmail: "citizen@juris-os.com",
	},
	{
		title: "Disputa Contractual: Autónomo",
		description:
			"Falta de pago por servicios de desarrollo de software (clasificado como materia laboral).",
		category: "labor",
		incidentDate: "2024-12-01",
		counterpartyName: "Startup XYZ",
		status: "OPEN",
		userEmail: "citizen@juris-os.com",
	},
];

export async function runCasesSeed() {
	console.log("📁 Creating seed cases...\n");

	for (const caseData of SEED_CASES) {
		try {
			const foundUsers = await db
				.select()
				.from(user)
				.where(eq(user.email, caseData.userEmail))
				.limit(1);

			const foundUser = foundUsers[0];

			if (!foundUser) {
				console.log(
					`  ⏭️  User not found: ${caseData.userEmail} — run auth seed first`,
				);
				continue;
			}

			const { caseNumber, sequenceNumber, year } = await generateCaseNumber(
				caseData.category,
			);

			await db.insert(cases).values({
				userId: foundUser.id,
				caseNumber,
				sequenceNumber,
				year,
				title: caseData.title,
				description: caseData.description,
				category: caseData.category,
				incidentDate: caseData.incidentDate,
				counterpartyName: caseData.counterpartyName,
				status: caseData.status,
			});

			console.log(`  ✅ [${caseNumber}] ${caseData.title}`);
		} catch (error: unknown) {
			const err = error as { message?: string; code?: string };
			if (err?.message?.includes("unique") || err?.code === "23505") {
				console.log(`  ⏭️  Already exists: ${caseData.title}`);
			} else {
				console.error(`  ❌ Error creating "${caseData.title}":`, err?.message);
				throw error;
			}
		}
	}

	console.log(`\n  📊 Total: ${SEED_CASES.length} cases processed`);
}
