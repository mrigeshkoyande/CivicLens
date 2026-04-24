"use client";

import { useState } from "react";
import { Users, Sparkles, CheckCircle2, AlertOctagon, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { CANDIDATES } from "@/lib/mock-data";
import type { Candidate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function ProgressBar({ value, label, colorClass = "bg-violet-500" }: { value: number; label: string; colorClass?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1">
        <span>{label}</span>
        <span className={cn("font-semibold", value >= 80 ? "text-violet-400" : "text-[#a1a1aa]")}>{value}%</span>
      </div>
      <div className="h-1 bg-[#27272a] rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", colorClass)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CandidateCard({ candidate, simplify, onSummarize, summary, loading }: {
  candidate: Candidate; simplify: boolean; onSummarize: () => void; summary: string; loading: boolean;
}) {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4 hover:border-[#3f3f46] transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#27272a] flex items-center justify-center text-xl font-bold text-[#a1a1aa]">
          {candidate.name[0]}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#fafafa]">{candidate.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: candidate.partyColor }} />
            <p className="text-xs text-[#a1a1aa]">{candidate.party}</p>
          </div>
        </div>
      </div>

      {/* AI Manifesto */}
      <div className="bg-[#111114] border border-[#27272a] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-400"><Sparkles className="w-3 h-3" />AI SIMPLIFIED MANIFESTO</div>
          <span className="text-[10px] text-[#52525b] border border-[#27272a] px-1.5 py-0.5 rounded">GEMINI POWERED</span>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-[#71717a]"><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating summary…</div>
        ) : (
          <p className="text-sm text-[#a1a1aa] leading-relaxed">{summary || (simplify ? candidate.aiSummary : candidate.manifesto)}</p>
        )}
        {!loading && (
          <button onClick={onSummarize} className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            {simplify ? "Re-generate simple version" : "Generate AI Summary"}
          </button>
        )}
      </div>

      {/* Background */}
      <div>
        <p className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2">BACKGROUND & INTEGRITY</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#111114] border border-[#27272a] rounded-lg p-2.5">
            <p className="text-[10px] text-[#71717a] mb-1">EDUCATION</p>
            <p className="text-sm font-medium text-[#fafafa]">{candidate.education}</p>
            <p className="text-xs text-[#71717a]">{candidate.university}</p>
          </div>
          <div className="bg-[#111114] border border-[#27272a] rounded-lg p-2.5">
            <p className="text-[10px] text-[#71717a] mb-1">CRIMINAL RECORD</p>
            {candidate.criminalCases === 0 ? (
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" /><p className="text-sm text-[#34d399]">Clean (0 Cases)</p></div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5"><AlertOctagon className="w-3.5 h-3.5 text-[#ef4444]" /><p className="text-sm text-[#ef4444]">{candidate.criminalCases} Pending Case</p></div>
                {candidate.criminalDetails && <p className="text-[10px] text-[#71717a] mt-0.5">{candidate.criminalDetails}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance */}
      <div>
        <p className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider mb-2">PAST PERFORMANCE ({candidate.termLabel.toUpperCase()})</p>
        <div className="space-y-2">
          <ProgressBar value={candidate.attendance} label={`${candidate.termLabel} Attendance`} colorClass="bg-gradient-to-r from-violet-500 to-violet-400" />
          <ProgressBar value={candidate.fundUtilization} label="Fund Utilization" colorClass={candidate.fundUtilization >= 80 ? "bg-gradient-to-r from-violet-500 to-violet-400" : "bg-[#f59e0b]"} />
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const [simplify, setSimplify] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleSummarize = async (candidate: Candidate) => {
    setLoading(p => ({ ...p, [candidate.id]: true }));
    try {
      const res = await fetch("/api/ai/summarize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ manifesto: candidate.manifesto, candidateName: candidate.name, simplify }) });
      const data = await res.json();
      setSummaries(p => ({ ...p, [candidate.id]: data.summary ?? candidate.aiSummary }));
    } catch {
      setSummaries(p => ({ ...p, [candidate.id]: candidate.aiSummary }));
    } finally {
      setLoading(p => ({ ...p, [candidate.id]: false }));
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight">Candidate Comparison</h1>
          <p className="text-[#71717a] text-sm mt-1">Unbiased, side-by-side analysis of candidate profiles, track records, and AI-simplified manifestos.</p>
        </div>
        <button onClick={() => setSimplify(!simplify)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all", simplify ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-[#18181b] border-[#27272a] text-[#a1a1aa]")}>
          {simplify ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          &ldquo;Explain like I&apos;m 15&rdquo; Mode
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#71717a] mb-4"><Users className="w-3.5 h-3.5" />{CANDIDATES.length} candidates in your constituency</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CANDIDATES.map(c => (
          <CandidateCard key={c.id} candidate={c} simplify={simplify}
            onSummarize={() => handleSummarize(c)}
            summary={summaries[c.id] ?? ""}
            loading={loading[c.id] ?? false} />
        ))}
      </div>
    </div>
  );
}
