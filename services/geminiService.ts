import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResult, IncidentType, Severity } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeIncident = async (description: string): Promise<AiAnalysisResult> => {
  if (!ai) {
    console.warn("Gemini API key not found. Using mock analysis.");
    return mockAnalysis(description);
  }

  try {
    const model = 'gemini-2.5-flash-latest';
    const prompt = `Analyze the following emergency distress description. 
    Classify the severity (CRITICAL, MODERATE, LOW) and the type of incident (MEDICAL, SHELTER, ABANDONMENT, OTHER).
    Provide a brief summary and a recommended immediate action.
    
    Description: "${description}"`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ['CRITICAL', 'MODERATE', 'LOW'] },
            type: { type: Type.STRING, enum: ['MEDICAL', 'SHELTER', 'ABANDONMENT', 'OTHER'] },
            summary: { type: Type.STRING },
            recommendedAction: { type: Type.STRING }
          },
          required: ['severity', 'type', 'summary', 'recommendedAction']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return mockAnalysis(description);
  }
};

const mockAnalysis = (text: string): AiAnalysisResult => {
  const lower = text.toLowerCase();
  let severity: Severity = 'LOW';
  if (lower.includes('blood') || lower.includes('unconscious') || lower.includes('dying') || lower.includes('pain')) {
    severity = 'CRITICAL';
  } else if (lower.includes('hungry') || lower.includes('lost') || lower.includes('help')) {
    severity = 'MODERATE';
  }

  let type: IncidentType = 'OTHER';
  if (lower.includes('wound') || lower.includes('sick') || lower.includes('doctor')) type = 'MEDICAL';
  else if (lower.includes('sleep') || lower.includes('home') || lower.includes('cold')) type = 'SHELTER';
  else if (lower.includes('alone') || lower.includes('abandoned')) type = 'ABANDONMENT';

  return {
    severity,
    type,
    summary: "Automated analysis (AI unavailable)",
    recommendedAction: "Dispatch nearest volunteer for assessment."
  };
};
