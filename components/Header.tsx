"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "../lib/i18n";

export function Header() {
  const pathname = usePathname();
  const lang = (pathname.split("/")[1] || "zh") as Locale;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: `/${lang}`, label: t(lang, "site.nav.home") },
    { href: `/${lang}/characters`, label: t(lang, "site.nav.characters") },
    { href: `/${lang}/materials`, label: t(lang, "site.nav.materials") },
    { href: `/${lang}/calculator/leveling`, label: t(lang, "site.nav.calculator") },
    { href: `/${lang}/faq`, label: t(lang, "site.nav.faq") },
  ];

  const otherLang = lang === "zh" ? "en" : "zh";
  const langLabel = lang === "zh" ? "EN" : "中文";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-bold text-lg text-primary-400">
          {t(lang, "site.title")}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-primary-400 ${
                pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href))
                  ? "text-primary-400 font-medium"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={pathname.replace(`/${lang}`, `/${otherLang}`)}
            className="text-sm text-gray-500 hover:text-primary-400 border border-gray-700 rounded px-2 py-0.5"
          >
            {langLabel}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-800 bg-[var(--background)]/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm py-1.5 ${
                  pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href))
                    ? "text-primary-400 font-medium"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={pathname.replace(`/${lang}`, `/${otherLang}`)}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-500 py-1.5"
            >
              {lang === "zh" ? "English" : "中文"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
