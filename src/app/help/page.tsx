"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/footer";

const FAQS = [
  {
    q: "How do I find my polling booth?",
    a: "Go to the Booth Finder page and enter your address or PIN code. We'll show the nearest booths with live wait times and directions.",
    href: "/booths",
    icon: "how_to_vote",
  },
  {
    q: "Is the AI content reliable?",
    a: "JanVote AI uses Google Gemini with curated prompts and falls back to verified mock data. All AI responses are clearly labelled. Always verify from official ECI sources.",
    href: "/fact-check",
    icon: "fact_check",
  },
  {
    q: "How is my Civic Score calculated?",
    a: "You earn points by completing actions: registering, finding your booth, comparing candidates, and fact-checking claims. Max score is 1000.",
    href: "/",
    icon: "workspace_premium",
  },
  {
    q: "Can I use this in Hindi or Marathi?",
    a: "Yes! The AI Explainer supports English, Hindi, and Marathi. Switch languages using the language toggle in the Explainer page.",
    href: "/explainer",
    icon: "language",
  },
  {
    q: "How do I register to vote?",
    a: "Visit voters.eci.gov.in to register online, or use our Onboarding wizard to get a personalized checklist for your state.",
    href: "/onboarding",
    icon: "how_to_reg",
  },
];

const QUICK_LINKS = [
  {
    icon: "psychology",
    label: "Ask AI Explainer",
    sub: "Get instant answers",
    href: "/explainer",
    accent: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    icon: "open_in_new",
    label: "ECI Official Site",
    sub: "eci.gov.in",
    href: "https://eci.gov.in",
    accent: "bg-secondary-fixed",
    iconColor: "text-secondary",
    external: true,
  },
  {
    icon: "how_to_reg",
    label: "Voter Registration",
    sub: "voters.eci.gov.in",
    href: "https://voters.eci.gov.in",
    accent: "bg-[#f1e1be]",
    iconColor: "text-[#924c00]",
    external: true,
  },
  {
    icon: "accessibility",
    label: "Accessibility",
    sub: "Visual & audio aids",
    href: "/accessibility",
    accent: "bg-[#daf19e]",
    iconColor: "text-[#445614]",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">help</span>
            Help &amp; Support
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Help Center</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Answers to common questions about CivicLens and India&apos;s elections.
          </p>
        </header>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {QUICK_LINKS.map((ql) =>
            ql.external ? (
              <a
                key={ql.label}
                href={ql.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#d4c5a3] hover:border-primary hover:shadow-[0_4px_12px_rgba(68,86,20,0.08)] hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${ql.accent} flex items-center justify-center mb-2`}>
                  <span className={`material-symbols-outlined text-[20px] ${ql.iconColor}`}>{ql.icon}</span>
                </div>
                <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{ql.label}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{ql.sub}</p>
              </a>
            ) : (
              <Link
                key={ql.label}
                href={ql.href}
                className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#d4c5a3] hover:border-primary hover:shadow-[0_4px_12px_rgba(68,86,20,0.08)] hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${ql.accent} flex items-center justify-center mb-2`}>
                  <span className={`material-symbols-outlined text-[20px] ${ql.iconColor}`}>{ql.icon}</span>
                </div>
                <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{ql.label}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{ql.sub}</p>
              </Link>
            )
          )}
        </div>

        {/* FAQs */}
        <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">quiz</span>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3 mb-8">
          {FAQS.map((faq) => (
            <Link
              key={faq.q}
              href={faq.href}
              className="block bg-white rounded-2xl border border-[#d4c5a3] p-5 hover:border-primary hover:shadow-[0_4px_12px_rgba(68,86,20,0.08)] hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">{faq.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
                    {faq.q}
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{faq.a}</p>
                </div>
                <span className="material-symbols-outlined text-[#c6c8b7] group-hover:text-primary transition-colors shrink-0 mt-0.5">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-[#f1e9d6] rounded-2xl border border-[#d4c5a3] p-6 text-center">
          <span className="material-symbols-outlined text-[#924c00] text-[32px] mb-3 block">support_agent</span>
          <h3 className="text-base font-bold text-on-surface mb-1">Still need help?</h3>
          <p className="text-xs text-on-surface-variant mb-4">
            Our civic support team is available Mon–Sat, 9am–6pm IST.
          </p>
          <a
            href="mailto:support@civiclens.in"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#536522] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Contact Support
          </a>
        </div>
      </main>

      <div className="max-w-3xl mx-auto w-full px-8 mt-8">
        <Footer />
      </div>
    </div>
  );
}
