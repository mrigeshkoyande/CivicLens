"use client";

import { useState } from "react";
import { Accessibility, Type, Volume2, VolumeX, Eye, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Setting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export default function AccessibilityPage() {
  const [settings, setSettings] = useState<Setting[]>([
    { id: "large-text", label: "Large Text Mode", description: "Increase all font sizes for easier reading.", icon: Type, enabled: false },
    { id: "voice-output", label: "Voice Output (TTS)", description: "Read page content aloud using text-to-speech.", icon: Volume2, enabled: false },
    { id: "simple-ui", label: "Simplified UI", description: "Remove complex charts and show only essential information.", icon: Eye, enabled: false },
    { id: "high-contrast", label: "High Contrast", description: "Maximize text contrast for low-vision users.", icon: Zap, enabled: false },
  ]);

  const toggle = (id: string) => setSettings(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  const largeText = settings.find(s => s.id === "large-text")?.enabled;
  const voiceOutput = settings.find(s => s.id === "voice-output")?.enabled;

  const readAloud = (text: string) => {
    if (!voiceOutput) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    speechSynthesis.speak(u);
  };

  return (
    <div className={cn("p-4 md:p-6 max-w-2xl mx-auto animate-fade-in", largeText && "a11y-large")}>
      <div className="flex items-center gap-2 text-xs text-violet-400 mb-2"><Accessibility className="w-3.5 h-3.5" />ACCESSIBILITY</div>
      <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight mb-1">Accessibility Settings</h1>
      <p className="text-[#71717a] text-sm mb-6" onMouseEnter={() => readAloud("Accessibility Settings. Configure CivicLens for your needs.")}>
        Configure CivicLens for your needs. All settings are saved locally.
      </p>

      <div className="space-y-3">
        {settings.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.id} onClick={() => toggle(s.id)}
              className={cn("flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all", s.enabled ? "bg-violet-500/10 border-violet-500/30" : "bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]")}>
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.enabled ? "bg-violet-500/20 text-violet-400" : "bg-[#27272a] text-[#71717a]")}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#fafafa]">{s.label}</p>
                  <p className="text-xs text-[#71717a]">{s.description}</p>
                </div>
              </div>
              <div className={cn("w-10 h-6 rounded-full transition-all relative", s.enabled ? "bg-violet-500" : "bg-[#27272a]")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", s.enabled ? "left-5" : "left-1")} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice instructions */}
      <div className="mt-6 bg-[#18181b] border border-[#27272a] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[#fafafa] mb-2">Voice Input</h2>
        <p className="text-xs text-[#71717a] mb-3">Voice input is available on the AI Explainer and Booth Finder pages. Click the microphone icon to start.</p>
        <div className="flex gap-2">
          <button onClick={() => readAloud("Testing voice output. CivicLens is ready to assist you.")} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/15 border border-violet-500/30 rounded-lg text-xs text-violet-400 hover:bg-violet-500/25 transition-colors">
            <Volume2 className="w-3.5 h-3.5" />Test Voice Output
          </button>
          <button onClick={() => speechSynthesis.cancel()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-xs text-[#a1a1aa] hover:text-[#fafafa] transition-colors">
            <VolumeX className="w-3.5 h-3.5" />Stop
          </button>
        </div>
      </div>
    </div>
  );
}
