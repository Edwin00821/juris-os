import { user } from "@juris-os/db/schema/auth.schema";
import { cases } from "@juris-os/db/schema/case.schema";
import { db } from "@juris-os/db/server";
import { and, eq, max } from "drizzle-orm";
import { createAuthUser } from "../core/create-auth-user";

type CaseStatus =
	| "DRAFT"
	| "OPEN"
	| "UNDER_REVIEW"
	| "PENDING_RESOLUTION"
	| "CLOSED"
	| "ERROR";
type CaseCategory = "criminal" | "family" | "labor";

const PREFIX: Record<CaseCategory, string> = {
	criminal: "CRM",
	family: "FAM",
	labor: "LAB",
};

async function nextCaseNumber(category: CaseCategory): Promise<{
	caseNumber: string;
	sequenceNumber: number;
	year: number;
}> {
	const year = 2026;
	const result = await db
		.select({ maxSeq: max(cases.sequenceNumber) })
		.from(cases)
		.where(and(eq(cases.year, year), eq(cases.category, category)));
	const sequenceNumber = (result[0]?.maxSeq ?? 0) + 1;
	const caseNumber = `${PREFIX[category]}-${year}-${String(sequenceNumber).padStart(4, "0")}`;
	return { caseNumber, sequenceNumber, year };
}

const EXTRA_JUDGES = [
	{
		name: "María González",
		email: "mgonzalez@juris-os.com",
		password: "Judge1234!",
	},
	{
		name: "Carlos Rodríguez",
		email: "crodriguez@juris-os.com",
		password: "Judge1234!",
	},
	{
		name: "Ana Martínez",
		email: "amartinez@juris-os.com",
		password: "Judge1234!",
	},
];

interface SeedCase {
	title: string;
	description: string;
	category: CaseCategory;
	incidentDate: string;
	counterpartyName: string;
	status: CaseStatus;
	/** email of the judge assigned; undefined = unassigned */
	judgeEmail?: string;
	createdAt: Date;
	/** Only relevant for CLOSED cases */
	updatedAt?: Date;
}

function d(iso: string) {
	return new Date(iso);
}

// 28 seed cases spread across Jan–May 2026
const SEED_CASES: SeedCase[] = [
	// ── January 2026 ──────────────────────────────────────────────────────
	{
		title: "Acusación por Fraude Financiero",
		description:
			"Presunta falsificación de documentos contables para desviar fondos de la empresa.",
		category: "criminal",
		incidentDate: "2025-12-10",
		counterpartyName: "Ministerio Público",
		status: "CLOSED",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-01-15"),
		updatedAt: d("2026-02-05"),
	},
	{
		title: "Custodia de Menores Tras Divorcio",
		description:
			"Disputa sobre la custodia física y legal de dos hijos en proceso de divorcio.",
		category: "family",
		incidentDate: "2025-11-20",
		counterpartyName: "Cónyuge",
		status: "CLOSED",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-01-20"),
		updatedAt: d("2026-03-10"),
	},
	{
		title: "Despido Masivo Sin Liquidación",
		description:
			"30 trabajadores de planta despedidos sin el pago completo de sus prestaciones.",
		category: "labor",
		incidentDate: "2025-12-01",
		counterpartyName: "Manufacturas del Norte S.A.",
		status: "CLOSED",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-01-25"),
		updatedAt: d("2026-02-28"),
	},
	{
		title: "Robo con Violencia en Comercio",
		description:
			"Víctima denuncia robo a mano armada en su local comercial. Dos imputados identificados.",
		category: "criminal",
		incidentDate: "2026-01-12",
		counterpartyName: "Ministerio Público",
		status: "UNDER_REVIEW",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-01-30"),
		updatedAt: d("2026-01-30"),
	},

	// ── February 2026 ────────────────────────────────────────────────────
	{
		title: "Pensión Alimentaria Incumplida",
		description:
			"Madre solicita ejecución forzosa de sentencia de pensión impagada por 8 meses.",
		category: "family",
		incidentDate: "2025-10-01",
		counterpartyName: "Progenitor",
		status: "CLOSED",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-02-05"),
		updatedAt: d("2026-03-15"),
	},
	{
		title: "Discriminación Laboral por Género",
		description:
			"Empleada alega haber sido excluida de ascenso por razones de género.",
		category: "labor",
		incidentDate: "2025-12-15",
		counterpartyName: "Corp Financiera del Sur",
		status: "UNDER_REVIEW",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-02-10"),
		updatedAt: d("2026-02-10"),
	},
	{
		title: "Violencia Doméstica Reincidente",
		description:
			"Tercera denuncia contra el mismo imputado. Solicitud de orden de alejamiento definitiva.",
		category: "criminal",
		incidentDate: "2026-02-01",
		counterpartyName: "Ministerio Público",
		status: "PENDING_RESOLUTION",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-02-15"),
		updatedAt: d("2026-02-15"),
	},
	{
		title: "Contrato de Servicios Profesionales Incumplido",
		description:
			"Empresa incumple honorarios pactados con bufete externo de TI.",
		category: "labor",
		incidentDate: "2025-11-05",
		counterpartyName: "TechGlobal S.A.",
		status: "CLOSED",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-02-20"),
		updatedAt: d("2026-04-01"),
	},
	{
		title: "Herencia Disputada con Testamento Impugnado",
		description:
			"Dos hermanos impugnan testamento que favorece a un tercero no familiar.",
		category: "family",
		incidentDate: "2025-09-15",
		counterpartyName: "Heredero testamentario",
		status: "UNDER_REVIEW",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-02-25"),
		updatedAt: d("2026-02-25"),
	},

	// ── March 2026 ───────────────────────────────────────────────────────
	{
		title: "Tráfico de Influencias en Licitación Pública",
		description:
			"Presunta adjudicación irregular de contrato público por $2.4M.",
		category: "criminal",
		incidentDate: "2025-12-20",
		counterpartyName: "Ministerio Público",
		status: "CLOSED",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-03-05"),
		updatedAt: d("2026-04-10"),
	},
	{
		title: "Acoso Laboral por Parte de Supervisor",
		description:
			"Empleado reporta hostigamiento sistemático que afectó su salud mental.",
		category: "labor",
		incidentDate: "2026-02-10",
		counterpartyName: "Distribuidora del Centro",
		status: "OPEN",
		createdAt: d("2026-03-10"),
		updatedAt: d("2026-03-10"),
	},
	{
		title: "Violencia Intrafamiliar con Medidas Cautelares",
		description:
			"Cónyuge solicita medidas de protección urgentes y separación legal.",
		category: "family",
		incidentDate: "2026-03-01",
		counterpartyName: "Agresor familiar",
		status: "PENDING_RESOLUTION",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-03-15"),
		updatedAt: d("2026-03-15"),
	},
	{
		title: "Homicidio Culposo en Accidente Vial",
		description:
			"Conductor imprudente causa muerte de ciclista. Peritos confirman exceso de velocidad.",
		category: "criminal",
		incidentDate: "2026-02-20",
		counterpartyName: "Ministerio Público",
		status: "UNDER_REVIEW",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-03-20"),
		updatedAt: d("2026-03-20"),
	},
	{
		title: "Pago de Horas Extra No Reconocidas",
		description:
			"Trabajador de logística reclama 14 meses de horas extra no liquidadas.",
		category: "labor",
		incidentDate: "2026-01-15",
		counterpartyName: "Logística Express Ltda.",
		status: "CLOSED",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-03-25"),
		updatedAt: d("2026-05-05"),
	},

	// ── April 2026 ───────────────────────────────────────────────────────
	{
		title: "Adopción Internacional Impugnada",
		description:
			"Familia biológica busca revertir proceso de adopción completado en el extranjero.",
		category: "family",
		incidentDate: "2025-08-01",
		counterpartyName: "Familia adoptiva",
		status: "OPEN",
		createdAt: d("2026-04-05"),
		updatedAt: d("2026-04-05"),
	},
	{
		title: "Extorsión a Comerciante Local",
		description:
			"Pequeño empresario denuncia cobro de cuota semanal bajo amenaza.",
		category: "criminal",
		incidentDate: "2026-03-25",
		counterpartyName: "Ministerio Público",
		status: "UNDER_REVIEW",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-04-10"),
		updatedAt: d("2026-04-10"),
	},
	{
		title: "Negativa de Seguro de Incapacidad",
		description:
			"Aseguradora rechaza pago de incapacidad laboral a trabajador con dictamen médico.",
		category: "labor",
		incidentDate: "2026-02-28",
		counterpartyName: "Aseguradora Nacional",
		status: "UNDER_REVIEW",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-04-15"),
		updatedAt: d("2026-04-15"),
	},
	{
		title: "Posesión de Sustancias Controladas",
		description:
			"Imputado detenido en flagrancia con sustancias. Primera ofensa, solicita beneficio alternativo.",
		category: "criminal",
		incidentDate: "2026-04-05",
		counterpartyName: "Ministerio Público",
		status: "OPEN",
		createdAt: d("2026-04-20"),
		updatedAt: d("2026-04-20"),
	},
	{
		title: "Guarda y Crianza tras Fallecimiento de Padre",
		description:
			"Abuela materna solicita tutela legal de menor huérfano de padre.",
		category: "family",
		incidentDate: "2026-03-10",
		counterpartyName: "Familia paterna",
		status: "CLOSED",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-04-22"),
		updatedAt: d("2026-05-10"),
	},
	{
		title: "Incumplimiento de Convenio Colectivo",
		description:
			"Sindicato demanda por desconocimiento de acuerdo firmado sobre bonificaciones.",
		category: "labor",
		incidentDate: "2026-03-20",
		counterpartyName: "Grupo Industrial Centroamérica",
		status: "PENDING_RESOLUTION",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-04-28"),
		updatedAt: d("2026-04-28"),
	},

	// ── May 2026 (recent — in 30-day window) ─────────────────────────────
	{
		title: "Estafa Electrónica a Adultos Mayores",
		description:
			"Red de llamadas fraudulentas suplantó a bancos para capturar credenciales.",
		category: "criminal",
		incidentDate: "2026-04-20",
		counterpartyName: "Ministerio Público",
		status: "OPEN",
		createdAt: d("2026-05-01"),
		updatedAt: d("2026-05-01"),
	},
	{
		title: "Alimentos para Hijo Mayor de Edad con Discapacidad",
		description:
			"Madre solicita extensión de pensión alimentaria para hijo con discapacidad permanente.",
		category: "family",
		incidentDate: "2026-04-15",
		counterpartyName: "Progenitor",
		status: "CLOSED",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-05-03"),
		updatedAt: d("2026-05-15"),
	},
	{
		title: "Despido en Período de Prueba con Denuncia Previa",
		description:
			"Empleada despedida días después de presentar queja ante RRHH por acoso.",
		category: "labor",
		incidentDate: "2026-04-25",
		counterpartyName: "Retail Digital S.A.",
		status: "OPEN",
		createdAt: d("2026-05-05"),
		updatedAt: d("2026-05-05"),
	},
	{
		title: "Falsificación de Título Profesional",
		description:
			"Médico ejerció sin título válido durante 3 años causando daños a pacientes.",
		category: "criminal",
		incidentDate: "2026-04-28",
		counterpartyName: "Ministerio Público",
		status: "CLOSED",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-05-07"),
		updatedAt: d("2026-05-18"),
	},
	{
		title: "Divorcio con Liquidación de Sociedad de Gananciales",
		description:
			"Pareja solicita divorcio de mutuo acuerdo con inventario de bienes compartidos.",
		category: "family",
		incidentDate: "2026-04-10",
		counterpartyName: "Cónyuge",
		status: "UNDER_REVIEW",
		judgeEmail: "crodriguez@juris-os.com",
		createdAt: d("2026-05-08"),
		updatedAt: d("2026-05-08"),
	},
	{
		title: "Robo de Identidad Corporativa",
		description:
			"Competidor utilizó nombre comercial y logotipo registrados para captar clientes.",
		category: "criminal",
		incidentDate: "2026-05-01",
		counterpartyName: "Ministerio Público",
		status: "UNDER_REVIEW",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-05-10"),
		updatedAt: d("2026-05-10"),
	},
	{
		title: "Régimen de Visitas Incumplido",
		description:
			"Padre con custodia compartida impide las visitas del otro progenitor.",
		category: "family",
		incidentDate: "2026-04-30",
		counterpartyName: "Progenitor custodio",
		status: "OPEN",
		createdAt: d("2026-05-12"),
		updatedAt: d("2026-05-12"),
	},
	{
		title: "Retención de Salario por Huelga Legal",
		description:
			"Empresa descontó días de huelga legalmente declarada por el Ministerio de Trabajo.",
		category: "labor",
		incidentDate: "2026-05-02",
		counterpartyName: "Corporación Agropecuaria S.A.",
		status: "UNDER_REVIEW",
		judgeEmail: "amartinez@juris-os.com",
		createdAt: d("2026-05-15"),
		updatedAt: d("2026-05-15"),
	},
	{
		title: "Lesiones Graves por Negligencia Médica",
		description:
			"Paciente sufrió daños permanentes por error en dosis administrada en cirugía.",
		category: "criminal",
		incidentDate: "2026-05-08",
		counterpartyName: "Ministerio Público",
		status: "PENDING_RESOLUTION",
		judgeEmail: "mgonzalez@juris-os.com",
		createdAt: d("2026-05-18"),
		updatedAt: d("2026-05-18"),
	},
	{
		title: "Incumplimiento de Pensión Compensatoria Post-Divorcio",
		description:
			"Ex cónyuge no ha realizado ningún pago de los 18 meses pactados en sentencia.",
		category: "family",
		incidentDate: "2026-05-10",
		counterpartyName: "Ex cónyuge",
		status: "OPEN",
		createdAt: d("2026-05-22"),
		updatedAt: d("2026-05-22"),
	},
];

export async function runDashboardSeed() {
	console.log("📊 Seeding dashboard data...\n");

	// 1. Create extra judges
	console.log("  👤 Creating judges...");
	const judgeIds: Record<string, string> = {};

	for (const judgeData of EXTRA_JUDGES) {
		const created = await createAuthUser({ ...judgeData, role: "judge" });
		if (created) {
			judgeIds[judgeData.email] = created.id;
			console.log(`     ✅ ${judgeData.name}`);
		} else {
			const existing = await db
				.select({ id: user.id })
				.from(user)
				.where(eq(user.email, judgeData.email))
				.limit(1);
			if (existing[0]) {
				judgeIds[judgeData.email] = existing[0].id;
				console.log(`     ⏭️  Already exists: ${judgeData.name}`);
			}
		}
	}

	// Also fetch existing judges so we can reference them by email
	const existingJudge = await db
		.select({ id: user.id, email: user.email })
		.from(user)
		.where(eq(user.email, "judge@juris-os.com"))
		.limit(1);
	if (existingJudge[0]) {
		judgeIds["judge@juris-os.com"] = existingJudge[0].id;
	}

	// Fetch citizen for userId
	const citizenRows = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, "citizen@juris-os.com"))
		.limit(1);
	const citizenId = citizenRows[0]?.id;
	if (!citizenId) {
		console.log("  ⚠️  Citizen not found — run auth seed first");
		return;
	}

	// 2. Insert cases
	console.log("\n  📁 Creating cases...");
	let created = 0;
	let skipped = 0;

	for (const c of SEED_CASES) {
		try {
			const { caseNumber, sequenceNumber, year } = await nextCaseNumber(
				c.category,
			);
			const judgeId = c.judgeEmail ? judgeIds[c.judgeEmail] : null;

			await db.insert(cases).values({
				userId: citizenId,
				caseNumber,
				sequenceNumber,
				year,
				title: c.title,
				description: c.description,
				category: c.category,
				incidentDate: c.incidentDate,
				counterpartyName: c.counterpartyName,
				status: c.status,
				judgeId: judgeId ?? null,
				createdAt: c.createdAt,
				updatedAt: c.updatedAt ?? c.createdAt,
			});

			console.log(`     ✅ [${caseNumber}] ${c.title.slice(0, 50)}`);
			created++;
		} catch (err: unknown) {
			const e = err as { message?: string; code?: string };
			if (e?.message?.includes("unique") || e?.code === "23505") {
				console.log(`     ⏭️  Skipped (duplicate): ${c.title.slice(0, 50)}`);
				skipped++;
			} else {
				console.error("     ❌ Error:", e?.message);
				throw err;
			}
		}
	}

	console.log(`\n  📊 Cases: ${created} created, ${skipped} skipped`);
	console.log("  ✨ Dashboard seed complete.");
}
