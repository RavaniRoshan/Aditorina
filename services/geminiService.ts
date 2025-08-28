
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { AiEditResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithPrompt = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<AiEditResult> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const result: AiEditResult = {
      editedImage: null,
      textResponse: null,
    };
    
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            result.textResponse = part.text;
          } else if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            result.editedImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          }
        }
    }

    if (!result.editedImage) {
        throw new Error("API did not return an edited image.");
    }

    return result;

  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to edit image: ${errorMessage}`);
  }
};
