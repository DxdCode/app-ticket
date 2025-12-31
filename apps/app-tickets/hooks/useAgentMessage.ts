import { client } from "@/services/cliente";
import { ApiErrorResponse } from "@/types/api-error";
import { GetMessagesResponse, Message } from "@/types/type-messages";
import { parseApiError } from "@/utils/parseApiError";
import { useState, useCallback } from "react";

export function useAgentMessage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getMessagesTicketID = useCallback(async (ticketId: string): Promise<Message[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const res = await client.api.user.message.agent.list[":id"].messages.$get({
                param: { id: ticketId },
            })
            const body = await res.json() as GetMessagesResponse | ApiErrorResponse

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse))
                return null;
            }

            return (body as GetMessagesResponse).data;
        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessageAgent = useCallback(async (ticketId: string, message: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {

            const res = await client.api.user.message.agent.send[":id"].messages.$post({
                param: { id: ticketId },
                json: { message },
            });

            const body = await res.json() as any;
            
            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return false;
            }
            
            return true;

        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, getMessagesTicketID, sendMessageAgent };
}