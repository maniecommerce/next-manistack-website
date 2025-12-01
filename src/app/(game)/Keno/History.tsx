"use client";
import { motion } from "framer-motion";

export default function History({ selected, betAmount, history }: {
  selected: number[],
  betAmount: number,
  history: Array<{ round: number; result: number[] }>
}) {
  return (
    <aside className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 shadow-xl">
      <h2 className="font-bold mb-3 text-lg">Bet Summary</h2>

      <div className="mb-4">
        <p className="text-xs text-slate-400">Selected Spots</p>
        <p className="font-semibold text-xl">{selected.length}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-400">Bet</p>
        <p className="font-semibold text-xl">₹{betAmount}</p>
      </div>

      <h2 className="font-bold mt-8 mb-2">History</h2>
      <div className="space-y-2 max-h-60 overflow-auto pr-2">
        {history.length === 0 && (
          <p className="text-slate-500 text-sm">No rounds yet</p>
        )}

        {history.map(h => (
          <div key={h.round} className="bg-slate-900/40 p-2 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400">Round #{h.round}</p>
            <div className="flex flex-wrap gap-1 mt-1 text-sm">
              {h.result.slice(0, 10).map(r => (
                <span key={r} className="px-2 py-1 bg-slate-700 rounded text-xs">
                  {r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
