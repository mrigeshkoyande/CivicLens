"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";
import { LoginModal } from "@/components/auth/login-modal";

export function Topbar() {
  const router = useRouter();
  const { show } = useToast();
  const { user, profile, logout } = useAuth();
  const [query, setQuery]         = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogin, setShowLogin]   = useState(false);

  const NOTIFS = [
    { icon: "how_to_vote", text: "Voter registration deadline in 5 days!", time: "2h ago", unread: true },
    { icon: "fact_check",  text: "New fact-check result available",         time: "4h ago", unread: true },
    { icon: "event",       text: "Candidate rally near you tomorrow",       time: "1d ago", unread: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/explainer?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    show("Signed out successfully.", "info", "logout");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <header
        className="sticky top-0 z-50 flex items-center w-full px-5 h-14 gap-4 border-b"
        style={{ background: "var(--topbar-bg)", borderColor: "#c6c8b7" }}
      >
        {/* Mobile brand */}
        <Link href="/" className="text-lg font-black tracking-tight hover:opacity-80 transition-opacity md:hidden shrink-0" style={{ color: "#445614" }}>
          CivicLens
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <div className="w-full flex items-center bg-white rounded-full px-3.5 py-1.5 border border-[#c6c8b7] focus-within:border-[#445614] focus-within:ring-2 focus-within:ring-[#445614]/15 transition-all shadow-sm">
            <button type="submit" className="text-[#76786a] hover:text-[#445614] transition-colors shrink-0">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-[#76786a] w-full px-2 focus:ring-0"
              placeholder="Search topics, ask AI…"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-[#76786a] hover:text-on-surface shrink-0 transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Civic Score */}
          <Link href="/" className="hidden sm:flex items-center gap-1.5 bg-[#445614] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#536522] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[#fc9842] text-[14px] icon-fill">stars</span>
            {profile?.civicScore ?? 850} pts
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="relative p-2 text-[#50462c] hover:text-[#445614] hover:bg-white/70 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error border-2 border-[var(--topbar-bg)]" />
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#e2e2e2] shadow-[0_8px_32px_rgba(89,79,52,0.12)] overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-[#f4f3f3] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-on-surface">Notifications</h3>
                  <button onClick={() => { setShowNotifs(false); show("All notifications marked read.", "success"); }} className="text-xs text-primary font-bold hover:underline">
                    Mark all read
                  </button>
                </div>
                {NOTIFS.map((n, i) => (
                  <button key={i} onClick={() => { setShowNotifs(false); show(n.text, "info", n.icon); }}
                    className="w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-[#f9f9f9] transition-colors border-b border-[#f4f3f3] last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.unread ? "bg-primary-fixed" : "bg-[#e8e8e8]"}`}>
                      <span className={`material-symbols-outlined text-[16px] ${n.unread ? "text-primary" : "text-[#76786a]"}`}>{n.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${n.unread ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>{n.text}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </button>
                ))}
                <div className="p-3 text-center">
                  <Link href="/settings" className="text-xs text-primary font-bold hover:underline" onClick={() => setShowNotifs(false)}>View all →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                className="flex items-center gap-2 bg-white border border-[#c6c8b7] px-2 py-1.5 rounded-full hover:border-primary transition-colors shadow-sm"
              >
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName ?? "User"} width={24} height={24} className="rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-black">
                    {initials}
                  </div>
                )}
                <span className="text-xs font-semibold text-on-surface max-w-[80px] truncate hidden sm:block">
                  {user.displayName?.split(" ")[0] ?? "You"}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#76786a]">expand_more</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#e2e2e2] shadow-[0_8px_32px_rgba(89,79,52,0.12)] overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-[#f4f3f3]">
                    <p className="text-sm font-bold text-on-surface truncate">{user.displayName ?? "User"}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span className="material-symbols-outlined text-[#fc9842] text-[14px] icon-fill">stars</span>
                      {profile?.civicScore ?? 0} Civic Points
                    </div>
                  </div>
                  {[
                    { icon: "dashboard",  label: "Dashboard",  href: "/" },
                    { icon: "settings",   label: "Settings",   href: "/settings" },
                    { icon: "help",       label: "Help",       href: "/help" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-[#f9f9f9] transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-[#76786a]">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-[#f4f3f3]">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container transition-colors">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-1.5 bg-[#445614] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#536522] active:scale-95 transition-all"
            >
              Login
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </button>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
