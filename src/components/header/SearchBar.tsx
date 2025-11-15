"use client";

import { Search } from "lucide-react";
export default function SearchBar() {
  return (
    <div className="flex text-gray-950 text-md font-bold  md:w-[300px] h-[46px] rounded-[4px] mx-3 md:mx-0 justify-evenly lg:w-[620px]  ">
      <select className="hidden md:block bg-[#e6e6e6] w-[50px] rounded-l-[4px] p-1  text-[#555] text-sm items-center font-bold px-1">
        <option className="text-xs">All</option>
      </select>
      <input
        placeholder="Search E-commerce"
        className="w-[100%] bg-white pl-2 rounded-l-[4px] outline-[#148194] md:rounded-l-none md:outline-none "
      />
      <div className="w-[46px] flex items-center justify-center bg-[#febd68] rounded-r-[6px] hover:bg-amber-600 ">
        <button className=" p-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-[#148194]  sm:text-sm/6 bg-[#febd68] rounded-r-[6px] h-[46px] hover:bg-amber-600">
          <Search />
        </button>
      </div>
    </div>
  );
}