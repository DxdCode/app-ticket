import { useState, useEffect } from "react";
import { client } from "@/services/cliente";
import { parseApiError } from "@/utils/parseApiError";
import { TicketResponse, TicketDetailResponse } from "@/types/type-ticket";
import { ApiErrorResponse } from "@/types/api-error";

export function useTickets(onSuccess?: () => void) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [ticketDetail, setTicketDetail] = useState<TicketDetailResponse | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Obtener todos los tickets
    const getTickets = async (): Promise<TicketResponse[]> => {
        setLoading(true);
        setError("");

        try {
            const res = await client.api.user.tickets.list.$get();
            const body = (await res.json()) as any;

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return [];
            }

            const responseTickets = body.data as TicketResponse[];
            setTickets(responseTickets);
            return responseTickets;
        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Cargar tickets al montar
    useEffect(() => {
        getTickets();
    }, []);

    // Obtener ticket por ID
    const getTicketById = async (id: string): Promise<TicketDetailResponse | null> => {
        setLoading(true);
        setError("");

        try {
            const res = await client.api.user.tickets.detail[":id"].$get({
                param: { id },
            });

            const body = (await res.json()) as any;

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return null;
            }

            const responseTicket = body.data as TicketDetailResponse;
            setTicketDetail(responseTicket);
            return responseTicket;
        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Crear ticket
    const createTicket = async (): Promise<boolean> => {
        if (loading) return false;

        if (!title.trim() || !description.trim()) {
            setError("Por favor, complete todos los campos.");
            return false;
        }

        setLoading(true);
        setError("");

        try {
            const res = await client.api.user.tickets.create.$post({
                json: { title, description },
            });

            const body = (await res.json()) as any;

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return false;
            }

            setTitle("");
            setDescription("");
            onSuccess?.();

            await getTickets();
            return true;
        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar ticket
    const deleteTicket = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError("");

        try {
            const res = await client.api.user.tickets.delete[":id"].$delete({
                param: { id },
            });

            const body = (await res.json()) as any;

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return false;
            }

            setTickets((prev) => prev.filter((t) => t.id !== id));
            return true;
        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Cerrar ticket 
    const closeTicketStatus = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError("");

        try {
            const res = await client.api.user.tickets.close[":id"].$patch({
                param: { id },
            })

            const body = (await res.json()) as any;

            if (!res.ok) {
                setError(parseApiError(body as ApiErrorResponse));
                return false;
            }

            
            setTickets(prev =>
                prev.map(ticket =>
                    ticket.id === id
                        ? { ...ticket, status: "resolved" } 
                        : ticket
                )
            );
            return true;
        } catch (e) {
            setError("Error de conexión. Verifica tu internet.");
            return false;
        } finally {
            setLoading(false);
        }
    }
    // Reset formulario
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setError("");
    };

    return {
        tickets,
        ticketDetail,
        loading,
        error,
        title,
        description,
        setTitle,
        setDescription,
        getTickets,
        getTicketById,
        createTicket,
        deleteTicket,
        closeTicketStatus,
        resetForm,
        setError,
    };
}