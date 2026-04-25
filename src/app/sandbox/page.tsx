"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { Topbar } from "@/components/layout/topbar";

interface Tradeoff {
  sectorAffected: string;
  impact: string;
  severity: "High" | "Medium" | "Low";
}

interface AnalysisResult {
  tradeoffs: Tradeoff[];
  economicAnalysis: string;
  feasibilityScore: number;
}

export default function SandboxPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Initial slider states (Percentage change from base budget)
  const [sliders, setSliders] = useState({
    Education: 0,
    Healthcare: 0,
    Defense: 0,
    Infrastructure: 0,
    Subsidies: 0,
  });

  const handleSliderChange = (sector: keyof typeof sliders, value: number) => {
    setSliders(prev => ({ ...prev, [sector]: value }));
  };

  const runSimulation = async () => {
    // Check if any slider was moved
    if (Object.values(sliders).every(v => v === 0)) {
      show("Adjust at least one slider to simulate tradeoffs.", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sliders }),
      });

      if (!res.ok) throw new Error("Failed to fetch simulation");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
      show("Simulation complete! Review your tradeoffs.", "success", "analytics");
    } catch (err: any) {
      console.error(err);
      show(err.message || "Failed to run simulation. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-error-container text-error border-error/20";
      case "Medium": return "bg-[#fff3e0] text-[#fc9842] border-[#fc9842]/20";
      case "Low": return "bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]/20";
      default: return "bg-[#f4f3f3] text-on-surface";
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-[#faf9f6]">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">science</span>
            Policy Simulator
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Manifesto Sandbox</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Political promises are easy. Paying for them is hard. Adjust national budget allocations and let AI simulate the real-world economic tradeoffs.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#d4c5a3] shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Budget Adjustments
              </h2>
              
              <div className="space-y-6">
                {(Object.keys(sliders) as Array<keyof typeof sliders>).map((sector) => (
                  <div key={sector}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-on-surface">{sector}</label>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        sliders[sector] > 0 ? 'bg-[#e8f5e9] text-[#2e7d32]' : 
                        sliders[sector] < 0 ? 'bg-error-container text-error' : 'bg-[#f4f3f3] text-on-surface-variant'
                      }`}>
                        {sliders[sector] > 0 ? '+' : ''}{sliders[sector]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="5"
                      value={sliders[sector]}
                      onChange={(e) => handleSliderChange(sector, parseInt(e.target.value))}
                      className="w-full accent-primary h-2 bg-[#e2e2e2] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-medium">
                      <span>Cut (-50%)</span>
                      <span>Increase (+50%)</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={runSimulation}
                disabled={loading}
                className="w-full mt-8 bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:bg-[#536522] active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Simulating Economy...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">calculate</span>
                    Run Economic Simulation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-[#c6c8b7] rounded-2xl flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-16 h-16 bg-[#f4f3f3] rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[32px] text-[#76786a]">query_stats</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-on-surface-variant max-w-[250px]">
                    Adjust the sliders and run the simulation to see how your policies impact the national economy.
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border border-[#d4c5a3] bg-white rounded-2xl flex flex-col items-center justify-center p-8 shadow-sm"
                >
                  <div className="w-16 h-16 border-4 border-[#e2e2e2] border-t-primary rounded-full animate-spin mb-6" />
                  <h3 className="text-lg font-bold text-on-surface mb-2 animate-pulse">Running Macro-Models</h3>
                  <p className="text-sm text-on-surface-variant text-center max-w-[280px]">
                    Gemini AI is analyzing real-world economic constraints to calculate the true cost of your promises...
                  </p>
                </motion.div>
              ) : result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="h-full border border-[#d4c5a3] bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(68,86,20,0.06)]"
                >
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-[#f4f3f3]">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">account_balance</span>
                        Economic Impact Report
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">AI-generated macroeconomic forecast</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Feasibility</span>
                      <div className={`text-2xl font-black ${
                        result.feasibilityScore >= 70 ? 'text-[#2e7d32]' : 
                        result.feasibilityScore >= 40 ? 'text-[#fc9842]' : 'text-error'
                      }`}>
                        {result.feasibilityScore}/100
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3 text-primary">Analysis</h4>
                    <p className="text-sm text-on-surface leading-relaxed p-4 bg-[#f4f3f3] rounded-xl border border-[#e2e2e2]">
                      {result.economicAnalysis}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-4 text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                      The Tradeoffs
                    </h4>
                    <div className="space-y-3">
                      {result.tradeoffs.map((tradeoff, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${getSeverityColor(tradeoff.severity)}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm">{tradeoff.sectorAffected}</span>
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-80">{tradeoff.severity} Impact</span>
                          </div>
                          <p className="text-xs mt-1 font-medium opacity-90">{tradeoff.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
