import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";
import { Common } from '../shared/common';
import { Examples } from "../examples";
import { Drizzle } from "../shared/drizzle";
import { fn } from "../shared/fn";
import { createID } from "../shared/id";
import { AppError } from "../shared/errors";
import { IA } from "../ia/promps";
import { ticketTable } from "./ticket.sql";
import { userTable } from "../auth/auth.sql";
import { aiLogTable } from "../ai_logs/ai_log.sql";

export namespace Ticket {
    // Enums y tipos
    export const StatusEnum = z.enum(["open", "in_progress", "resolved"]);
    export type Status = z.infer<typeof StatusEnum>;

    // Schemas principales
    export const InfoSchema = z.object({
        id: z.string().openapi({
            description: Common.IdDescription,
            example: Examples.TicketInfo.id,
        }),
        userId: z.string().openapi({
            description: "ID del usuario que creó el ticket",
            example: Examples.TicketInfo.userId,
        }),
        title: z.string().openapi({
            description: "Título del ticket",
            example: Examples.TicketInfo.title,
        }),
        description: z.string().openapi({
            description: "Descripción del problema",
            example: Examples.TicketInfo.description,
        }),
        category: z.string().openapi({
            description: "Categoría del ticket",
            example: Examples.TicketInfo.category,
        }),
        priority: z.string().openapi({
            description: "Prioridad del ticket",
            example: Examples.TicketInfo.priority,
        }),
        status: StatusEnum.openapi({
            description: "Estado del ticket",
            example: "open",
        }),
        userName: z.string().optional().openapi({
            description: "Nombre del usuario (solo para agentes)",
            example: Examples.TicketForAgent.userName,
        }),
        userEmail: z.string().optional().openapi({
            description: "Email del usuario (solo para agentes)",
            example: Examples.TicketForAgent.userEmail,
        }),
    }).openapi({
        ref: "TicketResource",
        description: "Objeto Ticket completo",
        example: Examples.TicketInfo,
    });

    export type InfoType = z.infer<typeof InfoSchema>;

    export const DetailSchema = InfoSchema.extend({
        isActive: z.boolean().openapi({
            description: "Si el ticket está activo",
            example: true,
        }),
        timeCreated: z.string().openapi({
            description: "Fecha de creación del ticket",
            example: new Date().toISOString(),
            format: "date-time",
        }),
        timeUpdated: z.string().nullable().openapi({
            description: "Fecha de última actualización",
            example: new Date().toISOString(),
            format: "date-time",
        }),
    }).openapi({
        ref: "TicketDetail",
        description: "Detalle completo del ticket",
        example: Examples.Ticket,
    });

    export type DetailType = z.infer<typeof DetailSchema>;

    // DTOs de entrada/salida
    export const CreateInputSchema = z.object({
        title: z.string().min(1).openapi({
            description: "Título del ticket",
            example: Examples.Ticket.title,
        }),
        description: z.string().min(1).openapi({
            description: "Descripción del problema",
            example: Examples.Ticket.description,
        }),
    }).openapi({
        ref: "TicketCreateInput",
        description: "Datos para crear un ticket",
    });

    export type CreateInput = z.infer<typeof CreateInputSchema>;

    export const CreateOutputSchema = z.object({
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
    }).openapi({
        ref: "TicketCreateOutput",
        description: "Respuesta de creación de ticket",
    });

    export type CreateOutput = z.infer<typeof CreateOutputSchema>;

    export const UpdateInputSchema = z.object({
        status: StatusEnum.optional().openapi({
            description: "Estado del ticket",
            example: "resolved",
        }),
    }).openapi({
        ref: "TicketUpdateInput",
        description: "Datos para actualizar un ticket",
    });

    export type UpdateInput = z.infer<typeof UpdateInputSchema>;

    // Serializers
    function serialize(input: typeof ticketTable.$inferSelect): InfoType {
        return {
            id: input.id,
            userId: input.userId,
            title: input.title,
            description: input.description,
            category: input.category,
            priority: input.priority,
            status: input.status,
        };
    }

    function serializeDetail(input: typeof ticketTable.$inferSelect): DetailType {
        return {
            ...serialize(input),
            isActive: input.isActive,
            timeCreated: input.timeCreated.toISOString(),
            timeUpdated: input.timeUpdated?.toISOString() ?? null,
        };
    }

    // Helper para buscar tickets
    async function findTicket(id: string, userId?: string) {
        const conditions = [eq(ticketTable.id, id), eq(ticketTable.isActive, true)];
        if (userId) conditions.push(eq(ticketTable.userId, userId));

        const [ticket] = await Drizzle.db
            .select()
            .from(ticketTable)
            .where(and(...conditions))
            .limit(1);

        return ticket;
    }

    // Listar tickets de un usuario
    export const list = fn(
        z.object({ userId: z.string() }),
        async ({ userId }) => {
            const tickets = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(and(eq(ticketTable.userId, userId), eq(ticketTable.isActive, true)))
                .orderBy(desc(ticketTable.timeCreated));

            if (tickets.length === 0) {
                throw AppError.notFound("No se encontraron tickets", "no_tickets_found");
            }

            return tickets.map(serialize);
        }
    );

    // Listar todos los tickets (para agentes) - incluye inactivos si se solicita
    export const listAll = fn(
        z.object({ includeInactive: z.boolean().optional() }),
        async ({ includeInactive = false }) => {
            const tickets = await Drizzle.db
                .select({
                    ticket: ticketTable,
                    user: {
                        username: userTable.username,
                        email: userTable.email,
                    }
                })
                .from(ticketTable)
                .leftJoin(userTable, eq(ticketTable.userId, userTable.id))
                .where(includeInactive ? undefined : eq(ticketTable.isActive, true))
                .orderBy(desc(ticketTable.timeCreated));

            if (tickets.length === 0) {
                throw AppError.notFound("No se encontraron tickets", "no_tickets_found");
            }

            return tickets.map(({ ticket, user }) => ({
                ...serialize(ticket),
                userName: user?.username,
                userEmail: user?.email,
            }));
        }
    );

    // Crear un nuevo ticket con análisis de IA
    export const create = fn(
        InfoSchema.pick({ userId: true, title: true, description: true }),
        async (data) => {
            const id = createID("ticket");
            const ai = await IA.analyzeTicket(data.title, data.description);

            // Insertar ticket con análisis de IA
            await Drizzle.db.insert(ticketTable).values({
                id,
                ...data,
                category: ai.categoria,
                priority: ai.prioridad,
                status: "open",
            });

            // Guardar log de análisis de IA
            await Drizzle.db.insert(aiLogTable).values({
                id: createID("aiLog"),
                ticketId: id,
                action: "classification",
                input: JSON.stringify({ title: data.title, description: data.description }),
                output: JSON.stringify(ai),
            });

            return { id, category: ai.categoria, priority: ai.prioridad };
        }
    );

    // Actualizar el estado del ticket (para agentes)
    export const update = fn(
        InfoSchema.pick({ id: true }).extend({
            status: StatusEnum.optional(),
        }),
        async ({ id, status }) => {
            const ticket = await findTicket(id);

            if (!ticket) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            if (ticket.status === "resolved") {
                throw AppError.validation("El ticket ya está resuelto", "ticket_already_resolved");
            }

            const updateData: Record<string, any> = { timeUpdated: new Date() };

            if (status) {
                updateData.status = status;
            }

            await Drizzle.db.update(ticketTable).set(updateData).where(eq(ticketTable.id, id));

            return { id };
        }
    );

    // Obtener detalle del ticket por ID
    export const getDetail = fn(
        z.object({ id: z.string(), userId: z.string() }),
        async ({ id, userId }) => {
            const ticket = await findTicket(id, userId);

            if (!ticket) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            return serializeDetail(ticket);
        }
    );

    // Desactivar un ticket (solo si está resuelto)
    export const deactivate = fn(
        z.object({ id: z.string(), userId: z.string() }),
        async ({ id, userId }) => {
            const ticket = await findTicket(id, userId);

            if (!ticket) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            if (ticket.status !== "resolved") {
                throw AppError.validation(
                    "Solo se pueden eliminar tickets resueltos",
                    "ticket_not_resolved"
                );
            }

            await Drizzle.db
                .update(ticketTable)
                .set({ isActive: false, timeDeleted: new Date() })
                .where(eq(ticketTable.id, id));

            return { success: true };
        }
    );

    // Cerrar un ticket 
    export const closeByUser = fn(
        z.object({ id: z.string(), userId: z.string() }),
        async ({ id, userId }) => {
            const ticket = await findTicket(id, userId);

            if (!ticket) {
                throw AppError.notFound("Ticket no encontrado", "resource_not_found");
            }

            if (ticket.status === "resolved") {
                throw AppError.validation("El ticket ya está cerrado", "ticket_already_resolved");
            }

            await Drizzle.db
                .update(ticketTable)
                .set({
                    status: "resolved",
                    timeUpdated: new Date()
                })
                .where(eq(ticketTable.id, id));

            return { success: true };
        }
    );
}