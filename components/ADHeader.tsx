"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/en/anime-destiny", label: "Home" },
  { href: "/en/anime-destiny/codes", label: "Codes" },
  { href: "/en/anime-destiny/tier-list", label: "Tier List" },
  { href: "/en/anime-destiny/units", label: "Units" },
  { href: "/en/anime-destiny/traits", label: "Traits" },
  { href: "/en/anime-destiny/guides/beginner-guide", label: "Beginner Guide" },
  { href: "/en/anime-destiny/guides/summon-gems-guide", label: "Summon & Gems" },
  { href: "/en/anime-destiny/guides/evolution-materials-guide", label: "Evolution" },
];

export function ADHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/en/anime-destiny" className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Anime Destiny
          </span>
          <span className="hidden text-sm font-normal text-gray-500 sm:inline">Wiki</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/en/anime-destiny" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/en"
            className="ml-2 rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:text-white hover:border-gray-500"
          >
            NTE Wiki
          </Link>
        </nav>

        <button
          className="rounded-md p-2 text-gray-400 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-800 px-4 py-2 lg:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/en/anime-destiny" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/en"
            className="block rounded-md border-t border-gray-800 px-3 py-2 text-sm text-gray-400 hover:text-white"
          >
            NTE Wiki
          </Link>
        </nav>
      )}
    </header>
  );
}
