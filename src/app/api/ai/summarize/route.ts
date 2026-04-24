import { NextRequest, NextResponse } from "next/server";
import { summarizeManifesto } from "@/lib/gemini";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`summarize:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: { manifesto?: string; candidateName?: string; simplify?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { manifesto, candidateName, simplify = false } = body;
  if (!manifesto || !candidateName) {
    return NextResponse.json({ error: "manifesto and candidateName required" }, { status: 400 });
  }

  try {
    const summary = await summarizeManifesto(manifesto, candidateName, simplify);
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ error: "AI unavailable", summary: manifesto }, { status: 200 });
  }
}
