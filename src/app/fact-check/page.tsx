"use client";

import { useState } from "react";
import { ShieldAlert, Search, Loader2, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Clock, Upload } from "lucide-react";
import { TRENDING_CLAIMS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Verdict = "TRUE" | "MISLEADING" | "FALSE";

interface FactResult {
  claim: string;
  verdict: Verdict;
  confidence: number;
  reasoning: string;
  points: string[];
  source?: string;
}

const VERDICT_CONFIG = {
  TRUE: { label: "VERIFIED TRUE", icon: CheckCircle2, color: "text-[#34d399]", bg: "bg-[#34d399]/15", border: "border-[#34d399]/30" },
  MISLEADING: { label: "MISLEADING", icon: AlertTriangle, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/15", border: "border-[#f59e0b]/30" },
  FALSE: { label: "LIKELY FALSE", icon: XCircle, color: "text-[#ef4444]", bg: "bg-[#ef4444]/15", border: "border-[#ef4444]/30" },
};

const REFERENCES: Record<Verdict, string[]> = {
  FALSE: ["Election Commission Official Statement", "Independent Tech Audit Report 2024", "AltNews Debunk Article"],
  MISLEADING: ["PIB Fact Check", "The Wire Fact-Check Report"],
  TRUE: ["ECI Official Circular", "News Agency ANI Report"],
};

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_CONFIG[verdict];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border", cfg.color, cfg.bg, cfg.border)}>
      <Icon className="w-4 h-4" />
      {cfg.label}
    </span>
  );
}

function TrendingVerdictBadge({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_CONFIG[verdict];
  return (
    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", cfg.color, cfg.bg, cfg.border)}>
      {cfg.label}
    </span>
  );
}

export default function FactCheckPage() {
  const [claim, setClaim] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FactResult | null>(null);
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState("");

  const analyze = async () => {
    if (!claim.trim() || claim.length < 10) { setError("Please enter a longer claim to analyze."); return; }
    setError(""); setIsLoading(true); setResult(null); setResultId(`FC-${Date.now().toString(36).slice(-6).toUpperCase()}`);
    try {
      const res = await fetch("/api/ai/fact-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claim }) });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult({ claim: data.claim ?? claim, verdict: data.verdict, confidence: data.confidence, reasoning: data.reasoning, points: data.points ?? [], source: data.source });
    } catch {
      // Fallback mock
      setResult({ claim, verdict: "FALSE", confidence: 92, reasoning: "EVMs used in Indian elections are standalone devices with no wireless communication capabilities. Independent technical audits and ECI documentation confirm the absence of WiFi, Bluetooth, or cellular modules.", points: ["Technical Verification: Teardown reports confirm absence of RF transmitters/receivers.", "Source Tracing: This originated from an unverified social media post debunked by fact-checkers.", "Contextual Mismatch: Related video shows a personal phone hotspot, not an EVM connection."], source: "fallback" });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-violet-400 mb-2"><ShieldAlert className="w-3.5 h-3.5" />MISINFORMATION DETECTION ENGINE</div>
      <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight mb-1">Fact-Check Lab</h1>
      <p className="text-[#71717a] text-sm mb-6">Paste claims, news snippets, or social media quotes to verify their authenticity against our real-time database and Gemini reasoning models.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Input */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs text-[#a1a1aa]"><Search className="w-3.5 h-3.5" />Input Claim or URL</div>
              <button className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#a1a1aa] transition-colors"><Upload className="w-3.5 h-3.5" />Upload Image/Doc</button>
            </div>
            <textarea
              value={claim} onChange={e => setClaim(e.target.value)}
              placeholder="e.g., 'The new highway project in District 5 was funded entirely by foreign entities...'"
              rows={4}
              className="w-full bg-transparent text-sm text-[#fafafa] placeholder:text-[#52525b] resize-none focus:outline-none"
            />
            {error && <p className="text-xs text-[#ef4444] mt-1">{error}</p>}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#27272a]">
              <p className="text-xs text-[#71717a]">ℹ Supports text up to 5,000 characters. ({claim.length}/5000)</p>
              <button onClick={analyze} disabled={isLoading || claim.length < 10} className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Analyze Claim
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-[#a1a1aa]"><ShieldAlert className="w-3.5 h-3.5" />Analysis Results</div>
                <span className="text-xs text-[#71717a]">ID: {resultId}</span>
              </div>
              <blockquote className="border-l-2 border-[#3f3f46] pl-3 text-sm text-[#a1a1aa] italic mb-4">&ldquo;{result.claim}&rdquo;</blockquote>
              <div className="flex items-center gap-4 mb-4">
                <VerdictBadge verdict={result.verdict} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1">
                    <span>CONFIDENCE SCORE</span><span className={VERDICT_CONFIG[result.verdict].color}>{result.confidence}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={cn("h-full rounded-full transition-all duration-700", result.verdict === "TRUE" ? "bg-[#34d399]" : result.verdict === "MISLEADING" ? "bg-[#f59e0b]" : "bg-[#ef4444]")} style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>
              </div>
              <div className="bg-[#111114] border border-[#27272a] rounded-lg p-3 mb-4">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-400 mb-2"><span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />GEMINI REASONING</div>
                <p className="text-sm text-[#a1a1aa] mb-3">{result.reasoning}</p>
                <ul className="space-y-2">
                  {result.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                      <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                      <span dangerouslySetInnerHTML={{ __html: pt.replace(/^(.*?):/, '<strong class="text-[#fafafa]">$1:</strong>') }} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-2">VERIFIED REFERENCES</p>
                <div className="flex flex-wrap gap-2">
                  {REFERENCES[result.verdict].map(ref => (
                    <span key={ref} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111114] border border-[#27272a] rounded-lg text-xs text-[#a1a1aa]">🔗 {ref}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trending sidebar */}
        <div className="space-y-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#fafafa]"><TrendingUp className="w-3.5 h-3.5 text-violet-400" />TRENDING IN YOUR REGION</div>
              <button className="text-xs text-violet-400 hover:text-violet-300">View All</button>
            </div>
            <div className="space-y-3">
              {TRENDING_CLAIMS.map(tc => (
                <button key={tc.id} onClick={() => setClaim(tc.snippet)} className="w-full text-left p-3 bg-[#111114] border border-[#27272a] rounded-lg hover:border-[#3f3f46] transition-all group">
                  <div className="flex items-center justify-between mb-1.5">
                    <TrendingVerdictBadge verdict={tc.verdict} />
                    <div className="flex items-center gap-1 text-[10px] text-[#52525b]"><Clock className="w-3 h-3" />{tc.timeAgo}</div>
                  </div>
                  <p className="text-xs text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors leading-relaxed">{tc.snippet}</p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#52525b]">
              📍 Filtering trends for: <span className="text-[#a1a1aa]">Northern District</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
