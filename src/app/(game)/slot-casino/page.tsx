"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// ----------------------
// Types
// ----------------------

type SymbolType = "🍒" | "🍋" | "🍊" | "🔔" | "⭐" | "🍉" | "7️⃣";

type ReelColumn = SymbolType[];
type Reels = ReelColumn[];

type Paytable = Record<SymbolType, Record<number, number>>;

// ----------------------

const SYMBOLS: SymbolType[] = ["🍒", "🍋", "🍊", "🔔", "⭐", "🍉", "7️⃣"];

function randSymbol(): SymbolType {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function VideoSlots() {
  const reelsCount = 5;
  const rows = 3;

  const [balance, setBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number>(10);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [reels, setReels] = useState<Reels>(() =>
    Array.from({ length: reelsCount }, () =>
      Array.from({ length: rows }, randSymbol)
    )
  );
  const [lastWin, setLastWin] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  const paytable: Paytable = useMemo(
    () => ({
      "7️⃣": { 3: 50, 4: 200, 5: 1000 },
      "⭐": { 3: 20, 4: 100, 5: 400 },
      "🔔": { 3: 10, 4: 50, 5: 200 },
      "🍉": { 3: 8, 4: 30, 5: 150 },
      "🍊": { 3: 5, 4: 20, 5: 80 },
      "🍋": { 3: 4, 4: 15, 5: 60 },
      "🍒": { 3: 2, 4: 8, 5: 40 },
    }),
    []
  );

  useEffect(() => {
    if (autoplay && !spinning) {
      const t = setTimeout(handleSpin, 1200);
      return () => clearTimeout(t);
    }
  }, [autoplay, spinning]);

  function handleSpin(): void {
    if (spinning) return;
    if (bet > balance) {
      alert("Insufficient balance");
      return;
    }

    setSpinning(true);
    setBalance((b) => b - bet);
    setLastWin(0);

    const results: Reels = Array.from({ length: reelsCount }, () =>
      Array.from({ length: rows }, randSymbol)
    );

    for (let r = 0; r < reelsCount; r++) {
      setTimeout(() => {
        setReels((prev) => {
          const next = [...prev];
          next[r] = results[r];
          return next;
        });

        if (r === reelsCount - 1) {
          setTimeout(() => {
            const win = evaluate(results, bet, paytable);
            if (win > 0) setBalance((b) => b + win);
            setLastWin(win);
            setSpinning(false);
          }, 400);
        }
      }, 400 + r * 350);
    }
  }

  function evaluate(
    results: Reels,
    betAmount: number,
    paytable: Paytable
  ): number {
    const center: SymbolType[] = results.map((col) => col[1]);

    let symbol: SymbolType = center[0];
    let count = 1;

    for (let i = 1; i < center.length; i++) {
      if (center[i] === symbol) count++;
      else break;
    }

    if (count >= 3) {
      const mult = paytable[symbol][count] ?? 0;
      return mult * (betAmount / 10);
    }

    return 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-6 text-white flex items-start justify-center">
      <div className="w-full max-w-4xl bg-slate-800/60 rounded-2xl p-6 shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Video Slots — 5-Reel</h2>

        {/* Reels */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {reels.map((col, ci) => (
            <div key={ci} className="bg-slate-900/40 rounded-lg p-2 flex flex-col gap-2 items-center justify-center h-48">
              {col.map((s, i) => (
                <motion.div key={i} className="text-2xl">
                  {s}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="px-6 py-3 bg-green-500 rounded-xl font-bold"
        >
          {spinning ? "Spinning..." : "SPIN"}
        </button>

        <div className="mt-2">Balance: ₹{balance}</div>
        <div>Last Win: ₹{lastWin}</div>
      </div>
    </div>
  );
          }
