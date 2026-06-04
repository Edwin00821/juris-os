CREATE TYPE "public"."judge_specialty" AS ENUM('criminal', 'family', 'labor');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "specialty" "judge_specialty";