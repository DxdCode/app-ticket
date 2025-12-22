import "zod-openapi/extend";
import { z } from "zod";

/**
 * Standard error response schema (single source of truth)
 */
export const ErrorResponse = z
    .object({
        type: z
            .enum([
                "validation",
                "authentication",
                "forbidden",
                "not_found",
                "rate_limit",
                "internal",
                "conflict",
                "authorization",
            ])
            .openapi({
                description: "The error type category",
            }),

        code: z.string().openapi({
            description: "Machine-readable error code identifier",
        }),

        message: z.string().openapi({
            description: "Human-readable error message",
        }),

        param: z
            .string()
            .optional()
            .openapi({
                description: "The parameter that caused the error",
            }),

        details: z.any().optional().openapi({
            description: "Additional error context information",
        }),
    })
    .openapi({ ref: "ErrorResponse" });

export type ErrorResponseType = z.infer<typeof ErrorResponse>;

/**
 * Centralized error codes
 */
export const ErrorCodes = {
    Validation: {
        INVALID_PARAMETER: "invalid_parameter",
        MISSING_REQUIRED_FIELD: "missing_required_field",
        INVALID_FORMAT: "invalid_format",
    },

    Authentication: {
        UNAUTHORIZED: "unauthorized",
        INVALID_TOKEN: "invalid_token",
        INVALID_CREDENTIALS: "invalid_credentials",
    },

    Permission: {
        FORBIDDEN: "forbidden",
    },

    Authorization: {
        FORBIDDEN: "forbidden",
    },

    NotFound: {
        RESOURCE_NOT_FOUND: "resource_not_found",
    },

    RateLimit: {
        TOO_MANY_REQUESTS: "too_many_requests",
    },

    Conflict: {
        DUPLICATE_RESOURCE: "duplicate_resource",
        EMAIL_ALREADY_EXISTS: "email_already_exists",
        USERNAME_ALREADY_EXISTS: "username_already_exists",
    },

    Server: {
        INTERNAL_ERROR: "internal_error",
    },
} as const;
