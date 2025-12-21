import { z } from "zod";
import { Common } from "../shared/common";
import { Examples } from "../examples";
import { Drizzle } from "../shared/drizzle";
import { aiLogTable } from "./ai_log.sql";
import { ticketTable } from "../tickets/ticket.sql";
import { and, eq } from "drizzle-orm";
import { fn } from "../shared/fn";
import { AppError } from "../shared/errors";

export namespace AILog {

    export const InfoSchema = z
        .object({
            id: z.string().openapi({
                description: Common.IdDescription,
                example: Examples.AILog.id,
            }),
            ticketId: z.string().openapi({
                description: "ID del ticket",
                example: Examples.AILog.ticketId,
            }),
            action: z.string().openapi({
                description: "Acción de IA (classification, summary, suggestion)",
                example: Examples.AILog.action,
            }),
            input: z.record(z.any()).openapi({
                description: "Input enviado a la IA",
                example: Examples.AILog.input,
            }),
            output: z.record(z.any()).openapi({
                description: "Output devuelto por la IA",
                example: Examples.AILog.output,
            }),
        })
        .openapi({
            ref: "AILog",
            description: "Registro de acciones realizadas por IA sobre un ticket",
            example: Examples.AILog,
        });

    export type InfoType = z.infer<typeof InfoSchema>;

    function safeParse(value: any) {
        if (typeof value !== "string") return value;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    function serialize(
        input: typeof aiLogTable.$inferSelect
    ): InfoType {
        return {
            id: input.id,
            ticketId: input.ticketId,
            action: input.action,
            input: safeParse(input.input),
            output: safeParse(input.output),
        };
    }

    /**
     * Lista todos los logs de IA de un ticket
     */
    export const list = fn(
        z.object({
            ticketId: z.string(),
            userId: z.string(),
        }),
        async ({ ticketId }) => {

            const ticket = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.id, ticketId),
                        eq(ticketTable.isActive, true)
                    )
                )
                .limit(1)
                .then(r => r[0]);

            if (!ticket) {
                throw AppError.notFound(
                    "Ticket no encontrado",
                    "resource_not_found"
                );
            }

            const select = await Drizzle.db
                .select()
                .from(aiLogTable)
                .where(
                    and(
                        eq(aiLogTable.ticketId, ticketId),
                        eq(aiLogTable.isActive, true)
                    )
                );

            return select.map(serialize);
        }
    );
}
