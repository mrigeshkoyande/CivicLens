"use client";

import { Settings, Bell, Globe, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-violet-400 mb-2"><Settings className="w-3.5 h-3.5" />SETTINGS</div>
      <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight mb-1">Settings</h1>
      <p className="text-[#71717a] text-sm mb-6">Manage your CivicLens preferences.</p>

      <div className="space-y-4">
        {/* Notifications */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#fafafa] mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-violet-400" />Notifications</h2>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-[#fafafa]">Election reminders</p><p className="text-xs text-[#71717a]">Get notified before voting phases</p></div>
            <button onClick={() => setNotifications(!notifications)} className={cn("w-10 h-6 rounded-full transition-all relative", notifications ? "bg-violet-500" : "bg-[#27272a]")}>
              <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", notifications ? "left-5" : "left-1")} />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#fafafa] mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-violet-400" />Language</h2>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-10 px-3 bg-[#111114] border border-[#27272a] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-violet-500/50 cursor-pointer">
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
          </select>
        </div>

        {/* Privacy */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#fafafa] mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" />Privacy</h2>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-[#fafafa]">Anonymous analytics</p><p className="text-xs text-[#71717a]">Help improve CivicLens (no personal data)</p></div>
            <button onClick={() => setDataSharing(!dataSharing)} className={cn("w-10 h-6 rounded-full transition-all relative", dataSharing ? "bg-violet-500" : "bg-[#27272a]")}>
              <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", dataSharing ? "left-5" : "left-1")} />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-[#18181b] border border-[#ef4444]/20 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#ef4444] mb-3 flex items-center gap-2"><Trash2 className="w-4 h-4" />Danger Zone</h2>
          <p className="text-xs text-[#71717a] mb-3">This will clear all your saved data, Civic Score, and preferences.</p>
          <button onClick={() => { if (confirm("Are you sure? This cannot be undone.")) localStorage.clear(); }} className="px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs font-medium rounded-lg hover:bg-[#ef4444]/20 transition-all">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
