"use client";

import Wallet from "@/components/Wallet";
import WritenLogo from "./WritenLogo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const { data: session } = useSession();

  const user = {
  fullName: session?.user?.fullName || "User",
  email: session?.user?.email || "example@email.com",
  imageUrl:
    session?.user?.image ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${session?.user?.username || "User"}`,
};
console.log(session)

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800/100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* LOGO + DESKTOP NAV */}
            <div className="flex items-center">
              <div className="shrink-0">
                <WritenLogo />
              </div>

              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-950/50 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* WALLET */}
            <div className="hidden md:block">
              <Wallet />
            </div>

            {/* DESKTOP PROFILE DROPDOWN */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-white"
                >
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex max-w-xs items-center rounded-full">
                    <img
                      alt="avatar"
                      src={user.imageUrl}
                      className="size-8 rounded-full border border-white/10"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {item.name === "Sign out" ? (
                          <button
                            onClick={() => signOut({ callbackUrl: "/sign-in" })}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                          >
                            {item.name}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex gap-3 items-center">
              <Wallet />
              <DisclosureButton className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                <Bars3Icon aria-hidden="true" className="size-6 data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-950/50 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>

          {/* MOBILE USER PANEL */}
          <div className="border-t border-white/10 pt-4 pb-3">
            <div className="flex items-center px-5">
              <img src={user.imageUrl} className="size-10 rounded-full border border-white/10" />
              <div className="ml-3">
                <p className="text-white font-medium">{user.fullName}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) =>
                item.name === "Sign out" ? (
                  <button
                    key={item.name}
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </button>
                ) : (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </DisclosureButton>
                )
              )}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
