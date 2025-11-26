"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function TimerResult({ round, timer, lastResult }: any) {
  return (
    <div className=" items-center gap-4 mb-6">
      <div className="flex-1 bg-slate-900/40 p-3 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400">Round</div>
          <div className="font-semibold">#{round}</div>
        </div>

        <div className="text-center">
          <div className="text-xs text-slate-400">Time left</div>
          <div className="text-2xl font-bold">
            <motion.span
              key={timer}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {timer}s
            </motion.span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Last Result</div>
          <div className="flex items-center gap-2 justify-end">
            <AnimatePresence>
              {lastResult !== null ? (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold shadow"
                >
                  {lastResult}
                </motion.div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">
                  —
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
