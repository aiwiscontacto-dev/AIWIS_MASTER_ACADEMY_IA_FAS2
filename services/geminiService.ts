
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateQuizFromContent = async (content: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un examen de 5 preguntas de opción múltiple basado en el siguiente contenido educativo: \n\n${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 opciones posibles"
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "Índice de la respuesta correcta (0-3)"
              }
            },
            required: ["question", "options", "correctAnswer"]
          }
        },
        systemInstruction: "Eres un experto pedagogo. Crea preguntas desafiantes pero justas."
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};

export const summarizeContent = async (text: string | undefined) => {
  if (!text) return "No hay contenido para resumir.";
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resume este contenido de clase de forma ejecutiva: ${text}`,
    });
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    return "Error al generar resumen.";
  }
};

// Aliased to support ClassManager.tsx import
export const summarizeTranscript = summarizeContent;

// Added to support ClassDetail.tsx import
export const chatWithClass = async (transcription: string | undefined, question: string) => {
  if (!transcription) return "Lo siento, no hay transcripción disponible para responder.";
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Basándote en esta transcripción: "${transcription}", responde a la siguiente pregunta: ${question}`,
      config: {
        systemInstruction: "Eres un tutor experto que ayuda a los estudiantes a entender el contenido de la clase. Responde de forma clara y concisa."
      }
    });
    return response.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Lo siento, hubo un error al procesar tu pregunta.";
  }
};
