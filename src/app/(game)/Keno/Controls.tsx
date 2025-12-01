"use client"
import { motion } from "framer-motion";
export default function Controls({betAmount,setBetAmount,startDraw}:any){
    return (
           <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
            <div className="flex items-center gap-3 flex-wrap">
              {[10, 20, 50, 100, 200].map(a => (
                <button
                  key={a}
                className={`px-3 py-2 rounded-lg border font-medium shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400
                    ${betAmount === a ? "bg-amber-400 text-slate-900 border-transparent" : "bg-slate-900/30 border-slate-700 text-slate-100"}`}
                  onClick={() => setBetAmount(a)}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <button onClick={startDraw} className="px-6 py-3 rounded-xl bg-green-500 text-slate-900 font-bold">
              PLAY
            </button>
          </div>
    )
}