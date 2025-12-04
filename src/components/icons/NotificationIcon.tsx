"use client"
import { IoIosNotificationsOutline } from "react-icons/io";
import Link from "next/link";
export default function NotificationIcon() {
    return (
     
            <Link href={"#"} className="group -m-2 flex items-center p-1">
                <IoIosNotificationsOutline className='size-6 font-bold' />
                <span className=" text-sm font-medium text-gray-700 group-hover:text-gray-800">1</span>
                <span className="sr-only">items in cart, view bag</span>
            </Link>
        

    )
}