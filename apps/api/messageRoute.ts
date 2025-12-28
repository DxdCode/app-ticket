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

    .post(
        '/send/:id/messages',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Messages'],
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
        '/list/:id/messages',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Messages'],
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
        '/agent/list/:id/messages',
        authRequired,
        
        roleRequired('agent'),
        describeRoute({
            tags: ['Agent Messages'],
            summary: 'Listar mensajes de un ticket por ID como agente',
            description: 'Los agentes pueden ver mensajes de cualquier ticket, incluso si está eliminado',
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
            const result = await Message.listForAgent({ ticketId });
            return c.json({ data: result }, 200);
        }
    )

    .post(
        '/agent/send/:id/messages',
        authRequired,
        roleRequired('agent'),
        describeRoute({
            tags: ['Agent Messages'],
            summary: 'Enviar mensaje como agente',
            description: 'Los agentes pueden responder a tickets activos. No se puede responder a tickets resueltos.',
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
                                    data: z.object({
                                        message: z.string(),
                                    }),
                                })
                            ),
                            example: {
                                data: { message: "Su respuesta ya ha sido enviada correctamente" },
                            },
                        },
                    },
                },
                400: ErrorResponses[400],
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
            const agent = getAuthPayload(c)!;

            const result = await Message.createAgentMessage({
                ticketId,
                senderId: agent.userId,
                message: body.message,
            });

            return c.json({ data: result }, 201);
        }
    );
