"use client";

import { useState, useEffect, useCallback } from "react";

export interface AccessibilityState {
  largeText: boolean;
  voiceOutput: boolean;
  simplifiedUI: boolean;
  highContrast: boolean;
  toggleLargeText: () => void;
  toggleVoiceOutput: () => void;
  toggleSimplifiedUI: () => void;
  toggleHighContrast: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const STORAGE_KEY = "janvote_accessibility";

export function useAccessibility(): AccessibilityState {
  function loadPref<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored)[key] ?? fallback) : fallback;
    } catch { return fallback; }
  }

  const [largeText, setLargeText] = useState<boolean>(() => loadPref("largeText", false));
  const [voiceOutput, setVoiceOutput] = useState<boolean>(() => loadPref("voiceOutput", false));
  const [simplifiedUI, setSimplifiedUI] = useState<boolean>(() => loadPref("simplifiedUI", false));
  const [highContrast, setHighContrast] = useState<boolean>(() => loadPref("highContrast", false));

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ largeText, voiceOutput, simplifiedUI, highContrast }));
    } catch { /* ignore */ }
  }, [largeText, voiceOutput, simplifiedUI, highContrast]);

  // Apply large text class to document
  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add("a11y-large");
    } else {
      document.documentElement.classList.remove("a11y-large");
    }
  }, [largeText]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.style.setProperty("--color-text-secondary", "#ffffff");
      document.documentElement.style.setProperty("--color-text-muted", "#d4d4d8");
    } else {
      document.documentElement.style.removeProperty("--color-text-secondary");
      document.documentElement.style.removeProperty("--color-text-muted");
    }
  }, [highContrast]);

  const speak = useCallback((text: string) => {
    if (!voiceOutput || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }, [voiceOutput]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    largeText,
    voiceOutput,
    simplifiedUI,
    highContrast,
    toggleLargeText: () => setLargeText(p => !p),
    toggleVoiceOutput: () => setVoiceOutput(p => !p),
    toggleSimplifiedUI: () => setSimplifiedUI(p => !p),
    toggleHighContrast: () => setHighContrast(p => !p),
    speak,
    stopSpeaking,
  };
}
