import type { InferSelectModel } from "drizzle-orm";
import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { cases } from "./case.schema";

export const documentTypeEnum = pgEnum("document_type", [
	"evidence",
	"motion",
	"brief",
	"judgment",
	"other",
]);

export const documents = pgTable(
	"documents",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		caseId: uuid("case_id")
			.notNull()
			.references(() => cases.id, { onDelete: "cascade" }),
		fileName: text("file_name").notNull(),
		fileType: text("file_type").notNull(),
		storageKey: text("storage_key").notNull(),
		fileUrl: text("file_url").notNull(),
		markdownContent: text("markdown_content"),
		documentType: documentTypeEnum("document_type").notNull().default("other"),
		uploadedBy: text("uploaded_by")
			.notNull()
			.references(() => user.id),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [index("documents_case_id_idx").on(t.caseId)],
);

export type DocumentRecord = InferSelectModel<typeof documents>;
