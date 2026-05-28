CREATE TYPE "public"."case_resolution" AS ENUM('admitted', 'conditioned', 'rejected');--> statement-breakpoint
ALTER TABLE "cases" ADD COLUMN "resolution" "case_resolution";