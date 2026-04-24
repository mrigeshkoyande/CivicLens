/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/toast";

const INIT_ACTIONS = [
  { id: "register",  label: "Verify Registration",    sub: "Ensure your address is up to date.",      done: false, urgent: true },
  { id: "booth",     label: "Find Polling Booth",      sub: "Your designated location may have changed.", done: false, urgent: false },
  { id: "ballot",   label: "Review Ballot Measures",  sub: "Completed on Oct 12",                     done: true,  urgent: false },
];

const CANDIDATES = [
  { name: "Sarah Jenkins", role: "Incumbent · District 4", match: 88, matchHigh: true,  tags: ["Environment", "Education"],
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
    banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { name: "Marcus Rivera",  role: "Challenger · District 4", match: 72, matchHigh: false, tags: ["Housing", "Transit"],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80",
    banner: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80" },
];

export default function DashboardPage() {
  const { show } = useToast();
  const [actions, setActions] = useState(INIT_ACTIONS);

  const pendingCount = actions.filter((a) => !a.done).length;

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
    const item = actions.find((a) => a.id === id);
    if (item && !item.done) show(`✓ "${item.label}" marked complete!`, "success");
  };

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20241105T070000Z",
      "DTEND:20241105T180000Z",
      "SUMMARY:General Election Day",
      "DESCRIPTION:Remember to vote! Check CivicLens for your booth location.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "election-day.ics"; a.click();
    URL.revokeObjectURL(url);
    show("Calendar event downloaded!", "success", "event");
  };

  const downloadGuide = () => {
    show("Generating your Ballot Guide…", "info", "description");
    setTimeout(() => show("Ballot Guide ready! Opening…", "success", "download"), 1800);
  };

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-[2.5rem] leading-tight font-black text-on-surface mb-1 tracking-tight">Mission Control</h2>
            <p className="text-body-lg text-on-surface-variant">Your personalized election readiness overview.</p>
          </div>
          <button
            onClick={downloadGuide}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:bg-surface-tint active:scale-95 transition-all shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Download Ballot Guide
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Countdown + Civic Score */}
          <div className="md:col-span-8 flex flex-col sm:flex-row gap-6">
            {/* Countdown */}
            <div className="flex-1 bg-white rounded-2xl p-6 border border-[#d4c5a3] shadow-[0_4px_24px_rgba(89,79,52,0.06)] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-on-surface">General Election</h3>
                <span className="material-symbols-outlined text-[#fc9842] text-3xl">event</span>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-[64px] leading-none text-primary font-black">42</span>
                <span className="text-xl text-on-surface-variant mb-2 font-medium">Days left</span>
              </div>
              <div className="pt-4 border-t border-[#e2e2e2] flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">November 5th, 2024</span>
                <button
                  onClick={addToCalendar}
                  className="text-primary text-xs font-bold flex items-center gap-1 hover:text-primary-container hover:bg-primary-fixed px-3 py-1.5 rounded-full transition-all active:scale-95"
                >
                  Add to Calendar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Civic Score */}
            <div
              className="flex-1 rounded-2xl p-6 shadow-[0_4px_24px_rgba(68,86,20,0.2)] flex flex-col justify-between relative overflow-hidden cursor-pointer group"
              style={{ background: "#445614" }}
              onClick={() => show("Civic Score: 850/1000 — Top 15% in your district!", "success", "workspace_premium")}
            >
              <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: 150 }}>workspace_premium</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-1">Civic Score</h3>
                <p className="text-[#b9cf80] text-sm mb-4">Top 15% in your district</p>
              </div>
              <div className="relative z-10 flex items-end gap-2">
                <span className="text-[56px] leading-none font-black text-white">850</span>
                <span className="text-lg text-[#d5ec99] mb-2">/ 1000</span>
              </div>
              <div className="relative z-10 mt-4">
                <div className="h-2 w-full bg-[#536522] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fc9842] rounded-full transition-all" style={{ width: "85%" }} />
                </div>
                <div className="flex justify-between mt-2 text-xs font-semibold text-[#b9cf80]">
                  <span>Engaged Citizen</span>
                  <span>+50 to next rank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_24px_rgba(89,79,52,0.05)] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#e2e2e2] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-on-surface">Action Items</h3>
              <span className="bg-error-container text-on-error-container text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingCount} Pending
              </span>
            </div>
            <div className="flex-1">
              {actions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleAction(item.id)}
                  className="w-full text-left p-4 border-b border-[#f4f3f3] flex gap-4 hover:bg-[#f9f9f9] transition-colors group last:border-0"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.done ? (
                      <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary text-[16px]">check</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded border-2 border-outline flex items-center justify-center group-hover:border-primary transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold mb-0.5 transition-colors ${item.done ? "text-on-surface-variant line-through" : "text-on-surface group-hover:text-primary"}`}>
                      {item.label}
                    </h4>
                    <p className="text-xs text-on-surface-variant">{item.sub}</p>
                    {item.urgent && !item.done && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-error mt-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span> High Priority
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Constituency Candidates */}
          <div className="md:col-span-12">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h3 className="text-2xl font-bold text-on-surface mb-1">Your Constituency</h3>
                <p className="text-sm text-on-surface-variant">Candidate match based on your civic profile.</p>
              </div>
              <Link
                href="/candidates"
                className="text-primary text-xs font-bold flex items-center gap-1 hover:bg-[#f4f3f3] px-4 py-2 rounded-lg transition-colors active:scale-95"
              >
                View Full Analysis <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CANDIDATES.map((c) => (
                <Link
                  key={c.name}
                  href="/candidates"
                  className="bg-white rounded-2xl border border-[#d4c5a3] overflow-hidden hover:shadow-[0_8px_24px_rgba(89,79,52,0.1)] hover:-translate-y-0.5 transition-all group"
                >
                  <div className="h-24 relative overflow-hidden">
                    <img src={c.banner} alt="" className="w-full h-full object-cover opacity-70 mix-blend-multiply" />
                    <div className="absolute -bottom-10 left-5">
                      <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-[#e2e2e2]">
                        <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                    </div>
                    <div className={`absolute top-3 right-3 text-lg font-bold px-3 py-1 rounded-lg shadow-md ${c.matchHigh ? "bg-primary text-on-primary" : "bg-white text-on-surface border border-[#c6c8b7]"}`}>
                      {c.match}%
                    </div>
                  </div>
                  <div className="pt-12 p-5">
                    <h4 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">{c.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{c.role}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span key={tag} className="bg-[#e8e8e8] text-on-surface-variant text-xs font-semibold px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Refine CTA */}
              <div className="bg-[#daf19e] rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-on-primary text-3xl">tune</span>
                </div>
                <h4 className="text-base font-bold text-on-surface mb-2">Refine Your Match</h4>
                <p className="text-xs text-on-surface-variant mb-5 max-w-[180px]">Answer 3 more questions to improve candidate accuracy.</p>
                <Link
                  href="/onboarding"
                  className="bg-primary text-on-primary text-xs font-bold px-6 py-3 rounded-full hover:bg-surface-tint active:scale-95 transition-all"
                >
                  Take Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto w-full px-8 mt-8">
        <Footer />
      </div>
    </div>
  );
}
