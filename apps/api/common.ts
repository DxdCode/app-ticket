import { z } from "zod";
import { resolver, validator as zodValidator } from "hono-openapi/zod";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { Token } from "@tickets/core";
import { ErrorResponse, ErrorCodes } from "./error";

/**
 * Standard success wrapper
 */
export function Result<T extends z.ZodTypeAny>(schema: T) {
  return resolver(
    z.object({
      data: schema,
    }),
  );
}

/**
 * Custom validator with standardized error format
 */
export const validator = (
  target: Parameters<typeof zodValidator>[0],
  schema: Parameters<typeof zodValidator>[1],
) => {
  return zodValidator(target, schema, (result, c) => {
    if (!result.success) {
      const issues = result.error.issues ?? [];

      const first = issues[0];

      return c.json(
        {
          type: "validation",
          code:
            first?.code === "invalid_type" && first?.received === "undefined"
              ? ErrorCodes.Validation.MISSING_REQUIRED_FIELD
              : ErrorCodes.Validation.INVALID_PARAMETER,
          message: first?.message ?? "Invalid request data",
          param: first?.path?.join("."),
          details: {
            issues: issues.map((issue) => ({
              path: issue.path.join("."),
              code: issue.code,
              message: issue.message,
            })),
          },
        },
        400,
      );
    }
  });
};

/**
 * Standard OpenAPI error responses
 */
export const ErrorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
  403: {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
  409: {
    description: "Conflict",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
  429: {
    description: "Too Many Requests",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: resolver(ErrorResponse),
      },
    },
  },
} as const;

/**
 * Error helper
 */
export function errorResponse(
  c: Context,
  payload: z.infer<typeof ErrorResponse>,
  status: ContentfulStatusCode,
) {
  return c.json(payload, status);
}

/**
 * Auth middleware (Bearer token)
 */
export async function authRequired(c: Context, next: () => Promise<void>) {
  const auth = c.req.header("Authorization") ?? "";

  if (!auth.startsWith("Bearer ")) {
    return errorResponse(
      c,
      {
        type: "authentication",
        code: ErrorCodes.Authentication.UNAUTHORIZED,
        message: "Missing or invalid Authorization header",
      },
      401,
    );
  }

  try {
    const payload = Token.verify(auth.slice(7));
    c.set("user", payload);
    await next();
  } catch {
    return errorResponse(
      c,
      {
        type: "authentication",
        code: ErrorCodes.Authentication.INVALID_TOKEN,
        message: "Invalid token",
      },
      401,
    );
  }
}

/**
 * Auth payload helper
 */
export function getAuthPayload(c: Context) {
  return c.get("user") as
    | { userId: string; email?: string; role?: "user" | "agent" | "ai" }
    | undefined;
}

/**
 * Role middleware
 */
export function roleRequired(role: "user" | "agent" | "ai") {
  return async (c: Context, next: () => Promise<void>) => {
    const user = getAuthPayload(c);

    if (!user || user.role !== role) {
      return errorResponse(
        c,
        {
          type: "authorization",
          code: ErrorCodes.Authorization.FORBIDDEN,
          message: "Insufficient permissions",
        },
        403,
      );
    }

    await next();
  };
}
