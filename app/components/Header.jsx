"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/lJwnQlHSEBA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

export default function Header({ menuItems = [], logo = null }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (itemId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(itemId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 90);
  };

  const renderMenuItem = (item, isMobile = false) => {
    if (item.type === "link") {
      return (
        <Link
          key={item.id}
          href={item.path}
          className={`${
            isMobile
              ? "flex w-full items-center px-4 py-2 text-base font-medium hover:bg-gray-200"
              : "group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          }`}
          prefetch={false}
        >
          {item.title}
        </Link>
      );
    }

    if (item.type === "menu" && item.children) {
      if (isMobile) {
        const isOpen = openMobileCategory === item.id;

        return (
          <div key={item.id} className="w-full">
            <button
              onClick={() => setOpenMobileCategory(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between py-2 px-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {item.title}
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="ml-4 space-y-1 bg-gray-50 dark:bg-gray-900 rounded-md p-2">
                {item.children.map((child) => renderMenuItem(child, true))}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <button className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50">
            {item.title}
            <ChevronDownIcon
              className={`ml-1 w-4 h-4 transition-transform duration-400 ${
                openDropdown === item.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === item.id && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border bg-white shadow-lg dark:bg-gray-950"
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="py-1">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    prefetch={false}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderLogo = () => {
    //İkon eklenirse
    // if (!logo) {
    //   return <MountainIcon className="h-6 w-6" />;
    // }

    if (logo.type === "image") {
      return (
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="h-auto w-auto max-h-8"
        />
      );
    }

    return <MountainIcon className="h-6 w-6" />;
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-5">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden cursor-pointer"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="sr-only">menu</SheetTitle>
          <div className="grid gap-2 py-6 mt-5">
            {menuItems.map((item, index) => renderMenuItem(item, true))}
          </div>
        </SheetContent>
      </Sheet>

      <Link
        href="/"
        className="mr-6 hidden lg:flex items-center"
        prefetch={false}
      >
        {renderLogo()}
      </Link>

      <nav className="ml-auto hidden lg:flex gap-6">
        {menuItems.map((item, index) => renderMenuItem(item, false))}
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
