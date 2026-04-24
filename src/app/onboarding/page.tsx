"use client";

import { useState } from "react";
import Link from "next/link";
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

const PRIORITY_STYLES: Record<string, string> = {
  high:   "bg-error-container text-error border border-error/30",
  medium: "bg-secondary-fixed text-on-surface border border-secondary/30",
  low:    "bg-[#f4f3f3] text-on-surface-variant border border-[#e2e2e2]",
  info:   "bg-primary-fixed text-primary border border-primary/20",
};

const STEPS = [
  { icon: "person",      label: "About You" },
  { icon: "location_on", label: "Location" },
  { icon: "credit_card", label: "Voter Status" },
  { icon: "check_circle", label: "Your Plan" },
];

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                active
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : done
                  ? "bg-primary-fixed text-primary border-primary/20"
                  : "bg-white text-on-surface-variant border-[#c6c8b7]"
              )}
            >
              <span className="material-symbols-outlined text-[14px]">
                {done ? "check_circle" : s.icon}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-5 h-px ${i < current ? "bg-primary" : "bg-[#c6c8b7]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(0);
  const [profile, setProfile] = useState<UserProfile>({
    age: "",
    state: "",
    constituency: "",
    voterStatus: "",
  });
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
    <div className="min-h-full flex items-center justify-center p-6 animate-fade-in bg-surface-container-lowest">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-[14px]">how_to_vote</span>
            Voter Onboarding
          </div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">
            Start Your Voting Journey
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Answer 3 quick questions to get your personalized civic plan.
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white rounded-3xl border border-[#d4c5a3] shadow-[0_8px_32px_rgba(68,86,20,0.08)] p-7 animate-slide-up">

          {/* Step 0: Age */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">How old are you?</h2>
                  <p className="text-xs text-on-surface-variant">This helps us give you the right guidance.</p>
                </div>
              </div>
              <input
                type="number"
                min={1}
                max={120}
                value={profile.age}
                onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))}
                placeholder="Enter your age"
                className="w-full h-14 px-5 bg-[#f9f9f9] border border-[#c6c8b7] rounded-2xl text-on-surface text-2xl text-center font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {profile.age && parseInt(profile.age) < 18 && (
                <div className="mt-3 flex items-center gap-2 bg-secondary-fixed text-on-surface border border-secondary/20 rounded-xl px-4 py-2.5 text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                  You&apos;re not yet eligible to vote, but we&apos;ll help you learn and prepare!
                </div>
              )}
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Where are you located?</h2>
                  <p className="text-xs text-on-surface-variant">Your state and constituency determines your ballot.</p>
                </div>
              </div>
              <div className="space-y-3">
                <select
                  value={profile.state}
                  onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                  className="w-full h-12 px-4 bg-[#f9f9f9] border border-[#c6c8b7] rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-sm"
                >
                  <option value="">Select your state…</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={profile.constituency}
                  onChange={(e) => setProfile((p) => ({ ...p, constituency: e.target.value }))}
                  placeholder="Enter your constituency (optional)"
                  className="w-full h-12 px-4 bg-[#f9f9f9] border border-[#c6c8b7] rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 2: Voter Status */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">how_to_reg</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">What&apos;s your voter status?</h2>
                  <p className="text-xs text-on-surface-variant">This determines your most urgent next steps.</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { v: "registered",     l: "I'm registered to vote",  d: "Voter ID card verified", icon: "check_circle" },
                  { v: "not-registered", l: "I'm not registered yet",   d: "Need to register on ECI portal", icon: "pending" },
                  { v: "unsure",         l: "I'm not sure",             d: "We'll help you check", icon: "help" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setProfile((p) => ({ ...p, voterStatus: opt.v }))}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3",
                      profile.voterStatus === opt.v
                        ? "bg-primary-fixed border-primary text-primary shadow-sm"
                        : "bg-[#f9f9f9] border-[#c6c8b7] hover:border-primary/50"
                    )}
                  >
                    <span className={`material-symbols-outlined text-[20px] shrink-0 ${profile.voterStatus === opt.v ? "text-primary icon-fill" : "text-on-surface-variant"}`}>
                      {opt.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{opt.l}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{opt.d}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Checklist */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[20px] icon-fill">task_alt</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Your Personalized Plan 🎯</h2>
                  <p className="text-xs text-on-surface-variant">Based on your profile in {profile.state}.</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={cn("flex items-start gap-3 p-3.5 rounded-xl border", PRIORITY_STYLES[item.priority] ?? "")}
                  >
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">
                      {item.priority === "high" ? "priority_high" : item.priority === "info" ? "info" : "check_circle"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{item.task}</p>
                      {"link" in item && item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-0.5 block flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          {item.link}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:bg-[#536522] active:scale-[0.98] transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                Go to My Dashboard
              </Link>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#e2e2e2]">
            {step > 0 && step < 3 ? (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#c6c8b7] text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
            ) : <div />}

            {step < 3 && (
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl hover:bg-[#536522] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm"
              >
                {step === 2 ? "Generate My Plan" : "Continue"}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
