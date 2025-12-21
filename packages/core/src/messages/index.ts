import { z } from "zod";
import { Common } from "../shared/common";
import { Examples } from "../examples";
import { Drizzle } from "../shared/drizzle";
import { messageTable } from "./message.sql";
import { ticketTable } from "../tickets/ticket.sql";
import { and, eq } from "drizzle-orm";
import { fn } from "../shared/fn";
import { createID } from "../shared/id";
import { aiLogTable } from "../ai_logs/ai_log.sql";
import { AppError } from "../shared/errors";
import { IA } from "../ia/promps";

export namespace Message {



    export const InfoSchema = z
        .object({
            id: z.string().openapi({
                description: Common.IdDescription,
                example: Examples.Message.id,
            }),
            ticketId: z.string().openapi({
                description: "ID del ticket",
                example: Examples.Message.ticketId,
            }),
            senderId: z.string().openapi({
                description: "ID del usuario que envía el mensaje",
                example: Examples.Message.senderId,
            }),
            message: z.string().openapi({
                description: "Contenido del mensaje",
                example: Examples.Message.message,
            }),
        })
        .openapi({
            ref: "Message",
            description: "Mensaje enviado dentro de un ticket",
            example: Examples.Message,
        });

    export type Info = z.infer<typeof InfoSchema>;

    // DTO para crear mensaje (solo el contenido del mensaje)
    export const CreateInputSchema = z
        .object({
            message: z.string().min(1).openapi({
                description: "Contenido del mensaje",
                example: Examples.Message.message,
            }),
        })
        .openapi({
            ref: "MessageCreateInput",
            description: "Datos para enviar un mensaje",
        });

    export type CreateInput = z.infer<typeof CreateInputSchema>;

    // Schema interno para lógica (incluye ticketId y senderId)
    export const CreateSchema = InfoSchema.pick({
        ticketId: true,
        senderId: true,
        message: true,
    });

    export const CreateResponseSchema = z
        .object({
            messageId: z.string().openapi({
                description: "ID del mensaje creado",
                example: Examples.Message.id,
            }),
            suggestion: z.any().openapi({
                description: "Sugerencia generada por IA",
                example: Examples.Response.suggestion,
            }),
        })
        .openapi({
            ref: "MessageCreateResponse",
        });

    export type CreateOutput = z.infer<typeof CreateResponseSchema>;



    function serialize(
        input: typeof messageTable.$inferSelect
    ): Info {
        return {
            id: input.id,
            ticketId: input.ticketId,
            senderId: input.senderId,
            message: input.message,
        };
    }


    /**
     * Lista todos los mensajes de un ticket
     */
    export const list = fn(
        z.object({
            ticketId: z.string().openapi({
                description: "ID del ticket",
                example: Examples.Message.ticketId,
            }),
            userId: z.string().openapi({
                description: "ID del usuario solicitante",
                example: Examples.User.id,
            }),
        }),
        async ({ ticketId, userId }) => {

            const [ticket] = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.id, ticketId),
                        eq(ticketTable.userId, userId),
                        eq(ticketTable.isActive, true)
                    )
                )
                .limit(1);

            if (!ticket) {
                throw AppError.notFound(
                    "Ticket no encontrado",
                    "resource_not_found"
                );
            }

            const select = await Drizzle.db
                .select()
                .from(messageTable)
                .where(
                    and(
                        eq(messageTable.ticketId, ticketId),
                        eq(messageTable.isActive, true)
                    )
                );

            return select.map(serialize);
        }
    );

    /**
     * Crea un mensaje y genera sugerencia con IA
     */
    export const create = fn(
        CreateSchema,
        async (data) => {

            const [ticket] = await Drizzle.db
                .select()
                .from(ticketTable)
                .where(
                    and(
                        eq(ticketTable.id, data.ticketId),
                        eq(ticketTable.userId, data.senderId),
                        eq(ticketTable.isActive, true)
                    )
                )
                .limit(1);

            if (!ticket) {
                throw AppError.notFound(
                    "Ticket no encontrado",
                    "resource_not_found"
                );
            }

            if (ticket.status === "resolved") {
                throw AppError.validation(
                    "No se pueden agregar mensajes a un ticket resuelto",
                    "ticket_resolved"
                );
            }

            if (ticket.status !== "in_progress") {
                await Drizzle.db
                    .update(ticketTable)
                    .set({
                        status: "in_progress",
                        timeUpdated: new Date(),
                    })
                    .where(eq(ticketTable.id, data.ticketId));
            }

            const id = createID("message");

            const messages = await Drizzle.db
                .select()
                .from(messageTable)
                .where(
                    and(
                        eq(messageTable.ticketId, data.ticketId),
                        eq(messageTable.isActive, true)
                    )
                );

            const historial = JSON.stringify(
                messages.map(m => ({
                    sender: m.senderId,
                    message: m.message,
                }))
            );

            const suggestion = await IA.assistTicket({
                titulo: ticket.title,
                descripcion: ticket.description,
                categoria: ticket.category,
                prioridad: ticket.priority,
                historial,
                mensajeUsuario: data.message,
            });

            await Drizzle.db.insert(aiLogTable).values({
                id: createID("aiLog"),
                ticketId: data.ticketId,
                action: "suggestion",
                input: JSON.stringify({
                    messageId: id,
                    userMessage: data.message,
                }),
                output: suggestion,
            });

            await Drizzle.db.insert(messageTable).values({
                ...data,
                id,
            });

            return {
                messageId: id,
                suggestion,
            };
        }
    );

    /**
     * Obtiene el detalle de un mensaje
     */
    export const getDetail = fn(
        z.object({
            id: z.string().openapi({
                description: Common.IdDescription,
                example: Examples.Message.id,
            }),
        }),
        async ({ id }) => {

            const message = await Drizzle.db
                .select()
                .from(messageTable)
                .where(
                    and(
                        eq(messageTable.id, id),
                        eq(messageTable.isActive, true)
                    )
                )
                .then(r => r.map(serialize).at(0));

            if (!message) {
                throw AppError.notFound(
                    "Mensaje no encontrado",
                    "resource_not_found"
                );
            }

            return message;
        }
    );
}
