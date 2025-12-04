"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const games = [
  { name: "ROULETTE", image: "/roulette.webp", href: "/roulette-casino" },
  { name: "SLOT", image: "/slot.webp", href: "/slot-casino" },
  { name: "FATAFAT", image: "/fatafat.webp", href: "/fatafat-lottery" },
  { name: "KENO", image: "/keno.webp", href: "/keno-casino" },
  
  { name: "Tambola", image: "/games/tambola.png", href: "/tambola" },
];

export default function GameGrid() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <Link href={game.href} key={index}>
            <motion.div
              whileHover={{ y: -6, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 140 }}
              className="bg-white rounded-2xl p-4 shadow-[0_4px_18px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-gray-200 cursor-pointer transition-all ease-out duration-300"
            >
              <div className="w-full h-44 relative rounded-xl overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="flex justify-between items-center mt-5">
                <h3 className="text-gray-900 text-lg font-semibold tracking-tight">
                  {game.name}
                </h3>

                {/* Play Button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  className="px-4 py-1.5 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
                >
                  Play →
                </motion.button>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
