import { pgTable, varchar, jsonb } from "drizzle-orm/pg-core";
import { Drizzle } from "../shared/drizzle";
import { ticketTable } from "../tickets/ticket.sql";

export const aiLogTable = pgTable('ai_logs', {
    ...Drizzle.id,
    ticketId: Drizzle.ulid("ticket_id").notNull().references(() => ticketTable.id),
    action: varchar("action", { length: 100 }).notNull(),
    input: jsonb("input").notNull(),
    output: jsonb("output").notNull(),
    ...Drizzle.isActive,
    ...Drizzle.timestamps,
});
