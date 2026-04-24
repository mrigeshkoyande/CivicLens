"use client";

import Link from "next/link";
import { ArrowRight, Globe, Sparkles, ShieldCheck, Trophy, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Explainer",
    desc: "Complex manifestos decoded instantly. Powered by Gemini, our engine distills political jargon into clear, actionable insights in your preferred language.",
    href: "/explainer",
    cta: "Try an explanation →",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Fake News Detection",
    desc: "Real-time cross-referencing against verified sources to flag misinformation immediately.",
    href: "/fact-check",
    stat: "92% accuracy",
    statColor: "text-[#ef4444]",
    color: "text-[#ef4444]",
    bg: "bg-[#ef4444]/10",
  },
  {
    icon: Trophy,
    title: "Civic Score",
    desc: "Engage with content, verify facts, and prepare for polling day to increase your verified voter standing.",
    href: "/",
    stat: "+50 pts this week",
    statColor: "text-[#34d399]",
    color: "text-[#34d399]",
    bg: "bg-[#34d399]/10",
  },
];

const STATS = [
  { value: "970M+", label: "Eligible Voters" },
  { value: "543", label: "Constituencies" },
  { value: "7", label: "Election Phases" },
  { value: "3", label: "Languages Supported" },
];

export default function LandingPage() {
  const [lang, setLang] = useState("English");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-full text-xs text-[#a1a1aa] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
          Platform Live for 2024 Elections
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-[#fafafa] tracking-tight max-w-3xl leading-[1.1] mb-4">
          Your Smart Civic Assistant for a{" "}
          <span className="violet-text">Stronger Democracy.</span>
        </h1>

        <p className="text-[#a1a1aa] text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          Navigate the democratic process with precision. CivicLens provides
          real-time fact-checking, unbiased candidate comparisons, and contextual
          explanations powered by advanced AI models.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-all hover-lift text-sm"
          >
            Start My Journey
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Language picker */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl text-sm text-[#a1a1aa]">
            <Globe className="w-4 h-4" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-[#fafafa] focus:outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी</option>
              <option value="Marathi">मराठी</option>
            </select>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#27272a] bg-[#0c0c0f]">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#fafafa] tracking-tight">{s.value}</p>
              <p className="text-xs text-[#71717a] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.title}
              href={f.href}
              className="group bg-[#18181b] border border-[#27272a] rounded-2xl p-5 hover:border-[#3f3f46] transition-all hover-lift flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#fafafa] mb-1">{f.title}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed">{f.desc}</p>
              </div>
              {f.stat && (
                <div className={`text-xs font-semibold ${f.statColor}`}>{f.stat}</div>
              )}
              {f.cta && (
                <p className="text-xs text-violet-400 group-hover:text-violet-300 transition-colors">
                  {f.cta}
                </p>
              )}
            </Link>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#27272a] bg-[#0c0c0f]">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-violet-400 mb-3">
            <Zap className="w-3.5 h-3.5" />
            POWERED BY GOOGLE GEMINI AI
          </div>
          <h2 className="text-xl font-bold text-[#fafafa] mb-2">
            Ready to vote smarter?
          </h2>
          <p className="text-sm text-[#71717a] mb-6">
            Join millions of informed voters using CivicLens to make every vote count.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Get Started — It&apos;s Free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
