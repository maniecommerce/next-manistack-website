"use client";
import { motion } from "framer-motion";

export default function NumberGrid({ numbers, selected, toggleNum, drawn }: any) {
  return (
    <div className="grid grid-cols-10 gap-2">
      {numbers.map((n: number) => {
        const active = selected.includes(n);
        const hit = drawn.includes(n);

        return (
          <motion.button
            whileTap={{ scale: 0.92 }}
            key={n}
            onClick={() => toggleNum(n)}
            className={`w-full aspect-square rounded-lg text-sm font-semibold border transition-all
              ${active ? "bg-indigo-500 border-transparent" : "bg-slate-900/40 border-slate-700"}
              ${hit ? "!bg-green-500 !text-slate-900" : ""}
            `}
          >
            {n}
          </motion.button>
        );
      })}
    </div>
  );
}
