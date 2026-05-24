CREATE TYPE "public"."case_category" AS ENUM('criminal', 'family', 'labor');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('DRAFT', 'OPEN', 'UNDER_REVIEW', 'PENDING_RESOLUTION', 'CLOSED', 'ERROR');--> statement-breakpoint
CREATE SEQUENCE "public"."case_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_number" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" "case_category" NOT NULL,
	"incident_date" text NOT NULL,
	"counterparty_name" text,
	"counterparty_address" text,
	"counterparty_id" text,
	"status" "case_status" DEFAULT 'OPEN' NOT NULL,
	"sequence_number" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cases_case_number_idx" ON "cases" USING btree ("case_number");