"use client";
import { motion } from "framer-motion";
import Link from "next/link";
export default function WritenLogo() {
  return (
    <>
      {/* Logo */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="
    font-extrabold text-2xl sm:text-3xl tracking-wider cursor-pointer
    bg-gradient-to-r from-[#0FFFE6] to-[#00C8FF]
    bg-clip-text text-transparent
    drop-shadow-[0_0_12px_#0FFFE6]
  "
      >
        <Link href="/">GAMIX</Link>
      </motion.div>
    </>
  );
}
