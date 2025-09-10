
import { GoogleGenAI, Type } from "@google/genai";
import type { Quote } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quoteSchema = {
  type: Type.OBJECT,
  properties: {
    quote: {
      type: Type.STRING,
      description: "The generated quote text.",
    },
    author: {
      type: Type.STRING,
      description: "The author of the quote. This can be a real or fictional persona that fits the quote's theme.",
    },
  },
  required: ["quote", "author"],
};

export const generateQuote = async (topic: string): Promise<Quote> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a profound, insightful, and unique quote about "${topic}". The quote should be inspiring and thought-provoking.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: quoteSchema,
    },
  });

  const jsonString = response.text.trim();
  try {
    return JSON.parse(jsonString) as Quote;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", jsonString);
    throw new Error("Received malformed data from the AI.");
  }
};

export const getInitialQuotes = async (category: string): Promise<Quote[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a list of 5 famous and inspiring quotes related to the category: "${category}".`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: quoteSchema,
            },
        },
    });

    const jsonString = response.text.trim();
    try {
        const quotes = JSON.parse(jsonString) as Quote[];
        return quotes.filter(q => q.quote && q.author); // Basic validation
    } catch (e) {
        console.error("Failed to parse initial quotes JSON:", jsonString);
        return []; // Return empty array on failure
    }
};

export const explainQuote = async (quote: string, author: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Provide a brief, insightful explanation of the following quote by ${author}: "${quote}". Explain its deeper meaning and how it can be applied to modern life. Keep it concise, under 150 words.`,
  });
  return response.text;
};

export const generateQuoteImage = async (quote: string): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `Create a visually stunning, artistic, and thematic background image that represents the essence of the quote: "${quote}". The style should be cinematic, atmospheric, and abstract. Do NOT include any text, letters, or words in the image. Focus on mood and symbolism.`,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  } else {
    throw new Error("Image generation failed or returned no images.");
  }
};
