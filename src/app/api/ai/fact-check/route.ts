import { NextRequest, NextResponse } from "next/server";
import { checkFact } from "@/lib/gemini";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MOCK_RESULT = {
  verdict: "FALSE" as const,
  confidence: 92,
  reasoning:
    "EVMs used in Indian elections are standalone devices with no wireless communication capabilities. Independent technical audits and ECI documentation confirm the absence of WiFi, Bluetooth, or cellular modules.",
  points: [
    "Technical Verification: Teardown reports from independent technical audits confirm the absence of RF transmitters/receivers.",
    "Source Tracing: This specific phrasing originated from an unverified social media post and has been debunked by multiple independent fact-checking organizations.",
    "Contextual Mismatch: Video evidence circulated with the claim actually shows a polling officer connecting their personal smartphone to a public hotspot, unrelated to the EVM apparatus.",
  ],
  claim: "",
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`factcheck:${ip}`, { limit: 8, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait." },
      { status: 429 }
    );
  }

  let body: { claim?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const claim = body.claim?.trim();
  if (!claim || claim.length < 10) {
    return NextResponse.json({ error: "Claim too short" }, { status: 400 });
  }
  if (claim.length > 5000) {
    return NextResponse.json(
      { error: "Claim too long (max 5000 chars)" },
      { status: 400 }
    );
  }

  try {
    const result = await checkFact(claim);
    return NextResponse.json({ ...result, source: "gemini" });
  } catch {
    return NextResponse.json({
      ...MOCK_RESULT,
      claim,
      source: "fallback",
    });
  }
}
