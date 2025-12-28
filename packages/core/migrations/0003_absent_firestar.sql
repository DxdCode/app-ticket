CREATE TYPE "public"."message_role" AS ENUM('user', 'agent', 'ia');--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "role" "message_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "solution";