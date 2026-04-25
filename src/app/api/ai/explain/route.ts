import { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  const limit = await rateLimit(`explain:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!limit.success) {
    return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), { status: 429 });
  }

  // Parse standard Vercel AI SDK 'messages' format
  let body: { messages: any[], language?: string, simplify?: boolean };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const { messages, language = "English", simplify = false } = body;
  
  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Missing messages" }), { status: 400 });
  }

  const langInstruction =
    language === "Hindi" ? "Respond in Hindi."
    : language === "Marathi" ? "Respond in Marathi."
    : "Respond in English.";

  const levelInstruction = simplify
    ? "Explain like you're talking to a 15-year-old. Use simple words."
    : "Provide a clear, informative answer suitable for an educated adult citizen.";

  const systemPrompt = `You are JanVote AI, a trustworthy civic education assistant. ${langInstruction} ${levelInstruction} Keep it concise.`;

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages,
    system: systemPrompt,
  });

  return result.toTextStreamResponse();
}

