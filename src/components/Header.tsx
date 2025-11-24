"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NavDrawer from "@/components/header/NavDrawer"

export default function ProHeader() {

  const cart_link = [
  { name: "Home", href: "#" },
  { name: "Games", href: "#" },
  { name: "Leaderboard", href: "#" },
  { name: "Support", href: "#" },
  { name: "Shop", href: "#" },
];










  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-[#0a0a1a] to-[#111122] backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <NavDrawer/>
        
      {/* Logo */}
<motion.div
  initial={{ x: -80, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{
    duration: 0.25,     // fast animation
    ease: "easeOut",
  }}
  className="text-teal-400 font-extrabold text-2xl sm:text-3xl tracking-wider cursor-pointer"
>
  <Link href="/">GAMIX</Link>
</motion.div>


        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-200 uppercase tracking-wider">
         

    
          {cart_link.map((shopLink) => (
            <div key={shopLink.name} className="text-white ">
              <Link href={shopLink.href} className="flex hover:text-teal-400 transition-colors duration-300">
                {shopLink.name}
              </Link>
            </div>
          ))}
       
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/sign-in"
            className="px-4 py-2 rounded-lg border border-teal-400 text-teal-400 font-medium hover:bg-teal-400 hover:text-[#0b0b12] transition-colors duration-300"
          >
            Sign In
          </Link>
         
        </div>

      </div>
    </header>
  );
}
