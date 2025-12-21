import { z } from "zod";
import { eq } from "drizzle-orm";
import { fn } from "../shared/fn";
import { Drizzle } from "../shared/drizzle";
import { userTable } from "./auth.sql";
import { Password } from "./auth.password";
import { Token } from "./auth.token";
import { Examples } from "../examples";
import { AppError } from "../shared/errors";

export namespace Login {

    export const InputSchema = z
        .object({
            email: z.string().email().openapi({
                description: "Correo electrónico del usuario",
                example: Examples.Login.email,
            }),
            password: z.string().min(8).openapi({
                description: "Contraseña del usuario",
                example: Examples.Login.password,
            }),
        })
        .openapi({
            ref: "LoginInput",
            description: "Credenciales de inicio de sesión",
            example: Examples.Login,
        });

    export const OutputSchema = z
        .object({
            user: z.object({
                id: z.string().openapi({
                    description: "ID único del usuario",
                    example: Examples.AuthResponse.user.id,
                }),
                email: z.string().email().openapi({
                    description: "Correo del usuario",
                    example: Examples.AuthResponse.user.email,
                }),
                username: z.string().openapi({
                    description: "Nombre visible del usuario",
                    example: Examples.AuthResponse.user.username,
                }),
                role: z.enum(["user", "agent", "ai"]).openapi({
                    description: "Rol del usuario",
                    example: "user",
                }),
            }),
            token: z.string().openapi({
                description: "Token JWT generado",
                example: Examples.AuthResponse.token,
            }),
        })
        .openapi({
            ref: "LoginOutput",
            description: "Respuesta de autenticación",
            example: Examples.AuthResponse,
        });

    export const execute = fn(InputSchema, async (data) => {
        const [user] = await Drizzle.db
            .select()
            .from(userTable)
            .where(eq(userTable.email, data.email))
            .limit(1);

        if (!user) {
            throw AppError.authentication(
                "Email o contraseña incorrectos",
                "invalid_credentials"
            );
        }

        const ok = await Password.verify(data.password, user.password);
        if (!ok) {
            throw AppError.authentication(
                "Email o contraseña incorrectos",
                "invalid_credentials"
            );
        }

        const token = Token.generate({
            userId: user.id,
            email: user.email,
            role: user.role || "user",
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role || "user",
            },
            token,
        };
    });
}
