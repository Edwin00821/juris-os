import type { InferSelectModel } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgSequence,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const casePriorityEnum = pgEnum("case_priority", [
	"low",
	"medium",
	"high",
]);

export const caseResolutionEnum = pgEnum("case_resolution", [
	"admitted",
	"conditioned",
	"rejected",
]);

export const caseStatusEnum = pgEnum("case_status", [
	"DRAFT",
	"OPEN",
	"UNDER_REVIEW",
	"PENDING_RESOLUTION",
	"CLOSED",
	"ERROR",
]);

export const caseCategoryEnum = pgEnum("case_category", [
	"criminal",
	"family",
	"labor",
]);

// Global sequence per year — resets are handled in the application layer.
// Using a DB sequence guarantees no duplicate numbers under concurrent inserts.
export const caseSequence = pgSequence("case_sequence", {
	startWith: 1,
	increment: 1,
});

export const cases = pgTable(
	"cases",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// Human-readable ID shown in the UI: CIV-2025-0001
		caseNumber: text("case_number").notNull(),
		judgeId: text("judge_id"),
		userId: text("user_id").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		category: caseCategoryEnum("category").notNull(),
		incidentDate: text("incident_date").notNull(),
		counterpartyName: text("counterparty_name"),
		counterpartyAddress: text("counterparty_address"),
		counterpartyId: text("counterparty_id"),
		status: caseStatusEnum("status").notNull().default("OPEN"),
		priority: casePriorityEnum("priority").notNull().default("medium"),
		// Set when status transitions to CLOSED: admitted | conditioned | rejected
		resolution: caseResolutionEnum("resolution"),
		// Stores the numeric part for easy sequencing queries
		sequenceNumber: integer("sequence_number").notNull(),
		year: integer("year").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [index("cases_case_number_idx").on(table.caseNumber)],
);

export type CaseRecord = InferSelectModel<typeof cases>;
