"use client";

export default function BetSlip({ selected, setSelected }: any) {
  return (
    <div className="mt-6 bg-slate-900/30 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Bet Slip</h3>
        <div className="text-xs text-slate-400">
          Selections: {Object.keys(selected).length}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(selected).length === 0 ? (
          <div className="text-slate-400 col-span-full">
            No bets selected. Tap numbers to add bets.
          </div>
        ) : (
          Object.entries(selected).map(([num, amt]: any) => (
            <div
              key={num}
              className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg border border-slate-700"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center font-bold">
                  {num}
                </div>
                <div>
                  <div className="text-sm font-medium">Number {num}</div>
                  <div className="text-xs text-slate-400">₹{amt}</div>
                </div>
              </div>
              <div>
                <button
                  className="text-xs  py-1 rounded bg-slate-700/50"
                  onClick={() =>
                    setSelected((s: any) => {
                      const next = { ...s };
                      delete next[Number(num)];
                      return next;
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
