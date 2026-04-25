import { z } from "zod";

// Gemini AI client wrapper with fallbacks

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

// Simple in-memory cache for efficiency
const aiCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function callGemini(prompt: string, temperature = 0.7): Promise<string> {
  const cacheKey = JSON.stringify({ prompt, temperature });
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY not configured");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: 1024,
        topP: 0.9,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data: GeminiResponse = await response.json();
  const result = data.candidates[0]?.content?.parts[0]?.text ?? "";
  
  aiCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

// ─── Explainer ────────────────────────────────────────────────────────────────

export async function explainConcept(
  question: string,
  language: string,
  simplify: boolean
): Promise<string> {
  const langInstruction =
    language === "Hindi"
      ? "Respond in Hindi (Devanagari script)."
      : language === "Marathi"
      ? "Respond in Marathi (Devanagari script)."
      : "Respond in English.";

  const levelInstruction = simplify
    ? "Explain like you're talking to a 15-year-old with no political knowledge. Use simple words, short sentences, and relatable examples from daily life in India."
    : "Provide a clear, informative answer suitable for an educated adult citizen.";

  const prompt = `You are JanVote AI, a friendly and trustworthy civic education assistant for Indian elections. ${langInstruction}

${levelInstruction}

User question: "${question}"

Important rules:
- Only provide factual information about Indian elections
- Do not support or oppose any political party or candidate
- If you don't know something, say so honestly
- Keep your answer concise (2-4 paragraphs max)
- Use **bold** for key terms`;

  return callGemini(prompt);
}

// ─── Fact Checker ─────────────────────────────────────────────────────────────

export const FactCheckSchema = z.object({
  verdict: z.enum(["TRUE", "MISLEADING", "FALSE"]),
  confidence: z.number().min(0).max(100),
  reasoning: z.string(),
  points: z.array(z.string()).optional()
});

export type FactCheckOutput = z.infer<typeof FactCheckSchema> & { claim: string };

export async function checkFact(claim: string): Promise<FactCheckOutput> {
  const prompt = `You are a fact-checking AI for Indian elections. Analyze the following claim and respond ONLY with valid JSON (no markdown, no explanation outside JSON).

Claim: "${claim}"

Respond with this exact JSON structure:
{
  "verdict": "TRUE" | "MISLEADING" | "FALSE",
  "confidence": <number 0-100>,
  "reasoning": "<2-3 sentence explanation>",
  "points": ["<evidence point 1>", "<evidence point 2>", "<evidence point 3>"]
}

Rules:
- Be objective and non-partisan
- Base your analysis on known facts about Indian democracy and election law
- confidence should reflect how certain you are`;

  const raw = await callGemini(prompt, 0.1); // Low temp for JSON stability
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid JSON from Gemini");

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    // Validate structural integrity with Zod
    const validatedData = FactCheckSchema.parse(parsed);
    
    return {
      ...validatedData,
      points: validatedData.points ?? [],
      claim,
    };
  } catch (error) {
    console.error("Zod Validation Error or JSON Parse Error:", error);
    throw new Error("AI returned malformed or invalid response structure");
  }
}

// ─── Manifesto Summarizer ─────────────────────────────────────────────────────

export async function summarizeManifesto(
  manifesto: string,
  candidateName: string,
  simplify: boolean
): Promise<string> {
  const levelInstruction = simplify
    ? "Summarize this in 2-3 simple sentences a 15-year-old would understand."
    : "Provide a concise 3-4 sentence summary highlighting key promises.";

  const prompt = `You are a neutral political analyst. ${levelInstruction}

Candidate: ${candidateName}
Manifesto points: ${manifesto}

Important: Stay completely neutral. Do not endorse or criticize.`;

  return callGemini(prompt);
}
