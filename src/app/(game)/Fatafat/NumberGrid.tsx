"use client";
import { motion } from "framer-motion";
export default function NumberGrid({ numbers, selected, toggleNumber }: any) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
      {numbers.map((n: any) => {
        const amt = selected[n] || 0;
        const isSelected = !!amt;
        return (
          <motion.button
            whileTap={{ scale: 0.98 }}
            key={n}
            onClick={() => toggleNumber(n)}
            className={`relative rounded-xl p-3 flex flex-col items-center justify-center border transition-shadow shadow-sm hover:shadow-md focus:outline-none
                    ${
                      isSelected
                        ? "bg-gradient-to-tr from-indigo-500 to-violet-500 border-transparent"
                        : "bg-slate-900/40 border-slate-700"
                    }`}
          >
            <div className="text-lg font-bold">{n}</div>
            <div className="text-xs text-slate-200/80 mt-1">
              {isSelected ? `₹${amt}` : "Bet"}
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 text-xs bg-amber-400 text-slate-900 rounded-full px-2 py-0.5 font-semibold shadow">
                BET
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
