import { z } from "zod";
import { Common } from "../shared/common";
import { Examples } from "../examples";

export { Token } from "./auth.token";
export { Password } from "./auth.password";
export { Register } from "./auth.register";
export { Login } from "./auth.login";

import { Drizzle } from "../shared/drizzle";
import { userTable } from "./auth.sql";
import { eq } from "drizzle-orm";
import { AppError } from "../shared/errors";
import { fn } from "../shared/fn";

export namespace User {


    export const RoleEnum = z
        .enum(["user", "agent", "ai"])
        .openapi({
            description: "Rol del usuario",
            example: "user",
        });

    export type Role = z.infer<typeof RoleEnum>;


    export const InfoSchema = z
        .object({
            id: z.string().openapi({
                description: Common.IdDescription,
                example: Examples.User.id,
            }),
            email: z.string().email().openapi({
                description: "Correo electrónico del usuario",
                example: Examples.User.email,
            }),
            username: z.string().openapi({
                description: "Nombre visible del usuario",
                example: Examples.User.username,
            }),
            role: RoleEnum,
        })
        .openapi({
            ref: "User",
            description: "Información pública del usuario",
            example: {
                id: Examples.User.id,
                email: Examples.User.email,
                username: Examples.User.username,
                role: "user",
            },
        });

    export type Info = z.infer<typeof InfoSchema>;


    export function serialize(
        input: typeof userTable.$inferSelect
    ): Info {
        return {
            id: input.id,
            email: input.email,
            username: input.username,
            role: input.role || "user",
        };
    }

    /**
     * Obtiene el perfil del usuario autenticado
     */
    export const getProfile = fn(
        z.object({
            userId: z.string().openapi({
                description: "ID del usuario autenticado",
                example: Examples.User.id,
            }),
        }),
        async ({ userId }) => {

            const [user] = await Drizzle.db
                .select()
                .from(userTable)
                .where(eq(userTable.id, userId))
                .limit(1);

            if (!user) {
                throw AppError.notFound(
                    "Usuario no encontrado",
                    "resource_not_found"
                );
            }

            return serialize(user);
        }
    );
}
