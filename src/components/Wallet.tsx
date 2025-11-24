"use client";

import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function GamingWallet() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="
        relative w-full max-w-[260px] mx-auto
        bg-black/30 backdrop-blur-xl 
        rounded-xl p-1
        border border-[#18FFE6]/30
        shadow-[0_0_14px_#0FFFE6]
      "
    >
      {/* Glow Border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0FFFE6]/20 to-[#00A3FF]/20 blur-lg opacity-50 -z-10"></div>

      <div className="flex items-center justify-between">
        
        {/* Left Icon + Title */}
        <div className="flex items-center gap-2">
          <Wallet
            className="
              size-7 p-1 rounded-lg
              bg-gradient-to-br from-[#0FFFE6] to-[#00C8FF]
              text-black
              shadow-[0_0_12px_#0FFFE6]
            "
          />
          <div>
            <p className="text-[11px] text-gray-300">Balance</p>
            <h2 className="text-lg font-bold text-[#0FFFE6] drop-shadow-[0_0_6px_#0FFFE6] leading-none">
              ₹12,500
            </h2>
          </div>
        </div>

        {/* Add Money Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="
            px-3 py-1 rounded-lg
            bg-gradient-to-r from-[#0FFFE6] to-[#00C8FF]
            text-black font-semibold text-sm
            shadow-[0_0_8px_#0FFFE6]
            hover:shadow-[0_0_12px_#0FFFE6]
            transition-all duration-200
          "
        >
          + Add
        </motion.button>
      </div>
    </motion.div>
  );
}
