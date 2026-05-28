CREATE TYPE "public"."case_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "priority" "case_priority" DEFAULT 'medium' NOT NULL;