"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";

import { GrHomeRounded } from "react-icons/gr";

import Link from "next/link";
import { MdSupervisorAccount } from "react-icons/md";

const Home_link = [
  { name: "Bestsellers", href: "#" },
  { name: "New Releases", href: "#" },
  { name: "Movers and Shakers", href: "#" },
];
const Categories_link = [
  { name: "Mobiles", href: "#" },
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

const amazonShop_link = [
  { name: "Category", href: "#" },
  { name: "Deals", href: "#" },
  { name: "Sell", href: "#" },
];

export default function NavDrawer() {
  return (
    <nav>
      <Sheet>
        <SheetTrigger className=" text-white ">
          <Menu className="size-9 w-7 ml-2 " />
        </SheetTrigger>

        <SheetContent className="overflow-x-hidden">
          <SheetHeader className="bg-gray-800 h-[130px] w-[100%] md:h-[55px]">
            <div className="flex justify-end text-white md:justify-start">
              <Link href={"/sign-in"} className="flex items-center gap-2 ">
                Sign in
                <MdSupervisorAccount className="size-8.5" />
              </Link>

              <Link href={"#"}></Link>
            </div>

            <SheetTitle className="text-white m-2 md:hidden">
              <div>Browse</div>
              <div>E-commerce</div>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex  justify-between  border-b-5 border-gray-300 items-center md:hidden">
            <Link href={"#"} className="ml-5.5 mb-5 font-bold ">
              E-commerce Home
            </Link>
            <Link href={"#"} className="mr-7 mb-5 ">
              <GrHomeRounded className="font-bold" />
            </Link>
          </div>
          <div className=" border-b-5 border-gray-300 ">
            <div className="ml-6 font-bold">Trending</div>
            {Home_link.map((homeLink) => (
              <div
                className="py-3.5 px-6 hover:bg-gray-300 hover:w-[100%]"
                key={homeLink.name}
              >
                <Link href={homeLink.href}>{homeLink.name}</Link>
              </div>
            ))}
          </div>
          <div className=" border-b-5 border-gray-300">
            <div className="ml-6 font-bold">Top Categories for You</div>
            {Categories_link.map((categoriesLink) => (
              <div
                className="py-3.5 px-6 hover:bg-gray-300 hover:w-[100%]"
                key={categoriesLink.name}
              >
                <Link href={categoriesLink.href}>{categoriesLink.name}</Link>
              </div>
            ))}
          </div>
          <div>
            <div className="ml-6 font-bold">Programs & Features</div>
            {Features_link.map((featuresLink) => (
              <div
                className="py-3.5 px-6 hover:bg-gray-300 hover:w-[100%]"
                key={featuresLink.name}
              >
                <Link href={featuresLink.href}>{featuresLink.name}</Link>
              </div>
            ))}
          </div>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
}