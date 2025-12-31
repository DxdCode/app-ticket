import { client } from "@/services/cliente";
import { ApiErrorResponse } from "@/types/api-error";
import { GetMessagesResponse, Message, SendMessageResponse } from "@/types/type-messages";
import { parseApiError } from "@/utils/parseApiError";
import { useState } from "react";

export function useMessages() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (ticketId: string, message: string): Promise<SendMessageResponse["data"] | null> => {
    setLoading(true);
    setError("");

    try {
      const res = await client.api.user.message.send[":id"].messages.$post({
        param: { id: ticketId },
        json: { message },
      });

      const body = (await res.json()) as SendMessageResponse | ApiErrorResponse;

      if (!res.ok) {
        setError(parseApiError(body as ApiErrorResponse));
        return null;
      }
      return (body as SendMessageResponse).data;
      
    } catch {
      setError("Error de conexión. Verifica tu internet.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (ticketId: string): Promise<Message[] | null> => {
    setLoading(true);
    setError("");

    try {
      const res = await client.api.user.message.list[":id"].messages.$get({
        param: { id: ticketId },
      });

      const body = (await res.json()) as GetMessagesResponse | ApiErrorResponse;

      if (!res.ok) {
        setError(parseApiError(body as ApiErrorResponse));
        return null;
      }
      return (body as GetMessagesResponse).data;
    } catch {
      setError("Error de conexión. Verifica tu internet.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendMessage,
    getMessages,
    setError
  };
}