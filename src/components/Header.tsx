"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NavDrawer from "@/components/header/NavDrawer";
import Wallet from "@/components/Wallet";
import WritenLogo from "./WritenLogo";

export default function ProHeader() {
  const cart_link = [
    { name: "Home", href: "#" },
    { name: "Games", href: "#" },
    { name: "Leaderboard", href: "#" },
    { name: "Support", href: "#" },
    { name: "Shop", href: "#" },
  ];

  return (
    <header
      className="
    w-full  top-0 left-0 z-50
    bg-[#05070b]                   /* Pure gaming dark */
    shadow-[0_0_18px_#0FFFE6]/20   /* Soft neon glow */
    border-b border-[#0FFFE6]/20   /* Futuristic bottom line */
  "
    >
      <div className="max-w-7xl mx-auto  py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            {" "}
            <NavDrawer />
          </div>

          <div className="px-1">
            {/* Logo */}
            <WritenLogo />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-200 uppercase tracking-wider">
          {cart_link.map((shopLink) => (
            <div key={shopLink.name} className="text-white ">
              <Link
                href={shopLink.href}
                className="flex hover:text-teal-400 transition-colors duration-300"
              >
                {shopLink.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Wallet />
        </div>
      </div>
    </header>
  );
}
