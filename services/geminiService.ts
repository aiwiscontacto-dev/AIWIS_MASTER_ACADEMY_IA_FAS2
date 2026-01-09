
import { GoogleGenAI } from "@google/genai";

// Standardized client initialization using process.env.API_KEY directly
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const summarizeTranscript = async (transcript: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-flash-preview for general text summarization
      model: 'gemini-3-flash-preview',
      contents: `Resume los puntos clave de esta transcripción de clase sobre adopción de IA: \n\n${transcript}`,
      config: {
        systemInstruction: "Eres un asistente académico experto en Inteligencia Artificial y Estrategia de Negocios. Resume de forma concisa con bullet points."
      }
    });
    // Correctly extracting text output from GenerateContentResponse
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la IA.";
  }
};

export const chatWithClass = async (transcript: string, question: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-flash-preview for tutoring conversational tasks
      model: 'gemini-3-flash-preview',
      contents: `Contexto de la clase: ${transcript}\n\nPregunta del alumno: ${question}`,
      config: {
        systemInstruction: "Eres un tutor de IA disponible para los alumnos de la Fase 2 de AIWIS. Responde preguntas basándote únicamente en la información de la clase proporcionada."
      }
    });
    // Correctly extracting text output from GenerateContentResponse
    return response.text || "Lo siento, no tengo esa información.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error en la consulta de IA.";
  }
};
