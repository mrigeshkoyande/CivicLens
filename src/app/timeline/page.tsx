"use client";

import { useState, useEffect } from "react";
import { Calendar, Vote, FileText, Trophy, Megaphone, Clock, Bell, BellOff } from "lucide-react";
import { ELECTION_EVENTS } from "@/lib/mock-data";
import type { ElectionEvent } from "@/lib/mock-data";
import { getDaysUntil, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const EVENT_CONFIG = {
  registration: { icon: FileText, color: "text-[#60a5fa]", bg: "bg-[#60a5fa]/15", border: "border-[#60a5fa]/30", dot: "bg-[#60a5fa]" },
  voting: { icon: Vote, color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30", dot: "bg-violet-500" },
  result: { icon: Trophy, color: "text-[#34d399]", bg: "bg-[#34d399]/15", border: "border-[#34d399]/30", dot: "bg-[#34d399]" },
  nomination: { icon: FileText, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/15", border: "border-[#f59e0b]/30", dot: "bg-[#f59e0b]" },
  campaign: { icon: Megaphone, color: "text-[#f472b6]", bg: "bg-[#f472b6]/15", border: "border-[#f472b6]/30", dot: "bg-[#f472b6]" },
};

function TimelineItem({ event, isLast }: { event: ElectionEvent; isLast: boolean }) {
  const cfg = EVENT_CONFIG[event.type];
  const Icon = cfg.icon;
  const isPast = new Date(event.date) < new Date();
  const daysLeft = getDaysUntil(event.date);
  const isToday = daysLeft === 0 && !isPast;

  return (
    <div className="flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0", isPast ? "bg-[#27272a] border-[#3f3f46]" : cfg.bg, !isPast && cfg.border)}>
          <Icon className={cn("w-3.5 h-3.5", isPast ? "text-[#52525b]" : cfg.color)} />
        </div>
        {!isLast && <div className={cn("w-px flex-1 mt-1", isPast ? "bg-[#27272a]" : "bg-[#27272a]")} style={{ minHeight: "2rem" }} />}
      </div>
      {/* Content */}
      <div className={cn("flex-1 pb-6 animate-fade-in", !isLast && "")}>
        <div className={cn("rounded-xl border p-4 transition-all hover:border-[#3f3f46]", isPast ? "bg-[#0c0c0f] border-[#1c1c1f] opacity-60" : "bg-[#18181b] border-[#27272a]")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              {event.phase && <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">{event.phase} · </span>}
              <h3 className={cn("text-sm font-semibold inline", isPast ? "text-[#71717a] line-through" : "text-[#fafafa]")}>{event.title}</h3>
              <p className="text-xs text-[#71717a] mt-1">{event.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-[#a1a1aa]">{formatDate(event.date)}</p>
              {isPast ? (
                <span className="text-[10px] text-[#52525b]">Completed</span>
              ) : isToday ? (
                <span className="text-[10px] text-[#34d399] font-semibold animate-pulse">TODAY</span>
              ) : (
                <span className={cn("text-[10px] font-semibold", daysLeft <= 7 ? "text-[#f59e0b]" : cfg.color)}>
                  in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownWidget() {
  const nextEvent = ELECTION_EVENTS.find(e => new Date(e.date) >= new Date());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!nextEvent) return;
    const update = () => {
      const diff = new Date(nextEvent.date).getTime() - Date.now();
      setDays(Math.floor(diff / 86400000));
      setHours(Math.floor((diff % 86400000) / 3600000));
      setMinutes(Math.floor((diff % 3600000) / 60000));
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [nextEvent]);

  if (!nextEvent) return null;
  return (
    <div className="bg-[#18181b] border border-violet-500/25 rounded-xl p-5 mb-6 score-glow">
      <p className="text-xs text-violet-400 font-semibold mb-1">NEXT MILESTONE</p>
      <h2 className="text-base font-bold text-[#fafafa] mb-3">{nextEvent.title}</h2>
      <div className="flex gap-3">
        {[{ v: days, l: "Days" }, { v: hours, l: "Hours" }, { v: minutes, l: "Minutes" }].map(({ v, l }) => (
          <div key={l} className="flex-1 text-center bg-[#111114] border border-[#27272a] rounded-lg py-2">
            <p className="text-2xl font-bold text-[#fafafa]">{String(v).padStart(2, "0")}</p>
            <p className="text-[10px] text-[#71717a] uppercase">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const [notifications, setNotifications] = useState(false);
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-violet-400 mb-1"><Calendar className="w-3.5 h-3.5" />ELECTION TIMELINE</div>
          <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight">2024 Lok Sabha Schedule</h1>
          <p className="text-[#71717a] text-sm mt-1">All critical election dates and countdowns in one place.</p>
        </div>
        <button onClick={() => setNotifications(!notifications)}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all shrink-0", notifications ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-[#18181b] border-[#27272a] text-[#a1a1aa]")}>
          {notifications ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          {notifications ? "Reminders On" : "Enable Reminders"}
        </button>
      </div>
      <CountdownWidget />
      <div className="flex items-center gap-2 text-xs text-[#71717a] mb-4"><Clock className="w-3.5 h-3.5" />{ELECTION_EVENTS.length} events · Updates from ECI</div>
      <div>
        {ELECTION_EVENTS.map((e, i) => <TimelineItem key={e.id} event={e} isLast={i === ELECTION_EVENTS.length - 1} />)}
      </div>
    </div>
  );
}
