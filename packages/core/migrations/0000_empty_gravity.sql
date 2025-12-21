CREATE TYPE "public"."user_role" AS ENUM('user', 'agent', 'ai');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "ai_logs" (
	"id" char(30) PRIMARY KEY NOT NULL,
	"ticket_id" char(30) NOT NULL,
	"action" varchar(100) NOT NULL,
	"input" jsonb NOT NULL,
	"output" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"time_created" timestamp DEFAULT now() NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"time_deleted" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" char(30) PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"time_created" timestamp DEFAULT now() NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"time_deleted" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" char(30) PRIMARY KEY NOT NULL,
	"ticket_id" char(30) NOT NULL,
	"sender_id" char(30) NOT NULL,
	"message" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"time_created" timestamp DEFAULT now() NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"time_deleted" timestamp
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" char(30) PRIMARY KEY NOT NULL,
	"user_id" char(30) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"priority" varchar(50) NOT NULL,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"solution" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"time_created" timestamp DEFAULT now() NOT NULL,
	"time_updated" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"time_deleted" timestamp
);
--> statement-breakpoint
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;