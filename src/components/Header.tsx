'use client'

import Link from "next/link";
import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import WritenLogo from './logo/WritenLogo';
import { useSession, signOut } from "next-auth/react";

import WalletIcon from './icons/WalletIcon';
import NotificationIcon from './icons/NotificationIcon';

const navigation = {
  categories: [
    {
      id: 'cricket',
      name: 'Cricket',
      featured: [
        {
          name: 'IPL',
          href: '#',
          imageSrc: '/IPL.webp',
          imageAlt: 'IPL Images',
        },
        {
          name: 'T20',
          href: '#',
          imageSrc: '/T20.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.'
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'IPL',
          items: [
            { name: 'Pending...', href: '#' },
            
          ],
        },
        {
          id: 'accessories',
          name: 'T20',
          items: [
            { name: 'Pending...', href: '#' },
            
          ],
        },
        {
          id: 'brands',
          name: 'ODI',
          items: [
            { name: 'Pending...', href: '#' },
          
          ],
        },
      ],
    },
    {
      id: 'casino',
      name: 'Casino',
      featured: [
        {
          name: 'Roulette',
          href: '/roulette-casino',
          imageSrc:
            '/roulette.webp',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Slot',
          href: '#',
          imageSrc: '/slot.webp',
          imageAlt:
            'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Casino',
          items: [
            { name: 'Pending...', href: '#' },
          
          ],
        },
        {
          id: 'accessories',
          name: 'Lottery',
          items: [
            { name: 'Pending...', href: '#' },
            
          ],
        },
        {
          id: 'brands',
          name: 'Card',
          items: [
            { name: 'Pending...', href: '#' },
            
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Account', href: '#' },
  ],
}

export default function Example() {
  const [open, setOpen] = useState(false)

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
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <Link href={item.href} className="mt-6 block font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </Link>
                          <p aria-hidden="true" className="mt-1">
                            Play now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a href={item.href} className="-m-2 block p-2 text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
             <div className="flex items-center gap-1">
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>

  <div className="block p-2 font-medium text-gray-700 text-sm">
    {user.fullName}
    <p className="text-xs text-gray-500">{user.email}</p>
  </div>
</div>

              <div className="flow-root">
                 {user.email !== "example@email.com" ? (
        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          Sign out
        </button>
      ) : (
        <Link
          href="/sign-in"
          className="text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          Sign in
        </Link>
      )}
              </div>
            </div>

            
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-5 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className=" flex lg:ml-0">
                <a href="#">
                  <span className="sr-only">Your Company</span>
                 <WritenLogo/>
                </a>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div key={item.name} className="group relative text-base sm:text-sm">
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                    />
                                    <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <Link href={item.href} className="hover:text-gray-800">
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
               
       <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
      {user.email !== "example@email.com" ? (
        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          Sign out
        </button>
      ) : (
        <Link
          href="/sign-in"
          className="text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          Sign in
        </Link>
      )}

      <span aria-hidden="true" className="h-6 w-px bg-gray-200" />

      <div className="text-sm font-medium text-gray-700 hover:text-gray-800">
        <div className="flex items-center gap-1">
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>

  <div className="block p-2 font-medium text-gray-700 text-sm">
    {user.fullName}
    <p className="text-xs text-gray-500">{user.email}</p>
  </div>
</div>

      </div>
    </div>


 {/* Notification */}
                <div className="ml-4 flow-root lg:ml-6">
              <NotificationIcon/>
                </div>

             
                {/* Wallet */}
                <div className="ml-4 flow-root lg:ml-6">
                  <WalletIcon/>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

























