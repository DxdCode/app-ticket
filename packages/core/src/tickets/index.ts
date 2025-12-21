import { z } from "zod";
import { Common } from '../shared/common';
import { Examples } from "../examples";
import { Drizzle } from "../shared/drizzle";
import { ticketTable } from "./ticket.sql";
import { and, eq } from "drizzle-orm";
import { fn } from "../shared/fn";
import { createID } from "../shared/id";
import { IA } from "../ia/promps";
import { aiLogTable } from "../ai_logs/ai_log.sql";
import { AppError } from "../shared/errors";

export namespace Ticket {



    export const StatusEnum = z.enum(["open", "in_progress", "resolved"]);
    export type Status = z.infer<typeof StatusEnum>;



    export const InfoSchema = z
        .object({
            id: z.string().openapi({
                description: Common.IdDescription,
                example: Examples.Ticket.id,
            }),
            userId: z.string().openapi({
                description: "ID del usuario que creó el ticket",
                example: Examples.Ticket.userId,
            }),
            title: z.string().openapi({
                description: "Título del ticket",
                example: Examples.Ticket.title,
            }),
            description: z.string().openapi({
                description: "Descripción del problema",
                example: Examples.Ticket.description,
            }),
            category: z.string().openapi({
                description: "Categoría del ticket",
                example: Examples.Ticket.category,
            }),
            priority: z.string().openapi({
                description: "Prioridad del ticket",
                example: Examples.Ticket.priority,
            }),
            status: StatusEnum.openapi({
                description: "Estado del ticket",
                example: "open",
            }),
            solution: z.string().nullish().openapi({
                description: "Solución sugerida o aplicada",
                example: Examples.Ticket.solution,
            }),
        })
        .openapi({
            ref: "TicketResource",
            description: "Objeto Ticket completo",
            example: Examples.Ticket,
        });

    export type InfoType = z.infer<typeof InfoSchema>;

    // DTO para crear ticket 
    export const CreateInputSchema = z
        .object({
            title: z.string().min(1).openapi({
                description: "Título",
                example: Examples.Ticket.title,
            }),
            description: z.string().min(1).openapi({
                description: "Descripción",
                example: Examples.Ticket.description,
            }),
        })
        .openapi({
            ref: "TicketCreateInput",
            description: "Datos para crear un ticket",
        });

    export type CreateInput = z.infer<typeof CreateInputSchema>;

    // DTO para respuesta de creación
    export const CreateOutputSchema = z
        .object({
            id: z.string().openapi({
                description: "ID del ticket creado",
                example: Examples.Ticket.id,
            }),
            category: z.string().openapi({
                description: "Categoría asignada por IA",
                example: Examples.Ticket.category,
            }),
            priority: z.string().openapi({
                description: "Prioridad asignada por IA",
                example: Examples.Ticket.priority,
            }),
        })
        .openapi({
            ref: "TicketCreateOutput",
            description: "Respuesta de creación de ticket",
        });

    export type CreateOutput = z.infer<typeof CreateOutputSchema>;

    // DTO para actualizar ticket 
    export const UpdateInputSchema = z
        .object({
            status: StatusEnum.optional().openapi({
                description: "Nuevo estado",
                example: "resolved",
            }),
            solution: z.string().optional().openapi({
                description: "Solución aplicada",
                example: Examples.Ticket.solution,
            }),
        })
        .openapi({
            ref: "TicketUpdateInput",
            description: "Datos para actualizar un ticket",
        });

    export type UpdateInput = z.infer<typeof UpdateInputSchema>;


    function serialize(
        input: typeof ticketTable.$inferSelect
    ): InfoType {
        return {
            id: input.id,
            userId: input.userId,
            title: input.title,
            description: input.description,
            category: input.category,
            priority: input.priority,
            status: input.status,
            solution: input.solution,
        };
    }


    export const list = fn(
        z.object({ userId: z.string() }),
        async ({ userId }) => {
            const select = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.userId, userId),
                        eq(ticketTable.isActive, true)
                    )
                );

            if (select.length === 0) {
                throw AppError.notFound(
                    "No se encontraron tickets para este usuario",
                    "no_tickets_found"
                );
            }

            return select.map(serialize);
        }
    );

    export const listAll = fn(
        z.object({}),
        async () => {
            const select = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(eq(ticketTable.isActive, true));

            return select.map(serialize);
        }
    );

    export const create = fn(
        InfoSchema.pick({
            userId: true,
            title: true,
            description: true,
        }),
        async (data) => {
            const id = createID("ticket");

            const aiAnalysis = await IA.analyzeTicket(
                data.title,
                data.description
            );

            // PRIMERO: Insertar el ticket
            await Drizzle.db.insert(ticketTable).values({
                ...data,
                id,
                category: aiAnalysis.categoria,
                priority: aiAnalysis.prioridad,
                status: "open",
            });

            // SEGUNDO: Insertar el log de IA (ahora el ticketId existe)
            const aiLogId = createID("aiLog");
            await Drizzle.db.insert(aiLogTable).values({
                id: aiLogId,
                ticketId: id,
                action: "classification",
                input: JSON.stringify({
                    title: data.title,
                    description: data.description,
                }),
                output: JSON.stringify(aiAnalysis),
            });

            return {
                id,
                category: aiAnalysis.categoria,
                priority: aiAnalysis.prioridad,
            };
        }
    );

    export const update = fn(
        InfoSchema.pick({ id: true }).extend({
            status: StatusEnum.optional(),
            solution: z.string().optional(),
        }),
        async ({ id, status, solution }) => {
            const existing = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.id, id),
                        eq(ticketTable.isActive, true)
                    )
                )
                .limit(1)
                .then(r => r[0]);

            if (!existing) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            if (existing.status === "resolved") {
                throw AppError.validation(
                    "El ticket ya está resuelto",
                    "ticket_already_resolved"
                );
            }

            const updateData: any = { timeUpdated: new Date() };

            if (status !== undefined) updateData.status = status;
            if (solution !== undefined) updateData.solution = solution;
            if (solution !== undefined && status === undefined) {
                updateData.status = "resolved";
            }

            await Drizzle.db
                .update(ticketTable)
                .set(updateData)
                .where(eq(ticketTable.id, id));

            return { id };
        }
    );

    export const getDetail = fn(
        z.object({ id: z.string(), userId: z.string() }),
        async ({ id, userId }) => {
            const select = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.id, id),
                        eq(ticketTable.userId, userId),
                        eq(ticketTable.isActive, true)
                    )
                );

            const ticket = select.map(serialize).at(0);

            if (!ticket) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            return ticket;
        }
    );

    export const deactivate = fn(
        z.object({ id: z.string(), userId: z.string() }),
        async ({ id, userId }) => {
            const existing = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.id, id),
                        eq(ticketTable.userId, userId),
                        eq(ticketTable.isActive, true)
                    )
                )
                .limit(1)
                .then(r => r[0]);

            if (!existing) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            await Drizzle.db
                .update(ticketTable)
                .set({
                    isActive: false,
                    timeDeleted: new Date(),
                })
                .where(eq(ticketTable.id, id));

            return { id };
        }
    );
}
