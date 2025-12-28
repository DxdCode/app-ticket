import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";
import { Drizzle } from "../shared/drizzle";
import { ticketTable } from "../tickets/ticket.sql";
import { userTable } from "../auth/auth.sql";

export const messageRoleEnum = pgEnum("message_role", ["user", "agent", "ia"]);

export const messageTable = pgTable('messages', {
    ...Drizzle.id,
    ticketId: Drizzle.ulid("ticket_id").notNull().references(() => ticketTable.id),
    senderId: text("sender_id").notNull(),
    role: messageRoleEnum("role").notNull(),
    message: text("message").notNull(),
    ...Drizzle.isActive,
    ...Drizzle.timestamps,
});
