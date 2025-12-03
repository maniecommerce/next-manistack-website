"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";

export default function CartIcon() {
  // const bagItems = useSelector((state: RootState) => state.bag.bag);

  return (
    <Link href={"/bag-items"}>
      <div className="relative mr-2">
        <ShoppingCart className="w-7 h-7" />
        <span className="absolute -top-1 -right-2 bg-yellow-400 text-black rounded-full text-xs font-bold px-1">
          {/* {bagItems.length} */}0
        </span>
      </div>
    </Link>
  );
}
