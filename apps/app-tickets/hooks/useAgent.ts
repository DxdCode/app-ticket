import { client } from "@/services/cliente";
import { ApiErrorResponse } from "@/types/api-error";
import { Categories, Priority, Status, TicketResponse } from "@/types/type-ticket";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";

interface TicketFilters {
    status?: Status;
    priority?: Priority;
    category?: Categories;
}

export function useAgentTickets() {
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAgentTickets = async (filters?: TicketFilters): Promise<TicketResponse[]> => {
        setLoading(true);
        setError(null);

        try {
            const queryParams: Record<string, string> = {};
            
            if (filters?.status) {
                queryParams.status = filters.status;
            }
            
            if (filters?.priority) {
                queryParams.priority = filters.priority;
            }
            
            if (filters?.category) {
                queryParams.category = filters.category;
            }

            const res = await client.api.agent.tickets.list.$get({
                query: queryParams as any,
            });

            const body = (await res.json()) as any;

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return [];
            }

            const responseTickets = body.data as TicketResponse[];
            setTickets(responseTickets);
            return responseTickets;
        } catch {
            setError("Error de conexión. Verifica tu internet.");
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAgentTickets();
    }, []);

    return {
        tickets,
        loading,
        error,
        getAgentTickets,
    };
}
