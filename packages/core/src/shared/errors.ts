/**
 * Custom error class for business logic errors
 * Provides type-safe error handling across the application
 */
export class AppError extends Error {
    constructor(
        public readonly type: "validation" | "authentication" | "forbidden" | "not_found" | "rate_limit" | "internal" | "conflict",
        public readonly code: string,
        message: string,
        public readonly param?: string,
        public readonly details?: any,
        public readonly statusCode: number = 400,
    ) {
        super(message);
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }

    toJSON() {
        return {
            type: this.type,
            code: this.code,
            message: this.message,
            param: this.param,
            details: this.details,
        };
    }

    // Helper methods para crear errores específicos
    static conflict(message: string, param?: string, code: string = "duplicate_resource") {
        return new AppError("conflict", code, message, param, undefined, 409);
    }

    static validation(message: string, param?: string, code: string = "invalid_parameter") {
        return new AppError("validation", code, message, param, undefined, 400);
    }

    static authentication(message: string, code: string = "unauthorized") {
        return new AppError("authentication", code, message, undefined, undefined, 401);
    }

    static notFound(message: string, code: string = "resource_not_found") {
        return new AppError("not_found", code, message, undefined, undefined, 404);
    }

    static forbidden(message: string, code: string = "forbidden") {
        return new AppError("forbidden", code, message, undefined, undefined, 403);
    }
}
