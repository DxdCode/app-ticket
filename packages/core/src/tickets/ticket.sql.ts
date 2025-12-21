import { pgTable, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { Drizzle } from "../shared/drizzle";
import { userTable } from "../auth/auth.sql";

export const ticketStatusEnum = pgEnum("ticket_status", [
    "open",
    "in_progress",
    "resolved",
]);


export const ticketTable = pgTable('tickets', {
    ...Drizzle.id,
    userId: Drizzle.ulid("user_id").notNull().references(() => userTable.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    priority: varchar("priority", { length: 50 }).notNull(),
    status: ticketStatusEnum("status").notNull().default("open"),
    solution: text("solution"),
    ...Drizzle.isActive,
    ...Drizzle.timestamps,
});
