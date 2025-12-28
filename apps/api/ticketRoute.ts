import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { Ticket, Examples } from '@tickets/core';
import {
    ErrorResponses,
    authRequired,
    getAuthPayload,
    roleRequired,
    validator,
} from './common';

export const userTicketRoute = new Hono()

    .post(
        '/create',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Tickets'],
            summary: 'Crear un nuevo ticket',
            description: 'Crea un ticket y lo analiza con IA para categoría y prioridad',
            requestBody: {
                content: {
                    'application/json': {
                        schema: resolver(Ticket.CreateInputSchema),
                    },
                } as any,
            },
            responses: {
                201: {
                    description: 'Ticket creado exitosamente',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: Ticket.CreateOutputSchema,
                                })
                            ),
                            example: {
                                data: {
                                    id: Examples.Ticket.id,
                                    category: Examples.Ticket.category,
                                    priority: Examples.Ticket.priority,
                                },
                            },
                        },
                    },
                },
                400: ErrorResponses[400],
                500: ErrorResponses[500],
            },
        }),
        validator('json', Ticket.CreateInputSchema),
        async (c) => {
            const payload = getAuthPayload(c)!;
            const body = c.req.valid('json');

            const result = await Ticket.create({
                title: body.title,
                description: body.description,
                userId: payload.userId,
            });

            return c.json({ data: result }, 201);
        }
    )

    .get(
        '/list',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Tickets'],
            summary: 'Listar tickets del usuario',
            description: 'Obtiene todos los tickets del usuario autenticado',
            responses: {
                200: {
                    description: 'Lista de tickets',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: z.array(Ticket.InfoSchema),
                                })
                            ),
                            example: {
                                data: [Examples.TicketInfo],
                            },
                        },
                    },
                },
                500: ErrorResponses[500],
            },
        }),
        async (c) => {
            const user = getAuthPayload(c)!;
            const result = await Ticket.list({ userId: user.userId });

            return c.json({ data: result }, 200);
        }
    )

    .get(
        '/detail/:id',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Tickets'],
            summary: 'Obtener detalle del ticket por ID',
            description: 'Devuelve el detalle de un ticket específico del usuario autenticado',
            responses: {
                200: {
                    description: 'Detalle del ticket',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: Ticket.DetailSchema,
                                })
                            ),
                            example: {
                                data: Examples.Ticket,
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
            const { id } = c.req.valid('param');
            const user = getAuthPayload(c)!;

            const result = await Ticket.getDetail({
                id,
                userId: user.userId,
            });

            return c.json({ data: result }, 200);
        }
    )


    .delete(
        '/delete/:id',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Tickets'],
            summary: 'Eliminar un ticket por ID',
            description: 'Elimina un ticket del usuario autenticado',
            responses: {
                200: {
                    description: 'Ticket eliminado exitosamente',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: z.object({
                                        success: z.boolean(),
                                    }),
                                })
                            ),
                            example: {
                                data: { success: true },
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
            const { id } = c.req.valid('param');
            const user = getAuthPayload(c)!;

            const result = await Ticket.deactivate({
                id,
                userId: user.userId,
            });

            return c.json({ data: result }, 200);
        }
    )

    .patch(
        '/close/:id',
        authRequired,
        roleRequired('user'),
        describeRoute({
            tags: ['User Tickets'],
            summary: 'Cerrar un ticket por ID',
            description: 'El usuario puede cerrar su ticket cuando se resuelve su problema',
            responses: {
                200: {
                    description: 'Ticket cerrado exitosamente',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: z.object({
                                        success: z.boolean(),
                                    }),
                                })
                            ),
                            example: {
                                data: { success: true },
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
        async (c) => {
            const { id } = c.req.valid('param');
            const user = getAuthPayload(c)!;

            const result = await Ticket.closeByUser({
                id,
                userId: user.userId,
            });

            return c.json({ data: result }, 200);
        }
    );
