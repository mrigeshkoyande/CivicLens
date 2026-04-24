"use client";

import { useState } from "react";
import { MapPin, Search, Mic, Accessibility as WheelchairIcon, Navigation, Share2, Zap } from "lucide-react";
import { POLLING_BOOTHS } from "@/lib/mock-data";
import type { PollingBooth } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Filter = "closest" | "fastest" | "accessible";

const WAIT_COLORS = {
  low: { text: "text-[#34d399]", bg: "bg-[#34d399]/15", border: "border-[#34d399]/30", icon: "⚡" },
  medium: { text: "text-[#f59e0b]", bg: "bg-[#f59e0b]/15", border: "border-[#f59e0b]/30", icon: "🕐" },
  high: { text: "text-[#ef4444]", bg: "bg-[#ef4444]/15", border: "border-[#ef4444]/30", icon: "⚠" },
};

function BoothCard({ booth, isSelected, onClick }: { booth: PollingBooth; isSelected: boolean; onClick: () => void }) {
  const wait = WAIT_COLORS[booth.waitLevel];
  return (
    <div onClick={onClick} className={cn("p-4 rounded-xl border cursor-pointer transition-all", isSelected ? "bg-[#18181b] border-violet-500/40" : "bg-[#111114] border-[#27272a] hover:border-[#3f3f46]")}>
      {booth.recommended && (
        <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider mb-2">★ RECOMMENDED MATCH</p>
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[#fafafa]">{booth.name}</h3>
        <span className={cn("text-xs px-2 py-1 rounded-full border shrink-0", wait.text, wait.bg, wait.border)}>
          {wait.icon} {booth.waitTime}m wait
        </span>
      </div>
      <p className="text-xs text-[#71717a] mb-3">{booth.address}</p>
      <div className="flex items-center gap-3 text-xs text-[#a1a1aa]">
        <span className="flex items-center gap-1">🚶 {booth.distance} · {booth.walkTime}</span>
        {booth.hasWheelchairAccess && <span className="flex items-center gap-1 text-[#34d399]">♿ Wheelchair Access</span>}
      </div>
      {isSelected && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[#27272a]">
          <a href={`https://maps.google.com/?q=${booth.lat},${booth.lng}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium rounded-lg transition-colors">
            <Navigation className="w-3.5 h-3.5" />Get Directions
          </a>
          <button className="flex items-center justify-center p-2 bg-[#27272a] hover:bg-[#3f3f46] rounded-lg transition-colors">
            <Share2 className="w-3.5 h-3.5 text-[#a1a1aa]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BoothsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("closest");
  const [selected, setSelected] = useState<string>("booth-1");
  const [showWheelchair, setShowWheelchair] = useState(false);

  const filtered = POLLING_BOOTHS.filter(b => {
    if (showWheelchair && !b.hasWheelchairAccess) return false;
    if (filter === "fastest") return b.waitLevel === "low" || b.waitLevel === "medium";
    if (filter === "accessible") return b.hasWheelchairAccess;
    return true;
  });

  return (
    <div className="h-[calc(100vh-3.5rem)] flex animate-fade-in">
      {/* Left panel */}
      <div className="w-full md:w-[420px] shrink-0 flex flex-col border-r border-[#27272a] overflow-y-auto">
        <div className="p-4 md:p-5 border-b border-[#27272a]">
          <h1 className="text-xl font-bold text-[#fafafa] mb-4">Nearest Booths</h1>
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Enter your address or PIN code"
              className="w-full h-10 pl-9 pr-10 bg-[#18181b] border border-[#27272a] rounded-lg text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-violet-500/50 transition-all" />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-violet-400 transition-colors"><Mic className="w-4 h-4" /></button>
          </div>
          {/* Filters */}
          <div className="flex gap-2">
            {(["closest", "fastest", "accessible"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-all", filter === f ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-[#111114] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]")}>
                {f === "closest" ? "Closest" : f === "fastest" ? "Fastest Queue" : "Accessible"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-3">
          {filtered.map(b => (
            <BoothCard key={b.id} booth={b} isSelected={selected === b.id} onClick={() => setSelected(b.id)} />
          ))}
        </div>
      </div>

      {/* Map panel */}
      <div className="hidden md:flex flex-1 relative bg-[#0c0c0f] items-center justify-center">
        {/* Placeholder map */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 60% 40%, #a78bfa22 0%, transparent 60%)" }} />
        <div className="text-center">
          <MapPin className="w-12 h-12 text-violet-500 mx-auto mb-3 opacity-50" />
          <p className="text-[#52525b] text-sm">Map integration requires Google Maps API key</p>
          <p className="text-[#3f3f46] text-xs mt-1">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local</p>
        </div>
        {/* Simulated booth pins */}
        {POLLING_BOOTHS.map((b, i) => (
          <div key={b.id} onClick={() => setSelected(b.id)} className={cn("absolute cursor-pointer", i === 0 ? "top-[40%] right-[35%]" : i === 1 ? "top-[55%] right-[45%]" : i === 2 ? "top-[65%] right-[30%]" : "top-[30%] right-[55%]")}>
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all", selected === b.id ? "bg-violet-500 border-violet-600 text-white shadow-violet" : "bg-[#18181b]/80 border-[#27272a] text-[#fafafa]")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", b.waitLevel === "low" ? "bg-[#34d399]" : b.waitLevel === "medium" ? "bg-[#f59e0b]" : "bg-[#ef4444]")} />
              {b.name.split(" ").slice(0,2).join(" ")} ({b.waitTime}m)
            </div>
          </div>
        ))}
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={() => setShowWheelchair(!showWheelchair)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all", showWheelchair ? "bg-[#34d399]/15 border-[#34d399]/30 text-[#34d399]" : "bg-[#18181b] border-[#27272a] text-[#a1a1aa]")}>
            <WheelchairIcon className="w-3.5 h-3.5" />Show Wheelchair Paths
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <button className="w-8 h-8 bg-[#18181b] border border-[#27272a] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-lg font-light">+</button>
          <button className="w-8 h-8 bg-[#18181b] border border-[#27272a] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-lg font-light">−</button>
        </div>
        <button className="absolute bottom-14 right-4 w-8 h-8 bg-[#18181b] border border-[#27272a] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-violet-400 transition-colors">
          <Zap className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
