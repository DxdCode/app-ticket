// Definición del tipo ApiErrorResponse
export type ApiErrorResponse = {
    type?: string;
    code?: string;
    message?: string;
    details?: {
        issues?: {
            path: string;
            message: string;
        }[];
    };
};

