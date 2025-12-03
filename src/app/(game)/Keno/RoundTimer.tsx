"use client";
import { motion } from "framer-motion";
export default function RoundTimer({
  round,
  timer,
  setIsRunning,
  isRunning,
}: any) {
  return (
    <div className="bg-slate-900/40 p-4 rounded-xl flex justify-between items-center mb-6">
      <div>
        <p className="text-xs text-slate-400">Round</p>
        <p className="text-lg font-semibold">#{round}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-400">Time Left</p>
        <motion.p
          key={timer}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold"
        >
          {timer}s
        </motion.p>
      </div>
      <div>
        <button
          onClick={() => setIsRunning((r:any) => !r)}
          className="px-4 py-2 rounded-lg bg-indigo-600 shadow font-semibold"
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}
