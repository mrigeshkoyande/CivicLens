"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/toast";

export default function LandingPage() {
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { show("Please enter a valid email address.", "error", "email"); return; }
    setSubscribed(true);
    show("Subscribed! Civic alerts will come to your inbox.", "success", "mark_email_read");
  };

  const FEATURES = [
    { icon: "psychology",    title: "AI Explainer",         desc: "Complex policies made simple. Ask anything about your ballot, rights, or candidates in plain language.", href: "/explainer",   accent: "#445614",  textAccent: "#daf19e" },
    { icon: "fact_check",   title: "Fake News Detector",   desc: "Real-time verification of viral claims using AI and trusted sources before you share.", href: "/fact-check",  accent: "#72674b",  textAccent: "#f6e6c3" },
    { icon: "person_search",title: "Candidate Match",       desc: "Discover which candidates align most with your values through data-driven analysis.", href: "/candidates",  accent: "#924c00",  textAccent: "#ffdcc4" },
    { icon: "how_to_vote",  title: "Booth Finder",          desc: "Locate your nearest polling booth with live wait times and accessibility info.", href: "/booths",      accent: "#594f34",  textAccent: "#f1e1be" },
    { icon: "event",        title: "Election Timeline",     desc: "All key dates — registration deadlines, polling days, result announcements — in one place.", href: "/timeline",    accent: "#3b4d0b",  textAccent: "#d5ec99" },
    { icon: "workspace_premium", title: "Civic Score",       desc: "Track your civic engagement and earn points for staying informed and participating.", href: "/",            accent: "#fc9842",  textAccent: "#ffffff" },
  ];

  const STATS = [
    { value: "2.4M+", label: "Citizens Informed" },
    { value: "98%",   label: "Fact-Check Accuracy" },
    { value: "543",   label: "Constituencies Covered" },
    { value: "12",    label: "Languages Supported" },
  ];

  return (
    <div className="min-h-full flex flex-col">
      {/* ── Hero ── */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden bg-surface-container-lowest">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#daf19e]/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#f1e1be]/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left text */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 bg-[#72674b] text-[#f6e6c3] px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Community-Driven Reliability · Powered by Gemini AI
            </div>
            <h1 className="text-5xl font-black text-on-surface mb-6 leading-[1.1] tracking-tight">
              Your Smart{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #445614, #72674b)" }}>
                Civic Assistant
              </span>{" "}
              for a Stronger Democracy.
            </h1>
            <p className="text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
              Empowering citizens with AI-driven insights, verifiable news, and transparent political tracking.
              Build a deeper connection with your community today.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#536522] active:scale-95 transition-all shadow-md hover:shadow-lg"
              >
                Start My Journey
              </Link>
              <button
                onClick={() => setVideoOpen(true)}
                className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider hover:text-[#536522] transition-colors py-3"
              >
                <span className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[22px] icon-fill">play_arrow</span>
                </span>
                Watch Demo
              </button>
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              {STATS.map((s) => (
                <div key={s.label} className="text-center p-3 bg-white/60 rounded-xl border border-[#c6c8b7]/40">
                  <span className="block text-2xl font-black text-primary">{s.value}</span>
                  <span className="block text-[10px] text-on-surface-variant font-semibold mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-6 relative">
            <div className="w-full rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(68,86,20,0.12)] border border-[#c6c8b7]/30 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                alt="Civic community engagement"
                className="w-full h-[420px] object-cover"
              />
              {/* Floating cards */}
              <div className="absolute bottom-5 left-5 right-5 glass-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#445614] text-[#daf19e] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-fill">how_to_vote</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-on-surface">Local Elections Approaching</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Verify your voter registration status now.</p>
                </div>
                <Link href="/booths" className="bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#536522] active:scale-95 transition-all whitespace-nowrap">
                  Find Booth →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bento ── */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-on-surface mb-3">Tools for an Engaged Citizenry</h2>
            <p className="text-lg text-on-surface-variant">Navigate the complexities of modern governance with our suite of intelligent features.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-white rounded-2xl p-6 border border-[#e2e2e2] hover:border-[#c6c8b7] hover:shadow-[0_8px_24px_rgba(89,79,52,0.08)] hover:-translate-y-1 transition-all flex flex-col gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: f.accent }}
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ color: f.textAccent }}>{f.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
                <div className="flex items-center text-primary text-xs font-bold mt-auto group-hover:gap-2 gap-1 transition-all">
                  Explore <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <span className="material-symbols-outlined text-[#fc9842] text-[40px] mb-4 block">mark_email_unread</span>
          <h2 className="text-3xl font-black text-on-primary mb-3">Stay Ahead of Every Election</h2>
          <p className="text-base text-primary-fixed-dim mb-8">
            Get weekly civic briefings, fact-checks, and election alerts delivered straight to your inbox.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 bg-[#536522] text-[#daf19e] px-8 py-4 rounded-full font-bold">
              <span className="material-symbols-outlined text-[22px] icon-fill">check_circle</span>
              You&apos;re subscribed — check your inbox!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-full bg-white/20 text-on-primary placeholder:text-primary-fixed-dim border border-white/30 focus:outline-none focus:border-white focus:bg-white/30 transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-[#fc9842] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#ffb780] active:scale-95 transition-all whitespace-nowrap shadow-md"
              >
                Subscribe Free
              </button>
            </form>
          )}
          <p className="text-xs text-primary-fixed-dim mt-4 opacity-70">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-6">
        <Footer />
      </div>

      {/* Video modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">CivicLens Demo</h3>
              <button onClick={() => setVideoOpen(false)} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-[#f4f3f3] rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="aspect-video w-full bg-[#1a1c1c] rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-white">
                <span className="material-symbols-outlined text-[64px] text-[#fc9842] mb-3 block icon-fill">play_circle</span>
                <p className="text-base font-semibold">Demo Video</p>
                <p className="text-sm text-[#a1a1aa] mt-1">Coming soon — launching with the full platform</p>
              </div>
            </div>
            <div className="mt-5 flex justify-between items-center">
              <p className="text-sm text-on-surface-variant">Try the live app instead:</p>
              <Link href="/" onClick={() => setVideoOpen(false)} className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm font-bold hover:bg-[#536522] transition-colors">
                Open Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
