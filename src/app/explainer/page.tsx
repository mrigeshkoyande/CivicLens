"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send, Mic, MicOff, Sparkles, Globe, Bot, User, Loader2, RefreshCw, ToggleLeft, ToggleRight,
} from "lucide-react";
import { EXPLAINER_SUGGESTIONS, FALLBACK_RESPONSES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Language = "English" | "Hindi" | "Marathi";
interface Message { id: string; role: "user" | "assistant"; content: string; }

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#fafafa]">$1</strong>')
    .replace(/\n/g, "<br/>");
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3 animate-slide-up", isUser && "flex-row-reverse")}>
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
        isUser ? "bg-violet-500/20 text-violet-400" : "bg-[#18181b] border border-[#27272a] text-[#a1a1aa]")}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={cn("max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
        isUser ? "bg-violet-500/15 text-[#fafafa] border border-violet-500/20" : "bg-[#18181b] text-[#a1a1aa] border border-[#27272a]")}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center">
        <Bot className="w-4 h-4 text-[#a1a1aa]" />
      </div>
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 flex items-center gap-1.5">
        {[0,1,2].map(i => <div key={i} className="typing-dot w-2 h-2 rounded-full bg-[#52525b]" style={{animationDelay:`${i*0.2}s`}} />)}
      </div>
    </div>
  );
}

// ─── Inner component uses useSearchParams (must be inside Suspense) ──────────
function ExplainerInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome", role: "assistant",
    content: "Namaste! 🇮🇳 I'm JanVote AI, your personal civic guide. Ask me anything about India's elections — how voting works, your rights as a voter, or anything election-related. I speak **English**, **Hindi**, and **Marathi**!",
  }]);
  const [input, setInput] = useState(() => searchParams.get("q") ?? "");
  const [language, setLanguage] = useState<Language>("English");
  const [simplify, setSimplify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", content: text.trim() }]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text.trim(), language, simplify }),
      });
      const data = await res.json();
      setMessages(p => [...p, { id: Date.now() + "-ai", role: "assistant", content: data.answer ?? "Sorry, try again." }]);
    } catch {
      const fallback = FALLBACK_RESPONSES[text.trim() as keyof typeof FALLBACK_RESPONSES] ?? FALLBACK_RESPONSES["default"];
      setMessages(p => [...p, { id: Date.now() + "-ai", role: "assistant", content: fallback }]);
    } finally { setIsLoading(false); }
  }, [isLoading, language, simplify]);

  const toggleVoice = () => {
    type SpeechRecognitionCtor = new () => {
      lang: string;
      onstart: (() => void) | null;
      onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
      onend: (() => void) | null;
      start: () => void;
    };
    const SpeechRec = (
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition ??
      (window as unknown as Record<string, unknown>).SpeechRecognition
    ) as SpeechRecognitionCtor | undefined;
    if (!SpeechRec) return alert("Voice not supported in this browser.");
    const r = new SpeechRec();
    r.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-IN";
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.onend = () => setIsListening(false);
    r.start();
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-violet-400 mb-1"><Sparkles className="w-3.5 h-3.5" />AI EXPLAINER</div>
          <h1 className="text-xl font-bold text-[#fafafa] tracking-tight">AI Explainer</h1>
          <p className="text-[#71717a] text-sm">Ask anything about India&apos;s elections in your language.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-[#71717a]" />
            <select value={language} onChange={e => setLanguage(e.target.value as Language)} className="bg-transparent text-sm text-[#fafafa] focus:outline-none cursor-pointer">
              <option value="English">English</option>
              <option value="Hindi">हिंदी</option>
              <option value="Marathi">मराठी</option>
            </select>
          </div>
          <button onClick={() => setSimplify(!simplify)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all", simplify ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-[#18181b] border-[#27272a] text-[#a1a1aa]")}>
            {simplify ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            Explain like I&apos;m 15
          </button>
          <button onClick={() => setMessages([{ id: "w2", role: "assistant", content: "Chat cleared! Ask me anything." }])} className="p-1.5 rounded-lg border border-[#27272a] text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#18181b] transition-all"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {EXPLAINER_SUGGESTIONS[language].slice(0, 4).map(s => (
          <button key={s} onClick={() => sendMessage(s)} className="shrink-0 px-3 py-1.5 text-xs rounded-full bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-violet-500/40 transition-all whitespace-nowrap">{s}</button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 bg-[#18181b] border border-[#27272a] rounded-xl p-3 focus-within:border-violet-500/40 transition-all">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
          placeholder={language === "Hindi" ? "अपना सवाल यहाँ लिखें…" : language === "Marathi" ? "तुमचा प्रश्न येथे लिहा…" : "Ask me anything about India's elections…"}
          rows={2}
          className="w-full bg-transparent text-sm text-[#fafafa] placeholder:text-[#52525b] resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-[#52525b]">{input.length}/500</p>
          <div className="flex gap-2">
            <button onClick={toggleVoice} className={cn("p-2 rounded-lg transition-all", isListening ? "bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse" : "bg-[#111114] border border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]")}>
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading} className="flex items-center gap-1.5 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shell wraps inner in Suspense (required for useSearchParams) ─────────────
export default function ExplainerPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#71717a]">
          <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
          <span className="text-sm">Loading AI Explainer…</span>
        </div>
      </div>
    }>
      <ExplainerInner />
    </Suspense>
  );
}
