"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/toast";

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
      checked ? "bg-primary" : "bg-[#c6c8b7]"
    }`}
    aria-checked={checked}
    role="switch"
  >
    <div
      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const { show } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [electionAlerts, setElectionAlerts] = useState(true);
  const [language, setLanguage] = useState("English");
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            Preferences
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Settings</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage your CivicLens preferences and account settings.
          </p>
        </header>

        <div className="space-y-5">
          {/* Notifications */}
          <section className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e2e2] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
              <h2 className="text-sm font-bold text-on-surface">Notifications</h2>
            </div>
            <div className="divide-y divide-[#f4f3f3]">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Election reminders</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Get notified before voting phases and deadlines</p>
                </div>
                <Toggle checked={notifications} onChange={() => {
                  setNotifications(!notifications);
                  show(notifications ? "Reminders disabled." : "Election reminders enabled!", notifications ? "info" : "success", "notifications");
                }} />
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Civic alerts</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Breaking news, fact-checks, and urgent updates</p>
                </div>
                <Toggle checked={electionAlerts} onChange={() => {
                  setElectionAlerts(!electionAlerts);
                  show(electionAlerts ? "Civic alerts disabled." : "Civic alerts enabled!", electionAlerts ? "info" : "success", "campaign");
                }} />
              </div>
            </div>
          </section>

          {/* Language */}
          <section className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e2e2] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">language</span>
              <h2 className="text-sm font-bold text-on-surface">Language</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs text-on-surface-variant mb-3">
                Choose the language for AI explanations and civic content.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["English", "Hindi", "Marathi"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); show(`Language set to ${lang}`, "info", "language"); }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      language === lang
                        ? "bg-primary text-on-primary border-primary shadow-sm"
                        : "bg-[#f4f3f3] text-on-surface border-[#c6c8b7] hover:border-primary hover:text-primary"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e2e2] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
              <h2 className="text-sm font-bold text-on-surface">Privacy</h2>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-on-surface">Anonymous analytics</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Help improve CivicLens (no personal data collected)</p>
              </div>
              <Toggle checked={dataSharing} onChange={() => {
                setDataSharing(!dataSharing);
                show(dataSharing ? "Analytics disabled." : "Thank you for helping improve CivicLens!", dataSharing ? "info" : "success", "analytics");
              }} />
            </div>
          </section>

          {/* Danger zone */}
          <section className="bg-white rounded-2xl border border-error/30 shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden">
            <div className="px-6 py-4 border-b border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">delete_forever</span>
              <h2 className="text-sm font-bold text-error">Danger Zone</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs text-on-surface-variant mb-4">
                This will permanently clear all your saved data, Civic Score, and preferences. This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (confirm("Are you sure? This cannot be undone.")) {
                    localStorage.clear();
                    show("All local data cleared.", "info", "delete_forever");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-error-container text-error border border-error/30 text-xs font-bold rounded-lg hover:bg-error hover:text-on-error active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Clear All Data
              </button>
            </div>
          </section>
        </div>
      </main>

      <div className="max-w-3xl mx-auto w-full px-8 mt-8">
        <Footer />
      </div>
    </div>
  );
}
