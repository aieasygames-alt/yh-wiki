"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "../lib/i18n";

export function Header() {
  const pathname = usePathname();
  const lang = (pathname.split("/")[1] || "zh") as Locale;

  const navItems = [
    { href: `/${lang}`, label: t(lang, "site.nav.home") },
    { href: `/${lang}/characters`, label: t(lang, "site.nav.characters") },
    { href: `/${lang}/materials`, label: t(lang, "site.nav.materials") },
    { href: `/${lang}/calculator/leveling`, label: t(lang, "site.nav.calculator") },
  ];

  const otherLang = lang === "zh" ? "en" : "zh";
  const langLabel = lang === "zh" ? "EN" : "中文";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-bold text-lg text-primary-400">
          {t(lang, "site.title")}
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-primary-400 ${
                pathname === item.href
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
      </div>
    </header>
  );
}
