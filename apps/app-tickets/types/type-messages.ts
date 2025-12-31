// Definición del tipo Message
export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  role: "user" | "agent" | "ia";
  message: string;
  timeCreated: string;
}

// Respuesta al enviar un mensaje
export interface SendMessageResponse {
  data: {
    messageId: string;
    suggestion: string;
  };
}

// Respuesta al obtener mensajes de un ticket
export interface GetMessagesResponse {
  data: Message[];
}