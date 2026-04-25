import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

// Use Edge runtime for maximum efficiency
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const { sliders } = await req.json();

    if (!sliders || typeof sliders !== 'object') {
      return NextResponse.json({ error: "Invalid sliders data" }, { status: 400 });
    }

    const prompt = `
      Act as an expert Indian macro-economist. The user is adjusting national budget allocations via an interactive sandbox.
      
      Current user adjustments (Percentage change from current baseline):
      ${Object.entries(sliders).map(([key, value]) => `- ${key}: ${value}%`).join('\n')}

      Your task is to analyze these changes and determine the realistic economic tradeoffs. 
      If they increase budget in one area significantly, where must cuts be made? What are the short-term and long-term impacts?
      
      Return the response STRICTLY as a JSON object with this exact structure:
      {
        "tradeoffs": [
          {
            "sectorAffected": "String (e.g., Infrastructure, Healthcare, Debt Servicing)",
            "impact": "String (e.g., 'Will face a 5% budget cut to accommodate the increase.')",
            "severity": "High" | "Medium" | "Low"
          }
        ],
        "economicAnalysis": "String (A 2-3 sentence engaging explanation of the reality of these budget choices.)",
        "feasibilityScore": Number (1-100, where 100 is completely realistic and 1 is impossible/bankrupting)
      }
      
      Do not include markdown blocks like \`\`\`json. Return only the raw JSON string.
    `;

    const response = await callGemini(prompt, 0.2); // Low temp for more consistent JSON
    
    // Attempt to parse the response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      console.error("Gemini failed to return valid JSON", response);
      // Fallback response if AI hallucinates
      parsedResponse = {
        tradeoffs: [
          { sectorAffected: "General Budget", impact: "Unable to calculate precise tradeoffs due to complex inputs.", severity: "Medium" }
        ],
        economicAnalysis: "The requested budget shifts are highly complex and require deeper parliamentary review to determine exact funding sources.",
        feasibilityScore: 50
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("[Sandbox API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process economic simulation." },
      { status: 500 }
    );
  }
}
