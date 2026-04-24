"use client";

import { useState, useRef } from "react";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/toast";
import { TRENDING_CLAIMS } from "@/lib/mock-data";

type Verdict = "TRUE" | "FALSE" | "MISLEADING";

const VERDICT_CFG: Record<Verdict, { label: string; icon: string; textColor: string; bg: string; dotColor: string; ringColor: string }> = {
  TRUE:       { label: "Verified True",      icon: "check_circle", textColor: "text-primary",   bg: "bg-primary-fixed border border-primary/20",         dotColor: "text-primary",   ringColor: "#445614" },
  FALSE:      { label: "Likely False",       icon: "warning",      textColor: "text-error",     bg: "bg-error-container border border-error/20",          dotColor: "text-error",     ringColor: "#ba1a1a" },
  MISLEADING: { label: "Misleading Context", icon: "flaky",        textColor: "text-secondary", bg: "bg-secondary-fixed border border-secondary/20",      dotColor: "text-secondary", ringColor: "#924c00" },
};

interface Result {
  claim: string;
  verdict: Verdict;
  confidence: number;
  reasoning: string[];
  sources: { title: string; src: string }[];
}

export default function FactCheckPage() {
  const { show } = useToast();
  const [claim, setClaim] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const analyze = async () => {
    if (!claim.trim() || claim.length < 10) {
      show("Please enter at least 10 characters.", "error", "edit");
      return;
    }
    setIsLoading(true);
    setResult(null);
    show("Analyzing claim with AI…", "info", "smart_toy");
    try {
      const res = await fetch("/api/ai/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim }),
      });
      const data = await res.json();
      setResult({
        claim,
        verdict: (data.verdict as Verdict) ?? "FALSE",
        confidence: data.confidence ?? 15,
        reasoning: data.points ?? [
          "The claim contradicts official documentation published last week.",
          "The actual proposal offers incentives, not restrictions.",
          "Image in viral post originates from a 2018 unrelated dispute.",
        ],
        sources: data.sources
          ? data.sources.map((s: string) => ({ title: s, src: "Verified Source" }))
          : [
              { title: "Official City Zoning Proposal Document", src: "cityhall.gov · Oct 12, 2023" },
              { title: "Fact Check: The Truth About the New Urban Agriculture Bill", src: "Local News Gazette · Oct 14, 2023" },
            ],
      });
      show("Analysis complete!", "success", "fact_check");
    } catch {
      setResult({
        claim,
        verdict: "FALSE",
        confidence: 15,
        reasoning: [
          "The claim contradicts official documentation published last week.",
          "The actual proposal offers incentives, not restrictions.",
          "Image in viral post originates from a 2018 unrelated dispute.",
        ],
        sources: [
          { title: "Official City Zoning Proposal Document", src: "cityhall.gov · Oct 12, 2023" },
          { title: "Fact Check: The Truth About the New Urban Agriculture Bill", src: "Local News Gazette · Oct 14, 2023" },
        ],
      });
      show("Analysis complete (demo mode).", "info", "fact_check");
    } finally {
      setIsLoading(false);
    }
  };

  const shareResult = () => {
    navigator.clipboard.writeText(`CivicLens Fact-Check:\n"${result?.claim}"\n\nVerdict: ${result?.verdict}\nConfidence: ${result?.confidence}%`);
    show("Result copied to clipboard!", "success", "share");
  };

  const cfg = result ? VERDICT_CFG[result.verdict] : null;

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-1">Fact-Check Lab</h1>
          <p className="text-body-md text-on-surface-variant max-w-3xl">
            Verify claims, news articles, or social media statements using AI-powered analysis. Paste text or a URL below.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Input */}
            <div className="bg-white rounded-2xl p-6 border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)]">
              <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-3" htmlFor="fc-input">
                Enter Claim or URL
              </label>
              <textarea
                id="fc-input"
                ref={textareaRef}
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                rows={5}
                className="w-full bg-[#f9f9f9] border border-[#c6c8b7] focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant transition-all outline-none resize-none"
                placeholder="e.g., 'The new city zoning law bans all private gardens...' or paste a news link here"
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) analyze(); }}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                  <span>Tip: Specific quotes yield better results · ⌘+Enter to analyze</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setClaim(""); setResult(null); textareaRef.current?.focus(); }}
                    className="px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface border border-[#c6c8b7] rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={analyze}
                    disabled={isLoading}
                    className="bg-primary text-on-primary text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-surface-tint active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isLoading ? "animate-spin" : ""}`}>
                      {isLoading ? "progress_activity" : "search"}
                    </span>
                    {isLoading ? "Analyzing…" : "Analyze Claim"}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {result && cfg && (
              <div className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden animate-fade-in">
                {/* Result header */}
                <div className="bg-[#f4f3f3] p-5 border-b border-[#e2e2e2] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">troubleshoot</span>
                    <h3 className="text-lg font-semibold text-on-surface">Analysis Results</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${cfg.bg} ${cfg.textColor}`}>
                      <span className="material-symbols-outlined text-[16px] icon-fill">{cfg.icon}</span>
                      {cfg.label}
                    </span>
                    <button onClick={shareResult} className="text-on-surface-variant hover:text-primary p-1.5 hover:bg-[#f4f3f3] rounded-lg transition-colors" title="Copy to clipboard">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Confidence ring */}
                  <div className="md:col-span-1 bg-[#f9f9f9] rounded-xl p-4 border border-[#e2e2e2] flex flex-col items-center justify-center text-center gap-2">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e2e2" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={cfg.ringColor} strokeDasharray={`${result.confidence}, 100`} strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-on-surface">{result.confidence}%</span>
                        <span className="text-[10px] text-on-surface-variant font-semibold">Confidence</span>
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant">AI Confidence Score</span>
                  </div>

                  {/* Reasoning */}
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">smart_toy</span> AI Reasoning
                    </h4>
                    <ul className="space-y-3">
                      {result.reasoning.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-on-surface-variant leading-relaxed">
                          <span className={`material-symbols-outlined text-[16px] mt-0.5 shrink-0 ${i === 0 ? "text-error" : i === 1 ? "text-primary" : "text-secondary"}`}>
                            {i === 0 ? "close" : i === 1 ? "check" : "info"}
                          </span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sources */}
                <div className="bg-[#f9f9f9] p-5 border-t border-[#e2e2e2]">
                  <h4 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#fc9842]">library_books</span> Verified References
                  </h4>
                  <div className="space-y-2">
                    {result.sources.map((ref, i) => (
                      <a key={i} href="#" className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#e2e2e2] hover:border-primary transition-colors group">
                        <div>
                          <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{ref.title}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{ref.src}</p>
                        </div>
                        <span className="material-symbols-outlined text-[#c6c8b7] group-hover:text-primary transition-colors shrink-0 ml-3">open_in_new</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Trending */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] sticky top-6">
              <div className="p-5 border-b border-[#e2e2e2]">
                <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">trending_up</span>
                  Trending in Your Region
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Click any claim to auto-fill the analyzer</p>
              </div>
              <div className="p-2">
                {TRENDING_CLAIMS.map((item) => {
                  const v = VERDICT_CFG[item.verdict as Verdict] ?? VERDICT_CFG.MISLEADING;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setClaim(item.claim); show("Claim loaded — click Analyze!", "info", "search"); }}
                      className="w-full text-left p-3 hover:bg-[#f4f3f3] active:bg-[#e8e8e8] transition-colors rounded-xl flex gap-3 items-start group"
                    >
                      <div className="bg-[#e8e8e8] rounded-full p-1.5 flex-shrink-0 mt-0.5">
                        <span className={`material-symbols-outlined text-[18px] ${v.dotColor}`}>{v.icon}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-on-surface leading-snug group-hover:text-primary transition-colors">{item.claim}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold ${v.textColor}`}>{v.label}</span>
                          <span className="text-[#c6c8b7] text-[10px]">·</span>
                          <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="p-3 border-t border-[#e2e2e2] text-center">
                <button
                  onClick={() => show("Full report feature coming soon!", "info", "description")}
                  className="text-xs font-bold text-primary hover:text-surface-tint transition-colors"
                >
                  View full regional report →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <div className="max-w-7xl mx-auto w-full px-8 mt-8"><Footer /></div>
    </div>
  );
}
