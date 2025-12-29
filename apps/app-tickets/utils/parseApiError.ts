import { ApiErrorResponse } from "@/types/api-error";

export function parseApiError(error: ApiErrorResponse): string {

    {/*
    1 Mensajes detallados de issues 
    2 Mensaje general del error
    3 Mensaje de error en general
    */}
    return (
        error.details?.issues?.map(i => i.message).join(", ") ??
        error.message ??
        "Error interno del servidor."
    );
}
