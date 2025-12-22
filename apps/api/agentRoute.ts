import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { Ticket, Examples } from '@tickets/core';
import { authRequired, roleRequired, validator, ErrorResponses } from './common';

export const agentTicketRoute = new Hono()
    .use('*', authRequired)
    .use('*', roleRequired('agent'))

    .get(
        '/',
        describeRoute({
            tags: ['Agent Tickets'],
            summary: 'Listar todos los tickets',
            description: 'Vista de agente para ver tickets de todos los usuarios.',
            responses: {
                200: {
                    description: 'Lista global de tickets',
                    content: {
                        'application/json': {
                            schema: resolver(z.object({ data: z.array(Ticket.InfoSchema) })),
                            example: { data: [Examples.Ticket] },
                        },
                    },
                },
                500: ErrorResponses[500],
            },
        }),
        async (c) => {
            const result = await Ticket.listAll({});
            return c.json({ data: result }, 200);
        }
    )

    .patch(
        '/:id',
        describeRoute({
            tags: ['Agent Tickets'],
            summary: 'Gestionar ticket por ID',
            description: 'Actualizar estado o solución.',
            requestBody: {
                content: {
                    'application/json': {
                        schema: resolver(Ticket.UpdateInputSchema),
                    },
                } as any,
            },
            responses: {
                200: {
                    description: 'Ticket actualizado',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: z.object({
                                        id: z.string().openapi({ example: Examples.Ticket.id }),
                                        summary: z.string().openapi({ example: Examples.Response.suggestion }),
                                    }),
                                })
                            ),
                            example: {
                                data: {
                                    id: Examples.Ticket.id,
                                    summary: Examples.Response.suggestion,
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
        validator('json', Ticket.UpdateInputSchema),
        async (c) => {
            const { id } = c.req.valid('param');
            const body = c.req.valid('json');

            const result = await Ticket.update({
                id,
                status: body.status,
                solution: body.solution,
            });

            return c.json({ data: result }, 200);
        }
    );
