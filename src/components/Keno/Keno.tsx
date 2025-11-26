"use clients";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import NumberGrid from "./NumberGrid";
import RoundTimer from "./RoundTimer";
import Controls from "./Controls";
import History from "./History";

export default function Keno() {
  const numbers = useMemo(
    () => Array.from({ length: 80 }, (_, i) => i + 1),
    []
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [history, setHistory] = useState<
    Array<{ round: number; result: number[] }>
  >([]);
  const [round, setRound] = useState(1);
  const [balance, setBalance] = useState(5000);
  const [betAmount, setBetAmount] = useState(20);
  const [timer, setTimer] = useState(25);
  const [isRunning, setIsRunning] = useState(true);

  // Auto round timer
  useEffect(() => {
    if (!isRunning) return;
    if (timer <= 0) {
      startDraw();
      return;
    }
    const t = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, isRunning]);

  const toggleNum = (n: number) => {
    if (selected.includes(n)) {
      setSelected(selected.filter((i) => i !== n));
      return;
    }
    if (selected.length >= 10) return alert("Max 10 spots allowed!");
    setSelected([...selected, n]);
  };

  const startDraw = () => {
    if (selected.length === 0) {
      alert("Select at least 1 number.");
      setTimer(25);
      return;
    }

    if (betAmount > balance) {
      alert("Insufficient balance");
      setTimer(25);
      return;
    }

    // Deduct bet
    setBalance((b) => b - betAmount);

    // Draw 20 numbers
    const pool = [...numbers];
    const draw: number[] = [];
    for (let i = 0; i < 20; i++) {
      const index = Math.floor(Math.random() * pool.length);
      draw.push(pool[index]);
      pool.splice(index, 1);
    }

    setDrawn(draw);

    // Count matches
    const matches = draw.filter((n) => selected.includes(n));

    // Simple payout example (can upgrade): match * 10
    const payout = matches.length * 10 * (betAmount / 10);
    if (payout > 0) setBalance((b) => b + payout);

    // Save history
    setHistory((h) => [{ round, result: draw }, ...h].slice(0, 10));

    // Prepare next round
    setRound((r) => r + 1);
    setSelected([]);
    setTimer(25);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-slate-100 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN PLAY AREA */}
        <div className="lg:col-span-2 bg-slate-800/60 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Keno Pro</h1>
              <p className="text-sm text-slate-300">
                Pick 1–10 numbers • Auto draw
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Balance</p>
              <p className="text-xl font-semibold">
                ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* ROUND + TIMER */}
          <RoundTimer
            timer={timer}
            round={round}
            setIsRunning={setIsRunning}
            isRunning={isRunning}
          />

          {/* NUMBER GRID */}
          <NumberGrid
            numbers={numbers}
            selected={selected}
            toggleNum={toggleNum}
            drawn={drawn}
          />

          {/* CONTROLS */}

          <Controls
            betAmount={betAmount}
            startDraw={startDraw}
            setBetAmount={setBetAmount}
          />
        </div>

        {/* SIDEBAR */}
        <History selected={selected} betAmount={betAmount} history={history} />
      </div>
    </div>
  );
}
