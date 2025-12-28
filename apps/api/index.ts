import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Scalar } from '@scalar/hono-api-reference';
import { userRoute } from './userRoute';
import { userTicketRoute } from './ticketRoute';
import { HTTPException } from 'hono/http-exception';
import { AppError } from '@tickets/core';
import { messageRoute } from './messageRoute';
import { aiRoute } from './aiRoute';
import { agentTicketRoute } from './agentRoute';
import { errorResponse } from './common';
import { ErrorCodes } from './error';
import { openAPISpecs } from 'hono-openapi'

const app = new Hono();
const route = app
    .use(cors())
    .route('/api/auth', userRoute)
    .route('/api/user/tickets', userTicketRoute)
    .route('/api/user/message', messageRoute)
    .route('/api/agent/tickets', agentTicketRoute)
    .route('/api/agent/ai', aiRoute)
    .get(
        '/openapi',
        openAPISpecs(app, {
            documentation: {
                info: {
                    title: 'Hono API',
                    version: '1.0.0',
                    description: 'Greeting API',
                },
                servers: [
                    { url: 'http://localhost:3000', description: 'Local Server' },
                    { url: 'https://api.example.com', description: 'Production Server' },
                ],
                components: {
                    securitySchemes: {
                        BearerAuthUser: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            description: 'Token Bearer autenticacion para usuarios'
                        },
                        BearerAuthAgent: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            description: 'Token Bearer autenticacion para agentes'
                        },
                    },
                },
                security: [
                    {
                        BearerAuthUser: [],
                    },
                    {
                        BearerAuthAgent: [],
                    },
                ],
            },
        })
    )
    .get(
        '/docs',
        Scalar({
            theme: 'saturn',
            url: '/openapi',
        })
    )
    .onError((err, c) => {
        if (err instanceof AppError) {
            return errorResponse(c, err.toJSON(), err.statusCode as any);
        }
        if (err instanceof HTTPException) {
            console.error("http error:", err);

            return errorResponse(
                c,
                {
                    type: 'validation',
                    code: ErrorCodes.Validation.INVALID_PARAMETER,
                    message: 'Invalid request',
                },
                400
            );
        }
        console.error("unhandled error:", err);

        return errorResponse(
            c,
            {
                type: 'internal',
                code: ErrorCodes.Server.INTERNAL_ERROR,
                message: 'Internal server error',
            },
            500
        );
    });

export type ApiType = typeof route
export default {
    port: 3000,
    fetch: app.fetch,
};
