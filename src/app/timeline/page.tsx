"use client";

import { useState, useEffect } from "react";
import { ELECTION_EVENTS } from "@/lib/mock-data";
import type { ElectionEvent } from "@/lib/mock-data";
import { getDaysUntil, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Footer } from "@/components/layout/footer";

const EVENT_CONFIG: Record<ElectionEvent["type"], { icon: string; color: string; bg: string; border: string }> = {
  registration: { icon: "how_to_reg",      color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200" },
  voting:       { icon: "how_to_vote",     color: "text-primary",    bg: "bg-primary-fixed", border: "border-primary/20" },
  result:       { icon: "emoji_events",    color: "text-[#924c00]",  bg: "bg-secondary-fixed", border: "border-secondary/20" },
  nomination:   { icon: "assignment_ind", color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200" },
  campaign:     { icon: "campaign",        color: "text-[#594f34]",  bg: "bg-[#f1e1be]",  border: "border-[#d4c5a3]" },
};

function CountdownWidget() {
  const nextEvent = ELECTION_EVENTS.find((e) => new Date(e.date) >= new Date());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);

  useEffect(() => {
    if (!nextEvent) return;
    const update = () => {
      const diff = new Date(nextEvent.date).getTime() - Date.now();
      setDays(Math.max(0, Math.floor(diff / 86400000)));
      setHours(Math.max(0, Math.floor((diff % 86400000) / 3600000)));
      setMins(Math.max(0, Math.floor((diff % 3600000) / 60000)));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [nextEvent]);

  if (!nextEvent) return null;
  return (
    <div className="bg-primary text-on-primary rounded-2xl p-6 mb-6 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: 120 }}>event</span>
      </div>
      <p className="text-xs font-bold text-primary-fixed uppercase tracking-widest mb-1">Next Milestone</p>
      <h2 className="text-lg font-bold mb-4">{nextEvent.title}</h2>
      <div className="flex gap-3">
        {[{ v: days, l: "Days" }, { v: hours, l: "Hours" }, { v: mins, l: "Mins" }].map(({ v, l }) => (
          <div key={l} className="flex-1 text-center bg-surface-tint rounded-xl py-3">
            <p className="text-2xl font-black">{String(v).padStart(2, "0")}</p>
            <p className="text-[10px] text-primary-fixed uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ event, isLast, onNotify }: { event: ElectionEvent; isLast: boolean; onNotify: (title: string) => void }) {
  const cfg = EVENT_CONFIG[event.type];
  const isPast = new Date(event.date) < new Date();
  const daysLeft = getDaysUntil(event.date);
  const isToday = daysLeft === 0 && !isPast;
  const [reminded, setReminded] = useState(false);

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 ${isPast ? "bg-[#e2e2e2] border-[#c6c8b7]" : `${cfg.bg} ${cfg.border}`}`}>
          <span className={`material-symbols-outlined text-[18px] ${isPast ? "text-[#76786a]" : cfg.color}`}>{cfg.icon}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-[#e2e2e2] mt-1" style={{ minHeight: "2rem" }} />}
      </div>

      {/* Card */}
      <div className={`flex-1 pb-6 ${isLast ? "" : ""}`}>
        <div className={`rounded-2xl border p-4 transition-all ${isPast ? "bg-[#f4f3f3] border-[#e2e2e2] opacity-60" : `bg-white border-[#e2e2e2] hover:border-[#c6c8b7] hover:shadow-sm`}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {event.phase && (
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{event.phase} · </span>
              )}
              <h3 className={`text-sm font-semibold inline ${isPast ? "text-on-surface-variant line-through" : "text-on-surface"}`}>
                {event.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{event.description}</p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-2">
              <p className="text-xs text-on-surface-variant">{formatDate(event.date)}</p>
              {isPast ? (
                <span className="text-[10px] text-on-surface-variant bg-[#e2e2e2] px-2 py-0.5 rounded-full">Done</span>
              ) : isToday ? (
                <span className="text-[10px] text-primary font-bold animate-pulse bg-primary-fixed px-2 py-0.5 rounded-full">TODAY</span>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${daysLeft <= 7 ? "text-[#924c00] bg-secondary-fixed" : `${cfg.color} ${cfg.bg}`}`}>
                  {daysLeft}d away
                </span>
              )}
              {!isPast && (
                <button
                  onClick={() => { setReminded(true); onNotify(event.title); }}
                  disabled={reminded}
                  className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-full transition-all ${reminded ? "text-primary bg-primary-fixed" : "text-on-surface-variant hover:text-primary hover:bg-[#f4f3f3]"}`}
                >
                  <span className="material-symbols-outlined text-[12px]">{reminded ? "notifications_active" : "add_alert"}</span>
                  {reminded ? "Reminder set" : "Remind me"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const { show } = useToast();
  const [filter, setFilter] = useState<"All" | ElectionEvent["type"]>("All");
  const [notifications, setNotifications] = useState(false);

  const filtered = filter === "All" ? ELECTION_EVENTS : ELECTION_EVENTS.filter((e) => e.type === filter);

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    show(next ? "Election reminders enabled!" : "Reminders disabled.", next ? "success" : "info", next ? "notifications_active" : "notifications_off");
  };

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest mb-1">
              <span className="material-symbols-outlined text-[14px]">calendar_month</span> Election Timeline
            </div>
            <h1 className="text-3xl font-bold text-on-surface">2024 Lok Sabha Schedule</h1>
            <p className="text-on-surface-variant text-sm mt-1">All critical election dates and countdowns in one place.</p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all active:scale-95 ${notifications ? "bg-primary text-on-primary border-primary" : "bg-white text-on-surface border-[#c6c8b7] hover:border-primary"}`}
          >
            <span className="material-symbols-outlined text-[18px]">{notifications ? "notifications_active" : "add_alert"}</span>
            {notifications ? "Reminders On" : "Enable Reminders"}
          </button>
        </div>

        <CountdownWidget />

        {/* Type filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {(["All", "voting", "registration", "nomination", "campaign", "result"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === f ? "bg-primary text-on-primary border-primary" : "bg-white text-on-surface-variant border-[#c6c8b7] hover:border-primary hover:text-primary"}`}
            >
              {f === "All" ? "All Events" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {filtered.length} events · Updated from ECI
        </p>

        <div>
          {filtered.map((e, i) => (
            <TimelineItem
              key={e.id}
              event={e}
              isLast={i === filtered.length - 1}
              onNotify={(title) => show(`Reminder set for "${title}"!`, "success", "notifications_active")}
            />
          ))}
        </div>
      </main>
      <div className="max-w-4xl mx-auto w-full px-8 mt-4"><Footer /></div>
    </div>
  );
}
