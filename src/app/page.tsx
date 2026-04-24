"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Calendar,
  Trophy,
  CheckCircle2,
  Circle,
  ChevronRight,
  Download,
  TrendingUp,
  Info,
  Zap,
} from "lucide-react";
import { DASHBOARD_CANDIDATES } from "@/lib/mock-data";
import { getDaysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Countdown Card ───────────────────────────────────────────────────────────
function ElectionCountdown() {
  const votingDate = "2024-05-07";
  const days = getDaysUntil(votingDate);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#a1a1aa] text-xs">
          <Calendar className="w-3.5 h-3.5" />
          Upcoming Election
        </div>
        <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
          Lok Sabha
        </span>
      </div>
      <div className="text-center py-3">
        <p className="text-6xl font-bold text-[#fafafa] tracking-tight animate-count-up">
          {days}
        </p>
        <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mt-1">
          Days Remaining
        </p>
      </div>
      <div className="flex justify-between text-xs text-[#71717a] border-t border-[#27272a] pt-3">
        <span>Phase 3 Voting</span>
        <span>May 7, 2024</span>
      </div>
    </div>
  );
}

// ─── Civic Score Card ─────────────────────────────────────────────────────────
function CivicScoreCard({ score = 850 }: { score?: number }) {
  const [animated, setAnimated] = useState(false);
  const percentage = (score / 1000) * 100;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#18181b] border border-violet-500/25 rounded-xl p-5 flex flex-col gap-3 score-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#a1a1aa] text-xs">
          <Trophy className="w-3.5 h-3.5" />
          Civic Score
        </div>
        <button className="text-[#71717a] hover:text-[#a1a1aa]">
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>
      <div>
        <div className="flex items-end gap-1">
          <p className="text-5xl font-bold text-[#fafafa] tracking-tight">
            {score.toLocaleString()}
          </p>
          <p className="text-[#71717a] text-sm pb-1">/ 1000</p>
        </div>
        <div className="mt-3 progress-bar">
          <div
            className="progress-fill"
            style={{ width: animated ? `${percentage}%` : "0%" }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#34d399]">
        <TrendingUp className="w-3.5 h-3.5" />
        Excellent Standing. Top 15% locally.
      </div>
    </div>
  );
}

// ─── Action Items Card ────────────────────────────────────────────────────────
const ACTION_ITEMS = [
  {
    id: "register",
    label: "Register to vote",
    detail: "Verified on Jan 12",
    done: true,
    href: "/onboarding",
  },
  {
    id: "booth",
    label: "Find booth location",
    detail: "DPS School, Sector 4",
    done: true,
    href: "/booths",
  },
  {
    id: "compare",
    label: "Compare candidates",
    detail: "Review 3 candidates in your area",
    done: false,
    href: "/candidates",
  },
];

function ActionItemsCard() {
  const completed = ACTION_ITEMS.filter((i) => i.done).length;
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#a1a1aa] text-xs">
          <Zap className="w-3.5 h-3.5" />
          Action Items
        </div>
        <span className="text-xs text-[#a1a1aa]">
          {completed}/{ACTION_ITEMS.length} Complete
        </span>
      </div>
      <div className="space-y-3">
        {ACTION_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-start gap-3 group"
          >
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-[#34d399] mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-[#52525b] mt-0.5 shrink-0 group-hover:text-violet-400 transition-colors" />
            )}
            <div>
              <p
                className={cn(
                  "text-sm",
                  item.done
                    ? "line-through text-[#71717a]"
                    : "text-[#fafafa] group-hover:text-violet-400 transition-colors"
                )}
              >
                {item.label}
              </p>
              <p className="text-xs text-[#52525b] mt-0.5">{item.detail}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Constituency Card ────────────────────────────────────────────────────────
function ConstituencySection() {
  return (
    <section className="bg-[#18181b] border border-[#27272a] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#fafafa]">
            Your Constituency: South Delhi
          </h2>
          <p className="text-xs text-[#71717a] mt-0.5">
            AI-matched profiles based on your civic priorities.
          </p>
        </div>
        <Link
          href="/candidates"
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
        >
          View Full Analysis
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DASHBOARD_CANDIDATES.map((candidate) => (
          <Link
            key={candidate.id}
            href="/candidates"
            className="bg-[#111114] border border-[#27272a] rounded-xl p-4 hover:border-[#3f3f46] transition-all hover-lift group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-sm font-semibold text-[#a1a1aa]">
                  {candidate.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#fafafa] leading-none">
                    {candidate.name}
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-0.5">
                    {candidate.party}
                  </p>
                </div>
              </div>
              {candidate.matchScore && (
                <div className="text-right">
                  <p className="text-lg font-bold text-violet-400">
                    {candidate.matchScore}%
                  </p>
                  <p className="text-[9px] text-[#71717a] uppercase tracking-wide">
                    Match
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              {candidate.strengths?.map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#34d399] shrink-0" />
                  <span className="text-[11px] text-[#a1a1aa]">{s}</span>
                </div>
              ))}
              {candidate.differences?.map((d) => (
                <div key={d} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 shrink-0 text-[#f59e0b]">⚠</div>
                  <span className="text-[11px] text-[#a1a1aa]">{d}</span>
                </div>
              ))}
              {!candidate.strengths && !candidate.matchScore && (
                <p className="text-[11px] text-[#52525b]">
                  Insufficient voting record data
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight">
            Mission Control
          </h1>
          <p className="text-[#71717a] text-sm mt-1">
            Your personalized election readiness overview.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-all">
          <Download className="w-3.5 h-3.5" />
          Download Ballot Guide
        </button>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <ElectionCountdown />
        <CivicScoreCard score={850} />
        <ActionItemsCard />
      </div>

      {/* Constituency */}
      <ConstituencySection />

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#52525b]">
        <p>© 2024 CivicLens — Empowering Democracy</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-[#a1a1aa] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#a1a1aa] transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-[#a1a1aa] transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
