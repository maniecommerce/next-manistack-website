"use client";


import Link from "next/link";
import { useSession,} from "next-auth/react";
import { User } from "next-auth";
import NavDrawer from "./NavDrawer";
import { MapPin} from "lucide-react";
import { MdSupervisorAccount } from "react-icons/md";
import { GoChevronRight } from "react-icons/go";
import { LiaCartArrowDownSolid } from "react-icons/lia";
import SearchBar from "./SearchBar";

import CartIcon from "@/components/icons/CartIcon";



const amazonShop_link = [
  { name: "Today's Deals", href: "#" },
  { name: "Customer Service", href: "#" },
  { name: "Gift Cards", href: "#" },
  { name: "Registry", href: "#" },
  { name: "Sell", href: "#" },
];

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav>
      <div className="w-[full]  bg-gray-800 md:w-[full] md:h-[60px] md:bg-[#131921] md:flex md:items-center md:justify-evenly md:p-2 min-w-screen">
        {/**All items flex box........... */}
        <div className="flex text-white md:p-2">
          {/** Navigation Drawer icon and components */}
          <div className="items-start md:hidden m-1">
            <NavDrawer />
          </div>
          {/**Mobile Responsive Logo.... */}
          <Link href={"/dashboard"} className="w-[8rem] md:hidden">
            <div className="border-1 border-transparent hover:border-1- hover:border-white flex ">
              <img
                src="./e_commerce.svg"
                alt="Amazon Logo"
                className="h-[50px] w-[100%] text-white "
              />
            </div>
          </Link>
          {/**Desktop Responsive Logo.... */}
          <div className="hidden md:block md:w-[8rem]">
            <div className="border-1 border-transparent hover:border-1- hover:border-white flex ">
              <img
                src="./desktop_logo.svg"
                alt="Amazon Logo"
                className="h-[50px] w-[100%] text-white "
              />
            </div>
          </div>
          {/**Desktop Responsive address itmes. */}
          <div className="hidden md:block ">
            <div className="border-1 border-transparent hover:border-1- hover:border-white items-center p-1">
              <p className="text-xs text-[#cccccc] ml-6">
                Delivering to Kolkata 700082
              </p>
              <div className="flex">
                <MapPin />
                <p className="text-sm">Update location</p>
              </div>
            </div>
          </div>

          {/**Sign in......... ......................................................................................*/}
          <div className="w-[70%] flex justify-end md:hidden">
            <div className=" mt-1">
              {session ? (
                <>
                  <Link href={"/sign-in"} className="flex items-center gap-0">
                    {user.username || user.email}
                    <GoChevronRight className="size-3 mt-0.5 " />
                    <MdSupervisorAccount className="size-8.5 mr-4" />
                    
                    
                  </Link>
                  
                </>
              ) : (
                <Link href={"/sign-in"} className="flex items-center gap-0">
                  Sign in
                  <GoChevronRight className="size-3 mt-0.5 " />
                  <MdSupervisorAccount className="size-8.5 mr-4" />
          
                </Link>
              )}
            </div>
          </div>
          <div className="m-2"><CartIcon/></div>
        </div>

        {/**Mobalie and Desktop Responsive Search bar..........*/}
        <SearchBar />

        <div className=" hidden md:block md:text-white md:border-1 md:border-transparent md:hover:border-1- md:hover:border-white md:p-1">
          <Link href={"/sign-in"}>
            <span className="text-xs">Hello, sign in</span>
            <p className="text-sm font-bold">Account & List</p>
          </Link>
        </div>
        <div className="hidden md:block md:text-white md:border-1 md:border-transparent md:hover:border-1- md:hover:border-white md:p-1">
          <Link href={"#"}>
            <span className="text-xs">Returns</span>
            <p className="text-sm font-bold">& Orders</p>
          </Link>
        </div>
        <div className="hidden md:block md:text-white md:border-1 md:border-transparent md:hover:border-1- md:hover:border-white md:p-1">
          <Link href={"#"} className="flex items-end">
            <LiaCartArrowDownSolid className="size-9 mr-4" />
            <span className="text-sm font-bold">Orders</span>
          </Link>
        </div>
      </div>
      {/**Responsive Pannel................................................. */}

      {/* Bottom Nav Links */}
      <nav className="bg-[#232f3e] text-white px-2 sm:px-6 flex items-center gap-4 overflow-x-auto text-sm py-2 whitespace-nowrap scrollbar-hide lg:h-10">
        <div className=" items-center hidden md:flex">
          <NavDrawer />
          <span>All</span>
        </div>

        <div className="flex ml-2 gap-4 font-bold">
          {amazonShop_link.map((shopLink) => (
            <div key={shopLink.name} className="text-white ">
              <Link href={shopLink.href} className="flex">
                {shopLink.name}
              </Link>
            </div>
          ))}
        </div>
      </nav>

    
    </nav>
  );
}

export default Navbar;
