"use client"

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Fatafat Pro UI - single-file React component
// Usage: Drop into a Next.js / Create React App project with Tailwind CSS + Framer Motion installed.
// - Tailwind is used for styling (no external CSS file required)
// - Framer Motion for subtle animations
// 
// Features:
// - Number grid (0–9) as selectable betting tiles
// - Bet chips and quick-amount buttonss
// - Bet slip (cart) showing selections + amounts
// - Timer / round control and result mock
// - Compact history list
// - Responsive, polished look suitable for production UI

type Bet = {
  number: number;
  amount: number;
};

export default function fatafat(): JSX.Element {
  const numbers = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [activeChip, setActiveChip] = useState<number>(50);
  const [balance, setBalance] = useState<number>(5000);
  const [timer, setTimer] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [history, setHistory] = useState<Array<{ round: number; result: number }>>([]);
  const [round, setRound] = useState<number>(1);
  const [lastResult, setLastResult] = useState<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    if (timer <= 0) {
      // Resolve round
      const result = Math.floor(Math.random() * 10);
      setLastResult(result);
      setHistory((h) => [{ round, result }, ...h].slice(0, 8));
      // Calculate wins (simple example: number match pays 9x)
      const winAmount = (selected[result] || 0) * 9;
      if (winAmount > 0) setBalance((b) => b + winAmount);
      // Clear selections
      setSelected({});
      setRound((r) => r + 1);
      setTimer(30);
      return;
    }
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer, isRunning, selected, round]);

  const toggleNumber = (n: number) => {
    setSelected((s) => {
      const next = { ...s };
      if (next[n]) delete next[n];
      else next[n] = activeChip;
      return next;
    });
  };

  const placeBet = () => {
    const total = Object.values(selected).reduce((a, b) => a + b, 0);
    if (total <= 0) return;
    if (total > balance) {
      alert("Insufficient balance");
      return;
    }
    setBalance((b) => b - total);
    // keep bets until round resolves (we already store them in `selected`)
  };

  const clearBets = () => setSelected({});

  const quickMax = () => setSelected((s) => {
    const next: Record<number, number> = {};
    numbers.forEach((n) => (next[n] = 100));
    return next;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-slate-100 flex items-start justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Game panel */}
        <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Fatafat — Live</h2>
              <p className="text-sm text-slate-300">Quick rounds · 0–9 market</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Balance</div>
              <div className="text-lg font-medium">₹{balance.toLocaleString()}</div>
            </div>
          </div>

          {/* Timer and result banner */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 bg-slate-900/40 p-3 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Round</div>
                <div className="font-semibold">#{round}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-slate-400">Time left</div>
                <div className="text-2xl font-bold">
                  <motion.span key={timer} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    {timer}s
                  </motion.span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Last Result</div>
                <div className="flex items-center gap-2 justify-end">
                  <AnimatePresence>
                    {lastResult !== null ? (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold shadow"
                      >
                        {lastResult}
                      </motion.div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">—</div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            
          </div>
          <div className="flex gap-2 mb-4 justify-evenly">
              <button
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-semibold shadow hover:brightness-105"
                onClick={() => setIsRunning((r) => !r)}
              >
                {isRunning ? "Pause" : "Resume"}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-slate-700/60 border border-slate-600 hover:border-slate-500"
                onClick={() => {
                  // force resolve for demo
                  setTimer(0);
                }}
              >
                Resolve
              </button>
            </div>

          {/* Number grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {numbers.map((n) => {
              const amt = selected[n] || 0;
              const isSelected = !!amt;
              return (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={n}
                  onClick={() => toggleNumber(n)}
                  className={`relative rounded-xl p-3 flex flex-col items-center justify-center border transition-shadow shadow-sm hover:shadow-md focus:outline-none
                    ${isSelected ? "bg-gradient-to-tr from-indigo-500 to-violet-500 border-transparent" : "bg-slate-900/40 border-slate-700"}`}
                >
                  <div className="text-lg font-bold">{n}</div>
                  <div className="text-xs text-slate-200/80 mt-1">{isSelected ? `₹${amt}` : "bet"}</div>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 text-xs bg-amber-400 text-slate-900 rounded-full px-2 py-0.5 font-semibold shadow">BET</div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Controls: chips, place bet, clear */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {[10, 25, 50, 100, 250].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveChip(c)}
                  className={`px-3 py-2 rounded-lg border font-medium shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400
                    ${activeChip === c ? "bg-amber-400 text-slate-900 border-transparent" : "bg-slate-900/30 border-slate-700 text-slate-100"}`}
                >
                  ₹{c}
                </button>
              ))}

              <div className="ml-2 text-sm text-slate-400">Active: ₹{activeChip}</div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-indigo-600 font-semibold" onClick={placeBet}>
                Place Bet
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-700/60" onClick={clearBets}>
                Clear
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-700/60" onClick={quickMax}>
                Quick Max
              </button>
            </div>
          </div>

          {/* Bet slip (cart) */}
          <div className="mt-6 bg-slate-900/30 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Bet Slip</h3>
              <div className="text-xs text-slate-400">Selections: {Object.keys(selected).length}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(selected).length === 0 ? (
                <div className="text-slate-400 col-span-full">No bets selected. Tap numbers to add bets.</div>
              ) : (
                Object.entries(selected).map(([num, amt]) => (
                  <div key={num} className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center font-bold">{num}</div>
                      <div>
                        <div className="text-sm font-medium">Number {num}</div>
                        <div className="text-xs text-slate-400">₹{amt}</div>
                      </div>
                    </div>
                    <div>
                      <button
                        className="text-xs px-2 py-1 rounded bg-slate-700/50"
                        onClick={() => setSelected((s) => {
                          const next = { ...s };
                          delete next[Number(num)];
                          return next;
                        })}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-700">
          <div className="mb-4">
            <div className="text-xs text-slate-400">Your Bets</div>
            <div className="text-xl font-semibold">₹{Object.values(selected).reduce((a, b) => a + b, 0)}</div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-400">Payout (example)</div>
            <div className="text-lg font-semibold">1 : 9</div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-400">Quick Actions</div>
            <div className="flex flex-col gap-2 mt-2">
              <button className="py-2 rounded-lg bg-violet-600 font-semibold">Auto Repeat</button>
              <button className="py-2 rounded-lg bg-slate-700/60">Save Slip</button>
              <button className="py-2 rounded-lg bg-slate-700/60">Bet Rules</button>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-2">History</div>
            <div className="space-y-2 max-h-60 overflow-auto pr-2">
              {history.length === 0 ? (
                <div className="text-slate-500 text-sm">No rounds yet</div>
              ) : (
                history.map((h) => (
                  <div key={h.round} className="flex items-center justify-between bg-slate-900/30 p-2 rounded">
                    <div className="text-sm">#{h.round}</div>
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold">{h.result}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">Tip: Click numbers, choose a chip, then 'Place Bet' before the timer ends.</div>
        </aside>
      </div>
    </div>
  );
}
