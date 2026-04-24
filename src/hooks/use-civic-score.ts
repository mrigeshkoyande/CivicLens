"use client";

import { useState, useEffect, useCallback } from "react";

export interface CivicScoreState {
  score: number;
  history: Array<{ action: string; points: number; timestamp: string }>;
  addPoints: (action: string, points: number) => void;
  level: string;
  percentile: string;
}

const SCORE_LEVELS = [
  { min: 900, level: "Elite Voter", percentile: "Top 5% nationally" },
  { min: 750, level: "Civic Champion", percentile: "Top 15% locally" },
  { min: 500, level: "Active Citizen", percentile: "Top 40% in your district" },
  { min: 250, level: "Emerging Voter", percentile: "Getting started!" },
  { min: 0,   level: "New Member",    percentile: "Just joined CivicLens" },
];

function getLevel(score: number) {
  return SCORE_LEVELS.find(l => score >= l.min) ?? SCORE_LEVELS[SCORE_LEVELS.length - 1];
}

const STORAGE_KEY = "janvote_civic_score";

export function useCivicScore(): CivicScoreState {
  const [score, setScore] = useState<number>(() => {
    if (typeof window === "undefined") return 850;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored).score ?? 850) : 850;
    } catch { return 850; }
  });
  const [history, setHistory] = useState<CivicScoreState["history"]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored).history ?? []) : [];
    } catch { return []; }
  });

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score, history }));
    } catch {
      // ignore quota errors
    }
  }, [score, history]);

  const addPoints = useCallback((action: string, points: number) => {
    setScore(prev => Math.min(1000, prev + points));
    setHistory(prev => [
      { action, points, timestamp: new Date().toISOString() },
      ...prev.slice(0, 49), // Keep last 50
    ]);
  }, []);

  const levelInfo = getLevel(score);

  return {
    score,
    history,
    addPoints,
    level: levelInfo.level,
    percentile: levelInfo.percentile,
  };
}

// ─── Point values for different actions ──────────────────────────────────────
export const CIVIC_ACTIONS = {
  COMPLETED_ONBOARDING:  { points: 100, label: "Completed onboarding" },
  FOUND_BOOTH:           { points: 50,  label: "Found polling booth" },
  FACT_CHECKED_CLAIM:    { points: 30,  label: "Fact-checked a claim" },
  COMPARED_CANDIDATES:   { points: 40,  label: "Compared candidates" },
  USED_AI_EXPLAINER:     { points: 20,  label: "Used AI Explainer" },
  ENABLED_REMINDERS:     { points: 25,  label: "Enabled election reminders" },
  SHARED_BOOTH:          { points: 15,  label: "Shared booth location" },
  DAILY_VISIT:           { points: 10,  label: "Daily visit" },
} as const;
