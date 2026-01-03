import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";
import { Config } from '../shared/config';
import { AppError } from "../shared/errors";


export namespace IA {

  // Esquema de validación para el análisis de tickets
  const CategoryEnum = z.enum(["login", "pago", "cuenta", "tecnico", "otro"]);
  const PriorityEnum = z.enum(["alta", "media", "baja"]);

  const TicketAnalysisSchema = z.object({
    categoria: CategoryEnum,
    prioridad: PriorityEnum,
  });

  type TicketAnalysis = z.infer<typeof TicketAnalysisSchema>;


  // Prompts para clasificación y asistencia
  const PROMPTS = {
    CLASSIFICATION: `Eres un clasificador experto de tickets de soporte técnico.

**TU TAREA:**
Analiza el ticket y determina:
1. La categoría más apropiada según el problema descrito
2. La prioridad basándote en la urgencia e impacto

**CATEGORÍAS DISPONIBLES:**
"login", "pago", "cuenta", "tecnico", "otro"

**NIVELES DE PRIORIDAD:**
- "alta": Problema urgente o crítico que afecta muchas funciones o usuarios
- "media": Funcionalidad importante afectada pero con soluciones alternativas disponibles
- "baja": Problema menor o consulta sin impacto significativo

**REGLAS ESTRICTAS:**
- Responde ÚNICAMENTE con JSON válido
- NO uses markdown, backticks ni explicaciones
- Usa las categorías y prioridades EXACTAMENTE como se especifican
- No des explicaciones.
- Sé consistente en la clasificación

**TICKET A ANALIZAR:**
Título: {{titulo}}
Descripción: {{descripcion}}

**FORMATO DE SAIDA EN JSON:**
{
  "categoria": "string",
  "prioridad": "string"
}`,

    ASSISTANT: `Eres un asistente virtual de soporte técnico profesional y empático.

**TU ROL:**
- Ayudar al usuario a resolver su problema de manera efectiva
- Proporcionar respuestas claras, concisas y accionables
- Mantener un tono amable y profesional
- Usar el contexto del ticket y el historial para dar respuestas relevantes

**INFORMACIÓN DEL TICKET:**
• Título: {{titulo}}
• Descripción: {{descripcion}}
• Categoría: {{categoria}}
• Prioridad: {{prioridad}}

**HISTORIAL DE CONVERSACIÓN:**
{{historial}}

**ÚLTIMO MENSAJE DEL USUARIO:**
"{{mensajeUsuario}}"

**DIRECTRICES:**
✓ Sé específico y directo
✓ Limita la respuesta a 1-3 frases máximo, o aproximadamente 30 palabras.
✓ No hagas explicaciones largas, solo lo necesario.
✓ Ofrece soluciones paso a paso cuando sea apropiado.
✓ Reconoce la frustración del usuario con empatía.
✓ Si no tienes información, admítelo honestamente.
✓ Si ya se ha encontrado una solución, sugiere que el usuario cierre el ticket o indique si el problema persiste. Si el problema no tiene solución inmediata, sugiere que se mantenga en espera para futuras actualizaciones.

**RESTRICCIONES:**
✗ NO inventes datos de la cuenta del usuario
✗ NO hagas promesas sobre tiempos que no puedes cumplir
✗ NO uses formato JSON o markdown en tu respuesta
✗ NO repitas información ya mencionada en el historial

**RESPONDE EN ESPAÑOL, EN TEXTO PLANO:**`,
  };

  // Configuración de la IA
  const google = createGoogleGenerativeAI({
    apiKey: Config.GEMINI_API_KEY,
  });

  // Funciones utilitarias
  function sanitizeInput(text: string): string {
    return text.trim().slice(0, 5000);
  }

  function extractJSON(text: string): string {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : "";
  }

  // Función  para analizar tickets
  export async function analyzeTicket(titulo: string, descripcion: string): Promise<TicketAnalysis> {
    try {
      const prompt = PROMPTS.CLASSIFICATION.replace("{{titulo}}", sanitizeInput(titulo)).replace("{{descripcion}}", sanitizeInput(descripcion));
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
        temperature: 0.3,
      });

      const cleaned = extractJSON(text);
      const parsed = JSON.parse(cleaned);
      return TicketAnalysisSchema.parse(parsed);

    } catch (error) {
      console.error("Error en analyzeTicket:", error);
      return { categoria: "otro", prioridad: "media" };
    }
  }

  // Función para generar respuestas de asistencia
  export async function assistTicket(params: { titulo: string, descripcion: string, categoria: string, prioridad: string, historial: string, mensajeUsuario: string }): Promise<string> {
    try {
      const prompt = PROMPTS.ASSISTANT.replace("{{titulo}}", sanitizeInput(params.titulo))
        .replace("{{descripcion}}", sanitizeInput(params.descripcion))
        .replace("{{categoria}}", params.categoria)
        .replace("{{prioridad}}", params.prioridad)
        .replace("{{historial}}", sanitizeInput(params.historial))
        .replace("{{mensajeUsuario}}", sanitizeInput(params.mensajeUsuario));

      const { text } = await generateText({
        model: google("gemini-2.5-flash-lite"),
        prompt,
        temperature: 0.6,
      });

      const response = text.trim();
      if (!response || response.length < 10) throw new Error("Respuesta demasiado corta.");
      return response;

    } catch (error) {
      console.error("Error en assistTicket:", error);
      throw AppError.internal("No se pudo generar una respuesta. Por favor, intenta de nuevo.", "ai_generation_failed");
    }
  }
}
