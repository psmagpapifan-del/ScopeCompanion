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
      console.log("Attempting to generate content using primary model: gemini-2.5-flash");
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: generateConfig
      });
    } catch (primaryError: any) {
      console.warn("Primary model (gemini-2.5-flash) failed. Falling back to gemini-1.5-flash. Error details:", primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
          config: generateConfig
        });
      } catch (fallbackError: any) {
        console.error("Fallback model (gemini-1.5-flash) also failed. Error details:", fallbackError);
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

// API endpoint to answer founder questions about the Software Development Lifecycle (SDLC)
app.post("/api/sdlc-help", async (req, res) => {
  try {
    const { question, targetLanguage, englishLevel } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Missing or invalid 'question' parameter." });
      return;
    }

    const ai = getGeminiClient();

    let languageInstruction = "";
    if (targetLanguage && targetLanguage !== "None") {
      languageInstruction = `Also, provide a warm 2-3 sentence translation or clear summary of the core concepts in ${targetLanguage} in the 'translation' field so they can understand in their native language.`;
    }

    const systemInstruction = `You are a friendly, patient, and expert Agile Software Coach who specializes in guiding non-technical, non-native English speaking business founders through the Software Development Lifecycle (SDLC).
Your goal is to answer their questions about building software, development processes, and industry jargon in extremely simple language (A2 to B1 English level).

Strict guidelines:
1. Break down technical concepts (sprints, staging, backend, databases, APIs, repository) into daily, everyday analogies (like restaurant operations, building a physical shop, sending mail).
2. Avoid idioms, complex grammar, and dry academic jargon.
3. Be supportive, practical, and action-oriented. Provide realistic, human answers.
4. ${languageInstruction}`;

    const prompt = `A business founder asks: "${question}". 
Target simplicity level: ${englishLevel || "simple"}.
Provide a clear explanation and real-life analogy, define any tricky words, and list 2-3 action steps they should take next.`;

    const generateConfig = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The original question asked by the user."
          },
          simpleAnswer: {
            type: Type.STRING,
            description: "A very simple, encouraging, and clear answer in extremely plain English (A2-B1 level) explaining the SDLC concept."
          },
          analogy: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A creative, friendly title for the everyday analogy." },
              description: { type: Type.STRING, description: "The story or explanation of the analogy in plain words." }
            },
            required: ["title", "description"]
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING, description: "The complex software development or SDLC term used." },
                simpleDefinition: { type: Type.STRING, description: "A very clear, 1-sentence explanation of what it means in human words." }
              },
              required: ["term", "simpleDefinition"]
            },
            description: "2 or 3 technical terms that are helpful to know for this topic."
          },
          checklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: "A specific, simple task for the founder (e.g. 'Ask your developers to show you the staging app')." },
                why: { type: Type.STRING, description: "A brief, plain-English explanation of why this step is helpful." }
              },
              required: ["action", "why"]
            },
            description: "2 or 3 practical, concrete next steps the founder can take."
          },
          translation: {
            type: Type.STRING,
            description: "If a target language was specified, a clear 2-3 sentence summary of the key takeaways in that target language. Otherwise, leave empty."
          }
        },
        required: ["question", "simpleAnswer", "analogy", "vocabulary", "checklist", "translation"]
      }
    };

    let response;
    try {
      console.log("Attempting SDLC Help generation using primary model: gemini-2.5-flash");
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: generateConfig
      });
    } catch (primaryError: any) {
      console.warn("Primary model failed for SDLC Help, trying fallback (gemini-1.5-flash). Error:", primaryError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
          config: generateConfig
        });
      } catch (fallbackError: any) {
        console.error("Fallback model also failed for SDLC Help. Error:", fallbackError);
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
    console.error("Error in /api/sdlc-help:", error);
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
