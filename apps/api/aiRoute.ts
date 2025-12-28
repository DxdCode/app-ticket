import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { AILog, Examples } from '@tickets/core';
import {
    ErrorResponses,
    authRequired,
    getAuthPayload,
    roleRequired,
    validator,
} from './common';

export const aiRoute = new Hono()

    .get(
        '/logs/:id/ai',
        authRequired,
        roleRequired('agent'),
        describeRoute({
            tags: ['IA Logs'],
            summary: 'Listar logs de IA',
            description: 'Obtiene todos los logs de análisis de IA para un ticket',
            security: [
                {
                    BearerAuthAgent: [], 
                },
            ],
            responses: {
                200: {
                    description: 'Lista de logs de IA',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: z.array(AILog.InfoSchema),
                                })
                            ),
                            example: {
                                data: [Examples.AILog],
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

            const result = await AILog.list({
                ticketId,
                userId: user.userId,
            });

            return c.json({ data: result }, 200);
        }
    );
