import { pgTable, text } from "drizzle-orm/pg-core";
import { Drizzle } from "../shared/drizzle";
import { ticketTable } from "../tickets/ticket.sql";
import { userTable } from "../auth/auth.sql";

export const messageTable = pgTable('messages', {
    ...Drizzle.id,
    ticketId: Drizzle.ulid("ticket_id").notNull().references(() => ticketTable.id),
    senderId: Drizzle.ulid("sender_id").notNull().references(() => userTable.id),
    message: text("message").notNull(),
    ...Drizzle.isActive,
    ...Drizzle.timestamps,
});
