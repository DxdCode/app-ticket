import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { Config } from '../shared/config';

// PROMPTS 
export const PromptA = `
Eres un clasificador de tickets de soporte.

Tu tarea:
- Analiza el ticket.
- Identifica la categoría correcta y la prioridad.

Devuelve estrictamente:
- categoria: uno de ["login", "pago", "cuenta", "tecnico", "otro"]
- prioridad: uno de ["alta", "media", "baja"]

Reglas:
- Responde SOLO con un objeto JSON.
- No uses markdown.
- No des explicaciones.
- No agregues texto extra.
- RESPONDE EN ESPAÑOL.

Ticket:
TITULO: {{titulo}}
DESCRIPCION: {{descripcion}}

Formato de salida:
{
  "categoria": "string",
  "prioridad": "string"
}
`;

export const PromptB = `
Eres un asistente de soporte al cliente.

Tu tarea:
- Lee el contexto y el historial de conversación.
- Entiende el último mensaje del usuario.
- Responde de manera profesional, amable y clara.
- Mantén la respuesta concisa.
- NO inventes información de la cuenta.
- NO incluyas JSON ni markdown.
- RESPONDE EN ESPAÑOL.

Información del ticket:
TITULO: {{titulo}}
DESCRIPCION: {{descripcion}}
CATEGORIA: {{categoria}}
PRIORIDAD: {{prioridad}}

Historial de conversación (JSON array):
{{historial}}

Mensaje del usuario:
"{{mensajeUsuario}}"

Responde SOLO con el mensaje final del asistente en texto plano.
`;

export namespace IA {

  const google = createGoogleGenerativeAI({
    apiKey: Config.GEMINI_API_KEY
  });

  export async function analyzeTicket(titulo: string, descripcion: string) {
    const prompt = PromptA
      .replace("{{titulo}}", titulo)
      .replace("{{descripcion}}", descripcion);

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    const cleaned = text.replace(/```json|```/g, "").trim();
    console.log("IA analyzeTicket:", cleaned);

    return JSON.parse(cleaned);
  }

  export async function assistTicket({
    titulo,
    descripcion,
    categoria,
    prioridad,
    historial,
    mensajeUsuario
  }: {
    titulo: string;
    descripcion: string;
    categoria: string;
    prioridad: string;
    historial: string;
    mensajeUsuario: string;
  }) {
    const prompt = PromptB
      .replace("{{titulo}}", titulo)
      .replace("{{descripcion}}", descripcion)
      .replace("{{categoria}}", categoria)
      .replace("{{prioridad}}", prioridad)
      .replace("{{historial}}", historial)
      .replace("{{mensajeUsuario}}", mensajeUsuario);

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt,
    });

    const finalMessage = text.trim();
    console.log("IA assistTicket:", finalMessage);

    return finalMessage;
  }

}
