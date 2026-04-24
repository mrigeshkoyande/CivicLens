/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/toast";

const CANDIDATES = [
  {
    id: 1, name: "Arjun Desai", role: "City Council, District 4 · Independent",
    badge: "Incumbent", badgeBg: "bg-primary-container text-on-primary-container",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&q=80",
    headerBg: "from-[#daf19e]/40", tags: ["Urban Planning", "Fiscal Conservative"],
    manifesto: "Arjun believes the city needs to grow carefully. He wants to renovate old buildings instead of demolishing them and is very cautious with the city budget, preferring to keep taxes stable by making programs run more efficiently.",
    metrics: [
      { label: "Attendance Record",             value: 94, color: "bg-primary" },
      { label: "Bills Passed (Primary Sponsor)", value: 60, color: "bg-primary" },
      { label: "Community Approval Rating",      value: 68, color: "bg-[#fc9842]" },
    ],
    stances: [
      { pro: true,  title: "Pro-Zoning Reform", detail: "Voted YES on mixed-use development bill." },
      { pro: false, title: "Anti-Tax Increase",  detail: "Voted NO on the proposed transit tax hike." },
    ],
    cta: "View Full Voting Record",
    ctaLink: "#voting-record",
  },
  {
    id: 2, name: "Meera Reddy", role: "Community Organizer · Progressive",
    badge: "Challenger", badgeBg: "bg-secondary-container text-on-secondary-container",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80",
    headerBg: "from-[#fc9842]/20", tags: ["Climate Action", "Affordable Housing"],
    manifesto: "Meera wants to use city funds to build more affordable housing and public parks. She supports a small tax increase on large businesses to fund better public transport for everyone.",
    metrics: null,
    communityStats: [
      { val: "5k+", label: "Signatures for Housing Initiative" },
      { val: "12",  label: "Years directing Local Food Bank" },
    ],
    stances: [
      { pro: true, title: "Pro-Public Transit Expansion", detail: "Pledged to secure funding for 3 new bus lines." },
      { pro: true, title: "Pro-Rent Control",             detail: "Advocates for a 3% cap on annual rent increases." },
    ],
    cta: "View Campaign Platform",
    ctaLink: "#campaign-platform",
  },
];

export default function CandidatesPage() {
  const { show } = useToast();
  const [eli15, setEli15] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      const name = CANDIDATES.find((c) => c.id === id)?.name;
      show(next.includes(id) ? `${name} bookmarked!` : `Bookmark removed`, next.includes(id) ? "success" : "info", next.includes(id) ? "bookmark" : "bookmark_remove");
      return next;
    });
  };

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-1">Candidate Comparison</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Unbiased side-by-side analysis. Evaluate records, understand stances, and make an informed decision.
            </p>
          </div>
          {/* AI mode toggle */}
          <div className="flex items-center gap-3 bg-[#e8e8e8] p-2 rounded-full border border-[#c6c8b7] self-start">
            <span className="pl-3 text-xs font-semibold text-on-surface-variant">AI Mode:</span>
            <div className="flex bg-[#eeeeee] rounded-full p-1">
              <button
                onClick={() => { setEli15(false); show("Standard mode — full policy language enabled.", "info", "article"); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!eli15 ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
              >
                Standard
              </button>
              <button
                onClick={() => { setEli15(true); show("ELI15 mode — simplified explanations enabled!", "success", "child_care"); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${eli15 ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
              >
                <span className="material-symbols-outlined text-[14px]">child_care</span> Explain like I&apos;m 15
              </button>
            </div>
          </div>
        </header>

        {/* VS grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
          {/* VS badge */}
          <div className="hidden xl:flex absolute left-1/2 top-14 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#e8e8e8] border-4 border-[#f9f9f9] items-center justify-center z-10 shadow-sm">
            <span className="text-base font-black text-on-surface-variant">VS</span>
          </div>

          {CANDIDATES.map((c) => (
            <article key={c.id} className="bg-white rounded-3xl border border-[#e2e2e2] shadow-sm overflow-hidden flex flex-col hover:shadow-[0_8px_32px_rgba(89,79,52,0.08)] transition-shadow">
              {/* Profile Header */}
              <div className="p-8 pb-0 flex flex-col items-center text-center relative z-0">
                <div className={`absolute inset-0 h-36 bg-gradient-to-b ${c.headerBg} to-transparent -z-10`} />
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleBookmark(c.id)}
                    className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-[#c6c8b7] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    title={bookmarked.includes(c.id) ? "Remove bookmark" : "Bookmark candidate"}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${bookmarked.includes(c.id) ? "text-primary icon-fill" : "text-on-surface-variant"}`}>
                      bookmark
                    </span>
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`CivicLens — ${c.name}: ${c.role}`); show(`${c.name}'s profile copied!`, "success", "share"); }}
                    className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-[#c6c8b7] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    title="Share"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">share</span>
                  </button>
                </div>

                <div className="w-28 h-28 rounded-full bg-[#e2e2e2] border-4 border-white shadow-sm overflow-hidden mb-4 relative">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                  <div className={`absolute bottom-0 inset-x-0 ${c.badgeBg} text-[9px] font-black py-1 uppercase tracking-wider text-center`}>
                    {c.badge}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-on-surface mb-1">{c.name}</h2>
                <p className="text-sm text-on-surface-variant mb-4">{c.role}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {c.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-[#f1e1be]/60 text-[#594f34] rounded-full text-xs font-semibold border border-[#d4c5a3]/40">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-2 flex-1 flex flex-col gap-6">
                {/* Manifesto */}
                <section className="bg-[#f9f9f9] p-5 rounded-2xl border border-[#e2e2e2]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#fc9842]">psychology</span>
                      <h3 className="text-sm font-semibold text-on-surface">AI Simplified Manifesto</h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant bg-[#e8e8e8] px-2 py-0.5 rounded">
                      Gemini
                    </span>
                  </div>
                  {eli15 ? (
                    <p className="text-sm text-on-surface-variant leading-relaxed">{c.manifesto}</p>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic opacity-70">
                      Enable &quot;Explain like I&apos;m 15&quot; to see AI-simplified view.
                    </p>
                  )}
                </section>

                {/* Metrics or Stats */}
                <section>
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4 pb-2 border-b border-[#e2e2e2]">
                    {c.metrics ? "Performance Metrics" : "Community Impact"}
                  </h3>
                  {c.metrics ? (
                    <div className="space-y-4">
                      {c.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-1.5 font-medium">
                            <span className="text-on-surface">{m.label}</span>
                            <span className="text-primary font-bold">{m.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#e2e2e2] rounded-full overflow-hidden">
                            <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: `${m.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {c.communityStats!.map((s) => (
                        <div key={s.val} className="bg-[#e8e8e8] p-4 rounded-xl border border-[#e2e2e2] text-center">
                          <span className="block text-2xl font-black text-[#fc9842] mb-1">{s.val}</span>
                          <span className="text-xs text-on-surface-variant leading-tight">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Stances */}
                <section className="mt-auto">
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 pb-2 border-b border-[#e2e2e2]">Top Stances</h3>
                  <ul className="space-y-3">
                    {c.stances.map((s) => (
                      <li key={s.title} className="flex items-start gap-3">
                        <span className={`material-symbols-outlined mt-0.5 shrink-0 ${s.pro ? "text-primary icon-fill" : "text-error"}`}>
                          {s.pro ? "check_circle" : "cancel"}
                        </span>
                        <div>
                          <span className="block text-sm font-semibold text-on-surface">{s.title}</span>
                          <span className="block text-xs text-on-surface-variant mt-0.5">{s.detail}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Expandable full record */}
                {expanded === c.id && (
                  <div className="bg-[#f9f9f9] rounded-xl p-4 border border-[#e2e2e2] text-sm text-on-surface-variant animate-fade-in">
                    <p className="font-semibold text-on-surface mb-2">Full Record Summary</p>
                    <p>This candidate has served {c.id === 1 ? "6" : "0"} years in public office. Their voting record shows consistent alignment with stated platform priorities. Full legislative history available via official government records portal.</p>
                    <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold text-xs mt-2 inline-flex items-center gap-1 hover:underline">
                      View on ECI Portal <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="p-5 bg-[#f4f3f3] border-t border-[#e2e2e2]">
                <button
                  onClick={() => { setExpanded(expanded === c.id ? null : c.id); show(expanded === c.id ? "Record collapsed." : `Loading ${c.name}'s record…`, "info", "article"); }}
                  className="w-full py-2.5 bg-white text-primary border border-primary/30 rounded-xl text-xs font-bold hover:bg-primary hover:text-on-primary active:scale-[0.98] transition-all"
                >
                  {expanded === c.id ? "Collapse Record ▲" : c.cta + " ▼"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <div className="max-w-7xl mx-auto w-full px-10 mt-8"><Footer /></div>
    </div>
  );
}
