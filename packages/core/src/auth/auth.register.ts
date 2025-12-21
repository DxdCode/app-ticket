import { z } from "zod";
import { eq } from "drizzle-orm";
import { fn } from "../shared/fn";
import { createID } from "../shared/id";
import { Drizzle } from "../shared/drizzle";
import { userTable } from "./auth.sql";
import { Password } from "./auth.password";
import { Token } from "./auth.token";
import { Examples } from "../examples";
import { AppError } from "../shared/errors";

export namespace Register {

    export const InputSchema = z
        .object({
            email: z.string().email().openapi({
                description: "Correo electrónico válido del usuario",
                example: Examples.Register.email,
            }),
            username: z.string().min(3).max(255).openapi({
                description: "Nombre visible del usuario",
                example: Examples.Register.username,
            }),
            password: z.string().min(8).openapi({
                description: "Contraseña segura del usuario",
                example: Examples.Register.password,
            }),
        })
        .openapi({
            ref: "RegisterInput",
            description: "Datos para registro de usuario",
            example: Examples.Register,
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
            ref: "RegisterOutput",
            description: "Respuesta de registro",
            example: Examples.AuthResponse,
        });

    export const execute = fn(InputSchema, async (data) => {
        const existing = await Drizzle.db
            .select()
            .from(userTable)
            .where(eq(userTable.email, data.email))
            .limit(1);

        if (existing.length > 0) {
            throw AppError.conflict(
                "El email ya está registrado",
                "email",
                "email_already_exists"
            );
        }

        const id = createID("user");
        const password = await Password.hash(data.password);

        const [user] = await Drizzle.db
            .insert(userTable)
            .values({
                id,
                email: data.email,
                username: data.username,
                password,
            })
            .returning();

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
