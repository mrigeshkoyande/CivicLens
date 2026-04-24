"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/toast";

interface Setting {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export default function AccessibilityPage() {
  const { show } = useToast();
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: "large-text",
      label: "Large Text Mode",
      description: "Increase all font sizes for easier reading.",
      icon: "text_increase",
      enabled: false,
    },
    {
      id: "voice-output",
      label: "Voice Output (TTS)",
      description: "Read page content aloud using text-to-speech.",
      icon: "volume_up",
      enabled: false,
    },
    {
      id: "simple-ui",
      label: "Simplified UI",
      description: "Remove complex charts and show only essential information.",
      icon: "view_compact",
      enabled: false,
    },
    {
      id: "high-contrast",
      label: "High Contrast",
      description: "Maximize text contrast for low-vision users.",
      icon: "contrast",
      enabled: false,
    },
    {
      id: "reduce-motion",
      label: "Reduce Motion",
      description: "Disable animations and transitions for motion sensitivity.",
      icon: "motion_photos_off",
      enabled: false,
    },
  ]);

  const toggle = (id: string) => {
    setSettings((s) =>
      s.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x))
    );
    const setting = settings.find((s) => s.id === id);
    if (setting) {
      show(
        setting.enabled ? `${setting.label} disabled.` : `${setting.label} enabled.`,
        setting.enabled ? "info" : "success",
        setting.icon
      );
    }
  };

  const voiceOutput = settings.find((s) => s.id === "voice-output")?.enabled;

  const readAloud = (text: string) => {
    if (!voiceOutput) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">accessibility</span>
            Accessibility
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Accessibility Settings</h1>
          <p
            className="text-sm text-on-surface-variant mt-1"
            onMouseEnter={() => readAloud("Accessibility Settings. Configure CivicLens for your needs.")}
          >
            Configure CivicLens for your needs. All settings are saved locally.
          </p>
        </header>

        {/* Settings list */}
        <div className="space-y-3 mb-8">
          {settings.map((s) => (
            <div
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(68,86,20,0.06)] ${
                s.enabled
                  ? "bg-primary-fixed border-primary shadow-sm"
                  : "bg-white border-[#d4c5a3] hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    s.enabled ? "bg-primary" : "bg-[#f4f3f3]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      s.enabled ? "text-on-primary icon-fill" : "text-on-surface-variant"
                    }`}
                  >
                    {s.icon}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${s.enabled ? "text-primary" : "text-on-surface"}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{s.description}</p>
                </div>
              </div>

              {/* Toggle */}
              <div
                className={`relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 ml-4 ${
                  s.enabled ? "bg-primary" : "bg-[#c6c8b7]"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                    s.enabled ? "left-6" : "left-1"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Voice testing */}
        <section className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#e2e2e2] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">mic</span>
            <h2 className="text-sm font-bold text-on-surface">Voice Input &amp; Output</h2>
          </div>
          <div className="p-6">
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Voice input is available on the AI Explainer and Booth Finder pages. Enable Voice Output above, then use the buttons below to test.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => readAloud("Testing voice output. CivicLens is ready to assist you.")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  voiceOutput
                    ? "bg-primary text-on-primary hover:bg-[#536522] active:scale-95 shadow-sm"
                    : "bg-[#f4f3f3] text-on-surface-variant border border-[#c6c8b7] cursor-not-allowed opacity-60"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
                Test Voice Output
              </button>
              <button
                onClick={() => {
                  speechSynthesis.cancel();
                  show("Voice stopped.", "info", "volume_off");
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#c6c8b7] text-on-surface-variant hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">volume_off</span>
                Stop
              </button>
            </div>
            {!voiceOutput && (
              <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Enable &ldquo;Voice Output (TTS)&rdquo; above to use voice features.
              </p>
            )}
          </div>
        </section>

        {/* Keyboard shortcuts */}
        <section className="bg-white rounded-2xl border border-[#d4c5a3] shadow-[0_4px_12px_rgba(68,86,20,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e2e2] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">keyboard</span>
            <h2 className="text-sm font-bold text-on-surface">Keyboard Shortcuts</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "Alt + 1–6", desc: "Navigate to main sections" },
              { key: "Enter", desc: "Send message in AI Explainer" },
              { key: "Shift + Enter", desc: "New line in AI input" },
              { key: "⌘/Ctrl + Enter", desc: "Analyze claim in Fact-Check" },
              { key: "Esc", desc: "Close modal or dialog" },
              { key: "Tab", desc: "Navigate interactive elements" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <span className="text-xs text-on-surface-variant">{s.desc}</span>
                <kbd className="px-2 py-1 bg-white border border-[#c6c8b7] rounded-lg text-[10px] font-mono text-on-surface shadow-sm ml-3 whitespace-nowrap">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="max-w-3xl mx-auto w-full px-8 mt-8">
        <Footer />
      </div>
    </div>
  );
}
