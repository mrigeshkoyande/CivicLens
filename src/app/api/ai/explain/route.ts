import { NextRequest, NextResponse } from "next/server";
import { explainConcept } from "@/lib/gemini";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { FALLBACK_RESPONSES } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  const limit = rateLimit(`explain:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // Validate input
  let body: { question?: string; language?: string; simplify?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question = body.question?.trim();
  const language = body.language ?? "English";
  const simplify = body.simplify ?? false;

  if (!question || question.length < 3) {
    return NextResponse.json({ error: "Question too short" }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json(
      { error: "Question too long (max 500 chars)" },
      { status: 400 }
    );
  }

  // Try Gemini, fall back to mock
  try {
    const answer = await explainConcept(question, language, simplify);
    return NextResponse.json({ answer, source: "gemini" });
  } catch {
    const fallback =
      FALLBACK_RESPONSES[question as keyof typeof FALLBACK_RESPONSES] ??
      FALLBACK_RESPONSES["default"];
    return NextResponse.json({ answer: fallback, source: "fallback" });
  }
}
