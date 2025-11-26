"use client";

import { useEffect, useMemo, useState } from "react";
import TimerResult from "./TimerResult";
import NumberGrid from "./NumberGrid";
import PlaceBet from "./PlaceBet";
import BetSlip from "./BetSlip";
import History from "./History";

type Bet = {
  number: number;
  amount: number;
};

export default function FatafatLive() {
  const numbers = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [activeChip, setActiveChip] = useState<number>(50);
  const [balance, setBalance] = useState<number>(5000);
  const [timer, setTimer] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [history, setHistory] = useState<
    Array<{ round: number; result: number }>
  >([]);
  const [round, setRound] = useState<number>(1);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const totalBet = Object.values(selected).reduce((a, b) => a + b, 0);

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

  const quickMax = () =>
    setSelected((s) => {
      const next: Record<number, number> = {};
      numbers.forEach((n) => (next[n] = 100));
      return next;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 text-slate-100 flex items-start justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Game panel */}
        <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Fatafat — Live</h2>
              <p className="text-sm text-slate-300">
                Quick rounds · 0–9 market
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Balance</div>
              <div className="text-lg font-medium">
                ₹{balance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Timer and result banner */}
          <TimerResult round={round} timer={timer} lastResult={lastResult} />

          {/* Number grid */}
          <NumberGrid
            numbers={numbers}
            selected={selected}
            toggleNumber={toggleNumber}
          />

          {/* Controls: chips, place bet, clear */}
          <PlaceBet
            activeChip={activeChip}
            setActiveChip={setActiveChip}
            placeBet={placeBet}
            clearBets={clearBets}
            quickMax={quickMax}
          />

          {/* Bet slip (cart) */}
          <BetSlip selected={selected} setSelected={setSelected} />
        </div>

        {/* Right: Sidebar */}
        <History history={history} totalBet={totalBet} />
      </div>
    </div>
  );
}
