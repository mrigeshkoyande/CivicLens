"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { EXPLAINER_SUGGESTIONS, FALLBACK_RESPONSES } from "@/lib/mock-data";

type Language = "English" | "Hindi" | "Marathi";
interface Message { id: string; role: "user" | "assistant"; content: string; }

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-on-surface font-bold">$1</strong>')
    .replace(/\n/g, "<br/>");
}

function ExplainerInner() {
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome", role: "assistant",
    content: "Namaste! 🇮🇳 I'm **JanVote AI**, your personal civic guide. Ask me anything about India's elections — how voting works, your rights as a voter, or how the counting process works. I can explain in **English**, **Hindi**, and **Marathi**!",
  }]);
  const [input, setInput] = useState(() => searchParams.get("q") ?? "");
  const [language, setLanguage] = useState<Language>("English");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const sendMessage = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: q };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    setTimeout(scrollToBottom, 50);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, language }),
      });
      const data = await res.json();
      const answer = data.answer ?? FALLBACK_RESPONSES[q] ?? FALLBACK_RESPONSES["default"];
      setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: answer }]);
    } catch {
      const fallback = FALLBACK_RESPONSES[q] ?? FALLBACK_RESPONSES["default"];
      setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: fallback }]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const clearChat = () => {
    setMessages([{ id: "welcome", role: "assistant", content: "Chat cleared! Ask me anything about India's elections." }]);
    show("Chat cleared.", "info", "refresh");
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="p-6 border-b border-[#c6c8b7] bg-white shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface mb-0.5">AI Explainer</h1>
            <p className="text-sm text-on-surface-variant">Ask anything about India&apos;s elections. Powered by Gemini.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="flex bg-[#e8e8e8] rounded-full p-1 border border-[#c6c8b7]">
              {(["English", "Hindi", "Marathi"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); show(`Language set to ${lang}`, "info", "language"); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === lang ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button onClick={clearChat} className="p-2 text-on-surface-variant hover:text-primary hover:bg-[#f4f3f3] rounded-lg transition-colors" title="Clear chat">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f9f9f9]">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isUser ? "bg-primary text-on-primary" : "bg-[#72674b] text-[#f6e6c3]"}`}>
                <span className="material-symbols-outlined text-[16px]">{isUser ? "person" : "smart_toy"}</span>
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${isUser ? "bg-primary text-on-primary rounded-tr-sm" : "bg-white text-on-surface border border-[#e2e2e2] rounded-tl-sm shadow-sm"}`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[#72674b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#f6e6c3] text-[16px]">smart_toy</span>
            </div>
            <div className="bg-white border border-[#e2e2e2] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 shadow-sm">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#c6c8b7] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-6 py-3 bg-[#f9f9f9] border-t border-[#e2e2e2]">
          <p className="text-xs text-on-surface-variant font-semibold mb-2 uppercase tracking-wide">Suggested Questions</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(EXPLAINER_SUGGESTIONS[language] ?? EXPLAINER_SUGGESTIONS["English"]).map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 bg-white border border-[#c6c8b7] text-on-surface text-xs font-medium px-3 py-2 rounded-full hover:border-primary hover:text-primary active:scale-95 transition-all whitespace-nowrap shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-[#c6c8b7] shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              rows={2}
              className="w-full bg-[#f9f9f9] border border-[#c6c8b7] focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant outline-none resize-none transition-all"
              placeholder={`Ask in ${language}… (Enter to send, Shift+Enter for new line)`}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-on-primary p-3 rounded-xl hover:bg-surface-tint active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Send"
          >
            <span className="material-symbols-outlined text-[22px]">send</span>
          </button>
        </div>
        <p className="text-[10px] text-on-surface-variant mt-2 text-center">JanVote AI may make mistakes. Verify important information with official ECI sources.</p>
      </div>
    </div>
  );
}

export default function ExplainerPage() {
  return (
    <div className="h-full flex flex-col bg-[#f9f9f9]">
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[40px] animate-spin text-primary">progress_activity</span>
            <span className="text-sm">Loading AI Explainer…</span>
          </div>
        </div>
      }>
        <ExplainerInner />
      </Suspense>
    </div>
  );
}
