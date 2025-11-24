"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { X } from "lucide-react";


import { Menu } from "lucide-react";
import { GrHomeRounded } from "react-icons/gr";
import Link from "next/link";
import { MdSupervisorAccount } from "react-icons/md";

const Home_link = [
  { name: "Fatafat", href: "/fatafat" },
  { name: "Keno", href: "/keno" },
  { name: "Lottery", href: "/lottery" },
];
const Categories_link = [
  { name: "Ludo", href: "ludo" },
  { name: "Computers", href: "#" },
  { name: "Books", href: "#" },
  { name: "E-commerce Fashion", href: "#" },
  { name: "Sell All Categories", href: "#" },
];
const Features_link = [
  { name: "Today's Deals", href: "#" },
  { name: "E-commerce Pay", href: "#" },
  { name: "E-commerce Launchpad", href: "#" },
  { name: "Handloom and Handicrafts", href: "#" },
  { name: "E-commerce Saheli", href: "#" },
  { name: "E-commerce Custom", href: "#" },
  { name: "Try Prime", href: "#" },
  { name: "Buy more, Save more", href: "#" },
  { name: "Sell on Amazon", href: "#" },
  { name: "International Brands", href: "#" },
];

export default function NavDrawer() {
  return (
    <nav>
      <Sheet>
        {/* 🔥 Gaming Trigger Button */}
        <SheetTrigger
          className="
            flex items-center group 
            text-transparent bg-clip-text 
            bg-gradient-to-r from-[#0FFFE6] to-[#00C8FF]
            drop-shadow-[0_0_12px_#0FFFE6]
            transition-all duration-200
          "
        >
          <Menu
            className="
              size-9 w-7 ml-2
              text-[#0FFFE6]
              drop-shadow-[0_0_14px_#0FFFE6]
              group-hover:scale-125
              transition-all duration-200
            "
          />
        </SheetTrigger>

        {/* 🔥 Drawer Content */}
        <SheetContent
          className="
            overflow-x-hidden
            bg-[#030B0F]/95 
            backdrop-blur-xl 
            border-l border-[#0FFFE6]/30 
            shadow-[0_0_25px_#0FFFE6]
            text-[#CFFAFB]
          "
        >
          {/* HEADER */}
          <SheetHeader
            className="
              h-[90px] w-full 
              bg-gradient-to-r from-[#031B1F] to-[#021316]
              border-b border-[#0FFFE6]/20
              shadow-[0_0_20px_#0FFFE6]
            "
          >
            <SheetTitle className="text-[#0FFFE6] m-2 md:hidden drop-shadow-[0_0_12px_#0FFFE6]">
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
            </SheetTitle>
          </SheetHeader>

          {/* HOME SECTION */}
          <div className="flex justify-between border-b border-[#0FFFE6]/20 items-center md:hidden px-4 py-3">
            <Link
              href={"#"}
              className="font-bold text-[#0FFFE6] drop-shadow-[0_0_6px_#0FFFE6]"
            >
              Home
            </Link>
            <Link href={"#"} className="text-[#00C8FF]">
              <GrHomeRounded className="font-bold size-6" />
            </Link>
          </div>

          {/* TRENDING */}
          <div className=" border-b border-[#0FFFE6]/20 py-2">
            <div className="ml-6 font-bold text-lg text-[#00C8FF]">
              Trending
            </div>
            {Home_link.map((item) => (
              <div
                key={item.name}
                className="
                  py-3.5 px-6
                  hover:bg-[#0FFFE6]/10
                  transition-all
                  cursor-pointer
                "
              >
                <Link href={item.href}>{item.name}</Link>
              </div>
            ))}
          </div>

          {/* CATEGORIES */}
          <div className=" border-b border-[#0FFFE6]/20 py-2">
            <div className="ml-6 font-bold text-lg text-[#00C8FF]">
              Top Categories
            </div>
            {Categories_link.map((item) => (
              <div
                key={item.name}
                className="
                  py-3.5 px-6
                  hover:bg-[#0FFFE6]/10
                  transition-all
                "
              >
                <Link href={item.href}>{item.name}</Link>
              </div>
            ))}
          </div>

          {/* FEATURES */}
          <div className="py-2">
            <div className="ml-6 font-bold text-lg text-[#00C8FF]">
              Programs & Features
            </div>
            {Features_link.map((item) => (
              <div
                key={item.name}
                className="
                  py-3.5 px-6
                  hover:bg-[#0FFFE6]/10
                "
              >
                <Link href={item.href}>{item.name}</Link>
              </div>
            ))}
          </div>
          {/* 🔥 Close Button */}
  <SheetClose
    className="
      absolute right-4 top-4 z-50 
      text-[#0FFFE6]
      hover:text-[#00C8FF]
      drop-shadow-[0_0_10px_#0FFFE6]
      transition-all duration-200
    "
  >
    <X className="size-7" />
  </SheetClose>


          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
