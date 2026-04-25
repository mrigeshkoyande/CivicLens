"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";

type Tab = "login" | "register";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, loading } = useAuth();
  const { show } = useToast();
  const [tab, setTab]         = useState<Tab>("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [showPass, setShowP]  = useState(false);
  const [busy, setBusy]       = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await loginWithGoogle();
      show("Welcome back! Signed in with Google.", "success", "account_circle");
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google sign-in failed";
      show(msg.includes("popup-closed") ? "Sign-in cancelled." : msg, "error");
    } finally { setBusy(false); }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { show("Fill in all fields.", "error", "edit"); return; }
    if (password.length < 6)  { show("Password must be at least 6 characters.", "error"); return; }
    setBusy(true);
    try {
      if (tab === "login") {
        await loginWithEmail(email, password);
        show("Welcome back!", "success", "account_circle");
      } else {
        if (!name.trim()) { show("Please enter your name.", "error"); setBusy(false); return; }
        await registerWithEmail(name.trim(), email, password);
        show("Account created! Welcome to CivicLens 🇮🇳", "success", "celebration");
      }
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      show(
        msg.includes("user-not-found") ? "No account found with this email."
        : msg.includes("wrong-password") ? "Incorrect password."
        : msg.includes("email-already-in-use") ? "Email already registered — try logging in."
        : msg.includes("invalid-credential") ? "Invalid credentials. Check email and password."
        : msg,
        "error"
      );
    } finally { setBusy(false); }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-[#daf19e]/40 to-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-on-surface-variant hover:text-on-surface hover:bg-[#f4f3f3] rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[22px]">how_to_vote</span>
            </div>
            <span className="text-xl font-black text-primary tracking-tight">CivicLens</span>
          </div>
          <h2 id="modal-title" className="text-2xl font-bold text-on-surface mt-3">
            {tab === "login" ? "Welcome back!" : "Join CivicLens"}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {tab === "login" ? "Sign in to access your civic dashboard." : "Create your account and start your civic journey."}
          </p>
        </div>

        <div className="px-8 pb-8 pt-2">
          {/* Tab toggle */}
          <div className="flex bg-[#f4f3f3] rounded-xl p-1 mb-6">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={busy || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-[#e2e2e2] py-3 rounded-xl hover:border-primary hover:bg-[#f9f9f9] transition-all font-semibold text-sm active:scale-[0.98] disabled:opacity-60 mb-5"
          >
            {/* Google logo */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#e2e2e2]" />
            <span className="text-xs text-on-surface-variant font-semibold">or with email</span>
            <div className="flex-1 h-px bg-[#e2e2e2]" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            {tab === "register" && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#76786a]">person</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e2e2] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all"
                />
              </div>
            )}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#76786a]">email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e2e2] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#76786a]">lock</span>
              <input
                value={password}
                onChange={(e) => setPass(e.target.value)}
                type={showPass ? "text" : "password"}
                placeholder="Password (min. 6 characters)"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#e2e2e2] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowP(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76786a] hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">{showPass ? "visibility_off" : "visibility"}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={busy || loading}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:bg-[#536522] active:scale-[0.98] transition-all mt-1 flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
            >
              {busy ? (
                <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Please wait…</>
              ) : tab === "login" ? (
                <><span className="material-symbols-outlined text-[18px]">login</span> Sign In</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">person_add</span> Create Account</>
              )}
            </button>
          </form>

          {tab === "login" && (
            <p className="text-center text-xs text-on-surface-variant mt-4">
              Don&apos;t have an account?{" "}
              <button onClick={() => setTab("register")} className="text-primary font-bold hover:underline">
                Register free
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
