import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
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
            summary: 'Listar todos los tickets con filtros opcionales',
            description: 'Vista de agente para ver tickets de todos los usuarios. Soporta filtros combinados por status, priority y category mediante query params',
            responses: {
                200: {
                    description: 'Lista de tickets',
                    content: {
                        'application/json': {
                            schema: resolver(z.object({
                                data: z.array(Ticket.AgentTicketSchema)
                            })),
                            example: {
                                data: [Examples.TicketForAgent],
                            },
                        },
                    },
                },
                401: ErrorResponses[401],
                500: ErrorResponses[500],
            },
        }),
        validator(
            'query',
            z.object({
                includeInactive: z.enum(['true', 'false']).optional(),
                status: Ticket.StatusEnum.optional(),
                priority: Ticket.PriorityEnum.optional(),
                category: Ticket.CategoryEnum.optional(),
            })
        ),
        async (c) => {
            const includeInactive = c.req.query('includeInactive') === 'true';
            const status = c.req.query('status') as Ticket.Status;
            const priority = c.req.query('priority') as Ticket.Priority;
            const category = c.req.query('category') as Ticket.Category;

            const result = await Ticket.listAll({
                includeInactive,
                status,
                priority,
                category
            });

            return c.json({ data: result }, 200);
        }
    )