"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",       icon: "dashboard",     href: "/" },
  { label: "My Booth",        icon: "how_to_vote",   href: "/booths" },
  { label: "Candidate Match", icon: "person_search", href: "/candidates" },
  { label: "AI Explainer",    icon: "psychology",    href: "/explainer" },
  { label: "News Verifier",   icon: "fact_check",    href: "/fact-check" },
  { label: "Timeline",        icon: "event",         href: "/timeline" },
];

const NAV_BOTTOM = [
  { label: "Accessibility", icon: "accessibility", href: "/accessibility" },
  { label: "Settings",    icon: "settings",  href: "/settings" },
  { label: "Help",        icon: "help",      href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className="fixed left-0 top-0 h-full w-64 flex-col z-40 hidden md:flex"
        style={{ background: "var(--sidebar-bg)", borderRight: "1px solid rgba(198,200,183,0.6)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-6 pb-5">
          <Link href="/" className="block">
            <h1 className="text-xl font-black tracking-tight" style={{ color: "#445614" }}>
              CivicLens
            </h1>
            <p className="text-[10px] font-bold text-[#72674b] mt-0.5 tracking-widest uppercase">
              Engagement Portal
            </p>
          </Link>
        </div>

        {/* Main nav */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <p className="text-[10px] font-bold text-[#72674b] uppercase tracking-widest px-3 mb-2">Main</p>
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 mx-1 my-0.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  active
                    ? "bg-white text-[#445614] shadow-sm font-bold"
                    : "text-[#50462c] hover:bg-white/60 hover:translate-x-0.5"
                )}
              >
                <span
                  className="material-symbols-outlined text-[20px] shrink-0"
                  style={active ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#445614] shrink-0" />
                )}
              </Link>
            );
          })}

          <p className="text-[10px] font-bold text-[#72674b] uppercase tracking-widest px-3 mt-5 mb-2">More</p>
          {NAV_BOTTOM.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 mx-1 my-0.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white text-[#445614] shadow-sm font-bold"
                    : "text-[#50462c] hover:bg-white/60"
                )}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User card */}
        <div className="p-4 border-t border-[#c6c8b7]/60 mt-auto">
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-[#c6c8b7]/40 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#445614] text-[#daf19e] flex items-center justify-center font-black text-sm shrink-0">
                JD
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#1a1c1c] truncate">Jane Doe</span>
                <span className="text-[10px] text-[#50462c] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[12px] text-[#fc9842] icon-fill">stars</span>
                  450 pts · Engaged Citizen
                </span>
              </div>
            </div>
            <button
              onClick={() => {}}
              className="text-[#50462c] hover:text-[#445614] transition-colors p-1.5 rounded-lg hover:bg-white/60"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-white border-t border-[#c6c8b7] flex">
        {[...NAV.slice(0, 5)].map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors",
                active ? "text-[#445614]" : "text-[#76786a] hover:text-[#445614]"
              )}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-semibold truncate max-w-[56px] text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
