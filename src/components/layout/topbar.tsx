"use client";

import { Bell, Settings, LogOut, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  civicScore?: number;
}

export function Topbar({ civicScore = 850 }: TopbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/explainer?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 md:left-[200px] right-0 h-14 bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a] flex items-center px-4 gap-3 z-40">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search elections, candidates…"
            className="w-full h-8 pl-8 pr-3 bg-[#18181b] border border-[#27272a] rounded-md text-[#fafafa] text-sm placeholder:text-[#52525b] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
        </div>
      </form>

      <div className="flex-1" />

      {/* Civic Score */}
      <Link
        href="/dashboard"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-colors"
      >
        <Trophy className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-sm font-semibold text-violet-400">
          {civicScore.toLocaleString()}
        </span>
        <span className="text-xs text-[#71717a]">pts</span>
      </Link>

      {/* Notifications */}
      <button
        className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500"></span>
      </button>

      {/* Settings */}
      <Link
        href="/settings"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] transition-all"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4" />
      </Link>

      {/* Logout */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#27272a] text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-all"
        aria-label="Logout"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
