"use client"

export default function History({round,lastResult,history}:any){
    return (
        <aside className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 shadow">
          <div className="mb-4">
            <p className="text-xs text-slate-400">Round</p>
            <p className="font-semibold">#{round}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-slate-400">Last Result</p>
            <div className="flex items-center gap-3 mt-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${lastResult===null? 'bg-slate-700/40':'bg-amber-400 text-slate-900'}`}>{lastResult===null? '—': lastResult}</div>
              <div className="text-sm text-slate-300">Round #{round-1}</div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-slate-400">Payouts</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>Single number: <b>35:1</b></li>
              <li>Red/Black: <b>1:1</b></li>
              <li>Odd/Even: <b>1:1</b></li>
              <li>1-18 / 19-36: <b>1:1</b></li>
            </ul>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-2">History</p>
            <div className="space-y-2 max-h-56 overflow-auto pr-2">
              {history.length===0 && <div className="text-slate-500">No history yet</div>}
              {history.map((h:any)=> (
                <div key={h.round} className="flex items-center justify-between bg-slate-900/40 p-2 rounded">
                  <div className="text-sm">#{h.round}</div>
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center font-bold">{h.result}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
    )
}