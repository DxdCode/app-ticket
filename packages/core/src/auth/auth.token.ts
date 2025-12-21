import jwt from "jsonwebtoken";
import { z } from "zod";
import { Config } from "../shared/config";
import { AppError } from "../shared/errors";

export namespace Token {
    export const PayloadSchema = z.object({
        userId: z.string(),
        email: z.string(),
        role: z.enum(["user", "agent", "ai"]),
    });

    export type Payload = z.infer<typeof PayloadSchema>;

    export function generate(payload: Payload): string {
        return jwt.sign(payload, Config.JWT_SECRET, {
            expiresIn: "7d",
        });
    }

    export function verify(token: string): Payload {
        try {
            const decoded = jwt.verify(token, Config.JWT_SECRET);
            return PayloadSchema.parse(decoded);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw AppError.authentication("Token has expired", "token_expired");
            }
            throw AppError.authentication("Invalid token", "invalid_token");
        }
    }
}
