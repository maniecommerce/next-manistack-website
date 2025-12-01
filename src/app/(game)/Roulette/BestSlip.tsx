"use client"

export default function History({bets,removeBet,totalBet,clearBets,handleSpin,spinning}:any){
    return (
          <div className="mt-4 bg-slate-900/30 p-3 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Bet Slip</h3>
              <div className="text-sm text-slate-400">Bets: {bets.length}</div>
            </div>
            <div className="space-y-2">
              {bets.length===0 && <div className="text-slate-500">No bets placed.</div>}
              {bets.map((b:any)=> (
                <div key={b.id} className="flex items-center justify-between bg-slate-800/40 p-2 rounded">
                  <div>
                    <div className="text-sm font-medium">{b.type==='number'? `Number ${b.value}` : (b.type==='color'? `${b.value}`: b.type==='parity'? `${b.value}` : b.value==='1'? '1-18':'19-36')}</div>
                    <div className="text-xs text-slate-400">Stake: ₹{b.amount}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>removeBet(b.id)} className="px-2 py-1 rounded bg-slate-700/60 text-sm">Remove</button>
                  </div>
                </div>
              ))}

              {bets.length>0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">Total: ₹{totalBet}</div>
                  <div className="flex gap-2">
                    <button onClick={clearBets} className="px-3 py-1 rounded bg-slate-700/60">Clear</button>
                    <button onClick={handleSpin} disabled={spinning || totalBet===0} className="px-3 py-1 rounded bg-green-500">Spin Now</button>
                  </div>
                </div>
              )}
            </div>
          </div>
    )
}