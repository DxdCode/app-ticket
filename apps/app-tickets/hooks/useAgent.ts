import { client } from "@/services/cliente";
import { ApiErrorResponse } from "@/types/api-error";
import { TicketResponse } from "@/types/type-ticket";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";

export function useAgentTickets() {
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAgentTickets = async (): Promise<TicketResponse[]> => {
        setLoading(true);
        setError(null);

        try {
            const res = await client.api.agent.tickets.list.$get();
            const body = await res.json() as any

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse))
            }
            setTickets(body.data as TicketResponse[]);
            return body.data;
        } catch (err) {
            setError("Error de conexión. Verifica tu internet.");
            return [];
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getAgentTickets();
    }, []);

    return { tickets, loading, error, getAgentTickets };
}