"use client"

export default function History({history, totalBet}:any){
    return (
        <aside className="bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-700">
          <div className="mb-4">
            <div className="text-xs text-slate-400">Your Bets</div>
            <div className="text-xl font-semibold">₹{totalBet}</div>
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
                history.map((h:any) => (
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
    )
}