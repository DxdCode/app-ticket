import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { Message, Examples } from '@tickets/core';
import {
    ErrorResponses,
    authRequired,
    getAuthPayload,
    roleRequired,
    validator,
} from './common';

export const messageRoute = new Hono()

    .use('*', authRequired)
    .use('*', roleRequired('user'))


    .post(
        '/:id/messages',
        describeRoute({
            tags: ['Messages'],
            summary: 'Enviar mensaje en ticket por ID',
            description: 'Crea un mensaje y genera respuesta sugerida de IA',
            requestBody: {
                content: {
                    'application/json': {
                        schema: resolver(Message.CreateInputSchema),
                    },
                } as any,
            },
            responses: {
                201: {
                    description: 'Mensaje enviado',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: Message.CreateResponseSchema,
                                })
                            ),
                            example: {
                                data: {
                                    messageId: Examples.Message.id,
                                    suggestion: Examples.Response.suggestion,
                                },
                            },
                        },
                    },
                },
                404: ErrorResponses[404],
                500: ErrorResponses[500],
            },
        }),
        validator(
            'param',
            z.object({
                id: z.string().openapi({
                    param: { name: 'id', in: 'path' },
                    example: Examples.Ticket.id,
                }),
            })
        ),
        validator('json', Message.CreateInputSchema),
        async (c) => {
            const { id: ticketId } = c.req.valid('param');
            const body = c.req.valid('json');
            const user = getAuthPayload(c)!;

            const result = await Message.create({
                ticketId,
                senderId: user.userId,
                message: body.message,
            });

            return c.json({ data: result }, 201);
        }
    )

    .get(
        '/:id/messages',
        describeRoute({
            tags: ['Messages'],
            summary: 'Listar mensajes de un ticket por ID',
            description: 'Obtiene el historial de mensajes de un ticket específico',
            responses: {
                200: {
                    description: 'Lista de mensajes',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: z.array(Message.InfoSchema),
                                })
                            ),
                            example: {
                                data: [Examples.Message],
                            },
                        },
                    },
                },
                404: ErrorResponses[404],
                500: ErrorResponses[500],
            },
        }),
        validator(
            'param',
            z.object({
                id: z.string().openapi({
                    param: { name: 'id', in: 'path' },
                    example: Examples.Ticket.id,
                }),
            })
        ),
        async (c) => {
            const { id: ticketId } = c.req.valid('param');
            const user = getAuthPayload(c)!;

            const result = await Message.list({
                ticketId,
                userId: user.userId,
            });

            return c.json({ data: result }, 200);
        }
    )


    .get(
        '/messages/:messageId',
        describeRoute({
            tags: ['Messages'],
            summary: 'Obtener detalle de un mensaje por ID',
            description: 'Recupera la información de un mensaje específico por su ID',
            responses: {
                200: {
                    description: 'Detalle del mensaje',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: Message.InfoSchema,
                                })
                            ),
                            example: {
                                data: Examples.Message,
                            },
                        },
                    },
                },
                404: ErrorResponses[404],
                500: ErrorResponses[500],
            },
        }),
        validator(
            'param',
            z.object({
                messageId: z.string().openapi({
                    param: { name: 'messageId', in: 'path' },
                    example: Examples.Message.id,
                }),
            })
        ),
        async (c) => {
            const { messageId } = c.req.valid('param');

            const result = await Message.getDetail({
                id: messageId,
            });

            return c.json({ data: result }, 200);
        }
    );
