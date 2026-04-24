"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  MapPin,
  Users,
  ShieldAlert,
  Calendar,
  HelpCircle,
  Settings,
  Plus,
  Eye,
  Accessibility,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "AI Explainer", href: "/explainer", icon: MessageSquare },
  { label: "Booth Finder", href: "/booths", icon: MapPin },
  { label: "Candidates", href: "/candidates", icon: Users },
  { label: "Fact-Check Lab", href: "/fact-check", icon: ShieldAlert },
  { label: "Timeline", href: "/timeline", icon: Calendar },
  { label: "Accessibility", href: "/accessibility", icon: Accessibility },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-[#0c0c0f] border-r border-[#27272a] flex flex-col z-50 sidebar-hidden md:flex">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#27272a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[#fafafa] font-semibold text-sm leading-none">CivicLens</p>
            <p className="text-[#71717a] text-[10px] mt-0.5 leading-none">JanVote AI</p>
          </div>
        </div>
      </div>

      {/* New Report CTA */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/onboarding"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Start Journey
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-violet-500/12 text-violet-400 border-l-2 border-violet-400 pl-[10px]"
                  : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-[#27272a] pt-3">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

// Mobile bottom navigation
export function MobileNav() {
  const pathname = usePathname();
  const mobileItems = NAV_ITEMS.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c0f] border-t border-[#27272a] flex md:hidden z-50">
      {mobileItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors",
              isActive ? "text-violet-400" : "text-[#71717a]"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
