import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to simplify tech jargon for non-native speakers
app.post("/api/simplify", async (req, res) => {
  try {
    const { text, targetLanguage, englishLevel } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Missing or invalid 'text' parameter." });
      return;
    }

    const ai = getGeminiClient();

    let languageInstruction = "";
    if (targetLanguage && targetLanguage !== "None") {
      languageInstruction = `Also, provide a translation or brief explanation of the term in ${targetLanguage}. Keep the language simple and helpful.`;
    }

    const systemInstruction = `You are an expert educator who specializes in explaining complex artificial intelligence and digital technology concepts to non-native English speakers. 
Your goal is to make these concepts immediately clear, friendly, and memorable using simple language and everyday analogies (like a personal helper, a restaurant chef, a library, etc.).

Strict rules for communication:
1. Avoid difficult technical words. If you must use a technical word, explain it immediately with a simple analogy.
2. Use short, clear sentences. Keep grammar simple (A2 to B1 English level).
3. Be encouraging and friendly. Do not sound clinical or dry.
4. ${languageInstruction}`;

    const prompt = `Please explain this technical term or concept: "${text}". 
Set the English level to: ${englishLevel || "simple"}.
Provide the response in the specified JSON format with an engaging everyday analogy.`;

    const generateConfig = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          term: {
            type: Type.STRING,
            description: "The term being explained."
          },
          shortDefinition: {
            type: Type.STRING,
            description: "A very simple, 1-sentence definition of what this is in extremely plain English."
          },
          analogyTitle: {
            type: Type.STRING,
            description: "A creative, friendly title for the analogy (e.g., 'The Digital Chef' or 'The Helpful Guide Dog')."
          },
          analogyText: {
            type: Type.STRING,
            description: "An engaging, simple, story-like explanation of the analogy in plain English."
          },
          simpleExplanation: {
            type: Type.STRING,
            description: "A simple 2-3 sentence explanation of how the technology works using the analogy."
          },
          keyPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "A simple, 2-3 word name for this key aspect." },
                description: { type: Type.STRING, description: "A super simple 1-sentence detail." }
              }
            },
            description: "2 or 3 super easy key takeaways."
          },
          translation: {
            type: Type.STRING,
            description: "If a target language was specified, a warm 1-2 sentence translation or equivalent explanation in that target language. Otherwise, leave empty."
          }
        },
        required: ["term", "shortDefinition", "analogyTitle", "analogyText", "simpleExplanation", "keyPoints", "translation"]
      }
    };

    let response;
    try {
      console.log("Attempting to generate content using primary model: gemini-3.5-flash");
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: generateConfig
      });
    } catch (primaryError: any) {
      console.warn("Primary model (gemini-3.5-flash) failed. Falling back to gemini-3.1-flash-lite. Error details:", primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: generateConfig
        });
      } catch (fallbackError: any) {
        console.error("Fallback model (gemini-3.1-flash-lite) also failed. Error details:", fallbackError);
        throw new Error(`AI service is currently unavailable. Primary error: ${primaryError.message || primaryError}. Fallback error: ${fallbackError.message || fallbackError}`);
      }
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from Gemini.");
    }

    const parsed = JSON.parse(resultText.trim());
    res.json(parsed);

  } catch (error: any) {
    console.error("Error in /api/simplify:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred while communicating with the AI service." 
    });
  }
});

// Vite middleware or static serving setup
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
