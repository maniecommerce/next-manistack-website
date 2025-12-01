"use client"

export default function BettingBord({placeOutsideBet,placeBetOnNumber,bets,setActiveChip,activeChip,totalBet,handleSpin,spinning,isRed}:any){
    return (
         <div className="col-span-2">
              <div className="bg-slate-900/30 p-3 rounded-lg mb-3">
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={()=>placeOutsideBet('color','red')} className="py-2 rounded-lg bg-gradient-to-br from-red-600 to-red-500">Red</button>
                  <button onClick={()=>placeOutsideBet('color','black')} className="py-2 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">Black</button>
                  <button onClick={()=>placeOutsideBet('parity','odd')} className="py-2 rounded-lg bg-slate-700/60">Odd</button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button onClick={()=>placeOutsideBet('parity','even')} className="py-2 rounded-lg bg-slate-700/60">Even</button>
                  <button onClick={()=>placeOutsideBet('range',1)} className="py-2 rounded-lg bg-slate-700/60">1-18</button>
                  <button onClick={()=>placeOutsideBet('range',2)} className="py-2 rounded-lg bg-slate-700/60">19-36</button>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-12 gap-2">
                {/* Render numbers 0 then 1..36 in 3 columns layout for quick pick */}
                <button onClick={()=>placeBetOnNumber(0)} className={`col-span-3 md:col-span-1 py-2 rounded-lg font-semibold ${bets.some((b:any)=>b.type==='number'&&b.value===0)? 'bg-indigo-500':'bg-slate-900/40'}`}>0</button>
                {Array.from({length:36},(_,i)=>i+1).map(n=> (
                  <button key={n} onClick={()=>placeBetOnNumber(n)} className={`py-2 rounded-lg font-semibold ${bets.some((b:any)=>b.type==='number'&&b.value===n)? 'bg-indigo-500':'bg-slate-900/40'} ${isRed(n)?'text-rose-300':''}`}>
                    {n}
                  </button>
                ))}
              </div>

              {/* Chips and Spin */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {[10,25,50,100,250].map(c=> (
                    <button key={c} onClick={()=>setActiveChip(c)} className={`px-3 py-2 rounded-full font-semibold ${activeChip===c? 'bg-amber-400 text-slate-900':'bg-slate-700/40'}`}>₹{c}</button>
                  ))}
                  <div className="text-sm text-slate-400 ml-2">Active: ₹{activeChip}</div>
                </div>

                
              </div>
              <div className="flex items-center gap-3">
                  <div className="text-sm">Total Bet: ₹{totalBet}</div>
                  <button onClick={handleSpin} disabled={spinning} className={`px-5 py-3 rounded-xl font-bold ${spinning? 'bg-slate-600':'bg-green-500 text-slate-900'}`}>{spinning? 'Spinning...' : 'SPIN'}</button>
                </div>

            </div>
    )
}