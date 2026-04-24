"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, User, MapPin, CreditCard } from "lucide-react";
import { generateChecklist } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

type Step = 0 | 1 | 2 | 3;

interface UserProfile {
  age: string;
  state: string;
  constituency: string;
  voterStatus: string;
}

const PRIORITIES: Record<string, string> = {
  high: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30",
  medium: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30",
  low: "text-[#a1a1aa] bg-[#27272a] border-[#3f3f46]",
  info: "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/30",
};

function StepIndicator({ current }: { current: Step }) {
  const steps = [{ icon: User, label: "About You" }, { icon: MapPin, label: "Location" }, { icon: CreditCard, label: "Voter Status" }, { icon: CheckCircle2, label: "Your Plan" }];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all", active ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : done ? "bg-[#34d399]/15 border-[#34d399]/30 text-[#34d399]" : "bg-[#111114] border-[#27272a] text-[#52525b]")}>
              <Icon className="w-3 h-3" />{s.label}
            </div>
            {i < steps.length - 1 && <div className="w-4 h-px bg-[#27272a]" />}
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(0);
  const [profile, setProfile] = useState<UserProfile>({ age: "", state: "", constituency: "", voterStatus: "" });
  const [checklist, setChecklist] = useState<ReturnType<typeof generateChecklist>>([]);

  const canNext = () => {
    if (step === 0) return profile.age !== "" && parseInt(profile.age) >= 1;
    if (step === 1) return profile.state !== "";
    if (step === 2) return profile.voterStatus !== "";
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
      const items = generateChecklist(parseInt(profile.age), profile.state, profile.voterStatus);
      setChecklist(items);
      setStep(3);
    } else {
      setStep((s) => (s + 1) as Step);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight">Start Your Voting Journey</h1>
          <p className="text-[#71717a] text-sm mt-1">Answer 3 quick questions to get your personalized plan.</p>
        </div>
        <StepIndicator current={step} />

        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 animate-slide-up">
          {/* Step 0: Age */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#fafafa] mb-1">How old are you?</h2>
              <p className="text-sm text-[#71717a] mb-4">This helps us give you the right guidance.</p>
              <input type="number" min={1} max={120} value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} placeholder="Enter your age"
                className="w-full h-12 px-4 bg-[#111114] border border-[#27272a] rounded-xl text-[#fafafa] text-lg text-center focus:outline-none focus:border-violet-500/50 transition-all" />
              {profile.age && parseInt(profile.age) < 18 && (
                <p className="text-xs text-[#f59e0b] mt-2 text-center">You&apos;re not yet eligible to vote, but we&apos;ll help you learn and prepare!</p>
              )}
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-[#fafafa] mb-1">Where are you located?</h2>
              <p className="text-sm text-[#71717a] mb-4">Your state and constituency determines your ballot.</p>
              <div className="space-y-3">
                <select value={profile.state} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                  className="w-full h-12 px-4 bg-[#111114] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer">
                  <option value="">Select your state…</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" value={profile.constituency} onChange={e => setProfile(p => ({ ...p, constituency: e.target.value }))} placeholder="Enter your constituency (optional)"
                  className="w-full h-12 px-4 bg-[#111114] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-violet-500/50 transition-all" />
              </div>
            </div>
          )}

          {/* Step 2: Voter Status */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-[#fafafa] mb-1">What&apos;s your voter status?</h2>
              <p className="text-sm text-[#71717a] mb-4">This determines your most urgent next steps.</p>
              <div className="space-y-2">
                {[
                  { v: "registered", l: "I'm registered to vote", d: "Voter ID card verified" },
                  { v: "not-registered", l: "I'm not registered yet", d: "Need to register on ECI portal" },
                  { v: "unsure", l: "I'm not sure", d: "We'll help you check" },
                ].map(opt => (
                  <button key={opt.v} onClick={() => setProfile(p => ({ ...p, voterStatus: opt.v }))}
                    className={cn("w-full text-left p-4 rounded-xl border transition-all", profile.voterStatus === opt.v ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-[#111114] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]")}>
                    <p className="font-medium text-sm text-[#fafafa]">{opt.l}</p>
                    <p className="text-xs mt-0.5 opacity-70">{opt.d}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Checklist */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-[#fafafa] mb-1">Your Personalized Plan 🎯</h2>
              <p className="text-sm text-[#71717a] mb-4">Based on your profile in {profile.state}.</p>
              <div className="space-y-2">
                {checklist.map(item => (
                  <div key={item.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", PRIORITIES[item.priority] ?? "")}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#fafafa]">{item.task}</p>
                      {"link" in item && item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:underline mt-0.5 block">{item.link}</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#27272a]">
            {step > 0 ? (
              <button onClick={() => setStep(s => (s - 1) as Step)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#27272a] text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-all">
                <ChevronLeft className="w-4 h-4" />Back
              </button>
            ) : <div />}
            {step < 3 && (
              <button onClick={handleNext} disabled={!canNext()} className="flex items-center gap-1.5 px-5 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all">
                {step === 2 ? "Generate My Plan" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
