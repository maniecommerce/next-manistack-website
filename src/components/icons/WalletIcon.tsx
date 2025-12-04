"use client"
import { CiWallet } from "react-icons/ci";
import Link from "next/link";
export default function WalletIcon() {
    return (

        <Link href={"#"} className="group -m-2 flex items-center p-2">
            <CiWallet className='size-7 ' />
            <span className=" text-sm font-medium text-gray-700 group-hover:text-gray-800">1K</span>
            <span className="sr-only">items in cart, view bag</span>
        </Link>

    )
}