"use client";

import { HelpCircle, MessageSquare, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

const FAQS = [
  { q: "How do I find my polling booth?", a: "Go to the Booth Finder page and enter your address or PIN code. We'll show the nearest booths with wait times and directions.", href: "/booths" },
  { q: "Is the AI content reliable?", a: "JanVote AI uses Google Gemini with curated prompts and falls back to verified mock data. All AI responses are clearly labelled. Always verify from official ECI sources.", href: "/fact-check" },
  { q: "How is my Civic Score calculated?", a: "You earn points by completing actions: registering, finding your booth, comparing candidates, and fact-checking claims. Max score is 1000.", href: "/" },
  { q: "Can I use this in Hindi or Marathi?", a: "Yes! The AI Explainer supports English, Hindi, and Marathi. Switch languages using the globe icon in the top bar.", href: "/explainer" },
];

export default function HelpPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-violet-400 mb-2"><HelpCircle className="w-3.5 h-3.5" />HELP & SUPPORT</div>
      <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight mb-1">Help Center</h1>
      <p className="text-[#71717a] text-sm mb-8">Answers to common questions about CivicLens and India&apos;s elections.</p>

      <div className="space-y-3 mb-8">
        {FAQS.map((faq) => (
          <Link key={faq.q} href={faq.href} className="block bg-[#18181b] border border-[#27272a] rounded-xl p-4 hover:border-[#3f3f46] transition-all group">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#fafafa] mb-1 group-hover:text-violet-400 transition-colors">{faq.q}</p>
                <p className="text-xs text-[#71717a] leading-relaxed">{faq.a}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#52525b] shrink-0 mt-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/explainer" className="flex items-center gap-3 p-4 bg-[#18181b] border border-[#27272a] rounded-xl hover:border-violet-500/30 transition-all">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-violet-400" /></div>
          <div><p className="text-sm font-medium text-[#fafafa]">Ask AI Explainer</p><p className="text-xs text-[#71717a]">Get instant answers</p></div>
        </Link>
        <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#18181b] border border-[#27272a] rounded-xl hover:border-[#34d399]/30 transition-all">
          <div className="w-8 h-8 rounded-lg bg-[#34d399]/15 flex items-center justify-center"><BookOpen className="w-4 h-4 text-[#34d399]" /></div>
          <div><p className="text-sm font-medium text-[#fafafa]">ECI Official Site</p><p className="text-xs text-[#71717a]">eci.gov.in</p></div>
        </a>
      </div>
    </div>
  );
}
