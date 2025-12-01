"use client";

export default function PlaceBet({
  activeChip,
  setActiveChip,
  placeBet,
  clearBets,
  quickMax,
}: any) {
  return (
    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
      <div className="flex items-center gap-3 flex-wrap">
        {[10, 25, 50, 100, 250].map((c) => (
          <button
            key={c}
            onClick={() => setActiveChip(c)}
            className={`px-3 py-2 rounded-lg border font-medium shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400
                    ${
                      activeChip === c
                        ? "bg-amber-400 text-slate-900 border-transparent"
                        : "bg-slate-900/30 border-slate-700 text-slate-100"
                    }`}
          >
            ₹{c}
          </button>
        ))}

        <div className="ml-2 text-sm text-slate-400">Active: ₹{activeChip}</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 font-semibold"
          onClick={placeBet}
        >
          Place Bet
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-slate-700/60"
          onClick={clearBets}
        >
          Clear
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-slate-700/60"
          onClick={quickMax}
        >
          Quick Max
        </button>
      </div>
    </div>
  );
}
