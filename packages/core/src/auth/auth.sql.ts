import { pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";
import { Drizzle } from "../shared/drizzle";

export const userRoleEnum = pgEnum("user_role", ["user", "agent", "ai"]);

export const userTable = pgTable('users',{
    ...Drizzle.id,
    email: varchar("email", { length: 100 }).notNull().unique(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 100 }).notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    ...Drizzle.timestamps,
})