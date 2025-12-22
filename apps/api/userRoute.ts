import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { Register, Login, User, Examples } from '@tickets/core';
import { ErrorResponses, authRequired, getAuthPayload, validator } from './common';

export const userRoute = new Hono()
    .get(
        '/profile',
        describeRoute({
            tags: ['Auth'],
            summary: 'Obtener perfil del usuario',
            security: [{ BearerAuthUser: [] }],
            responses: {
                200: {
                    description: 'Perfil de usuario',
                    content: {
                        'application/json': {
                            schema: resolver(User.InfoSchema),
                            example: {
                                data: Examples.User,
                            },
                        },
                    },
                },
                400: ErrorResponses[400],
                401: ErrorResponses[401],
                500: ErrorResponses[500],
            },
        }),
        authRequired,
        async (c) => {
            const payload = getAuthPayload(c)!;
            const result = await User.getProfile({ userId: payload.userId });
            return c.json({ data: result }, 200);
        }
    )
    .post(
        '/register',
        describeRoute({
            tags: ['Auth'],
            summary: 'Registrar un nuevo usuario',
            description: 'Esta ruta permite registrar un nuevo usuario en el sistema.',
            requestBody: {
                content: {
                    'application/json': {
                        schema: resolver(Register.InputSchema),
                        example: Examples.Register,
                    },
                } as any,
            },
            responses: {
                201: {
                    description: 'Usuario registrado exitosamente',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: Register.OutputSchema,
                                }),
                            ),
                            example: {
                                data: Examples.AuthResponse,
                            },
                        },
                    },
                },
                400: ErrorResponses[400],
                409: ErrorResponses[409],
                500: ErrorResponses[500],
            },
        }),
        validator('json', Register.InputSchema),
        async (c) => {
            const body = c.req.valid('json');
            const result = await Register.execute(body);
            return c.json({ data: result }, 201);
        }
    )
    .post(
        '/login',
        describeRoute({
            tags: ['Auth'],
            summary: 'Iniciar sesión',
            description: 'Esta ruta permite autenticar un usuario y obtener un token JWT.',
            requestBody: {
                content: {
                    'application/json': {
                        schema: resolver(Login.InputSchema),
                        example: Examples.Login,
                    },
                } as any,
            },
            responses: {
                200: {
                    description: 'Login exitoso',
                    content: {
                        'application/json': {
                            schema: resolver(
                                z.object({
                                    data: Login.OutputSchema,
                                }),
                            ),
                            example: {
                                data: Examples.AuthResponse,
                            },
                        },
                    },
                },
                401: ErrorResponses[401],
                500: ErrorResponses[500],
            },
        }),
        validator('json', Login.InputSchema),
        async (c) => {
            const body = c.req.valid('json');
            const result = await Login.execute(body);
            return c.json({ data: result }, 200);
        }
    );
