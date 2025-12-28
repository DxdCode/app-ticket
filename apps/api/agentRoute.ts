import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { Ticket, Examples } from '@tickets/core';
import { authRequired, roleRequired, ErrorResponses } from './common';

export const agentTicketRoute = new Hono()
    .get(
        '/list',
        authRequired,
        roleRequired('agent'),
        describeRoute({
            tags: ['Agent Tickets'],
            summary: 'Listar todos los tickets',
            description: 'Vista de agente para ver tickets de todos los usuarios. Opcionalmente incluye tickets eliminados.',
            responses: {
                200: {
                    description: 'Lista global de tickets',
                    content: {
                        'application/json': {
                            schema: resolver(z.object({ data: z.array(Ticket.InfoSchema) })),
                            example: { data: [Examples.TicketForAgent] },
                        },
                    },
                },
                500: ErrorResponses[500],
            },
        }),
        async (c) => {
            const includeInactive = c.req.query('includeInactive') === 'true';
            const result = await Ticket.listAll({ includeInactive });
            return c.json({ data: result }, 200);
        }
    );
