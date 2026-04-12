"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "../lib/i18n";
import { SearchDialog } from "./SearchDialog";

interface DropdownItem {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  type?: "dropdown";
  key?: string;
  items?: DropdownItem[];
}

export function Header() {
  const pathname = usePathname();
  const lang = (pathname.split("/")[1] || "zh") as Locale;
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const otherLang = lang === "zh" ? "en" : "zh";
  const langLabel = lang === "zh" ? "EN" : "中文";

  const navItems: NavItem[] = [
    { href: `/${lang}/characters`, label: t(lang, "site.nav.characters") },
    { type: "dropdown", key: "guides-tools", label: t(lang, "site.nav.guidesAndTools"), items: [
      { href: `/${lang}/guides`, label: t(lang, "site.nav.allGuides") },
      { href: `/${lang}/calculator/leveling`, label: t(lang, "site.nav.levelingCalc") },
      { href: `/${lang}/calculator/build`, label: t(lang, "site.nav.buildCalc") },
      { href: `/${lang}/gacha`, label: t(lang, "site.nav.gachaSim") },
      { href: `/${lang}/redeem-codes`, label: t(lang, "site.nav.redeemCodes") },
    ]},
    { type: "dropdown", key: "database", label: t(lang, "site.nav.database"), items: [
      { href: `/${lang}/weapons`, label: t(lang, "site.nav.weapons") },
      { href: `/${lang}/materials`, label: t(lang, "site.nav.materials") },
      { href: `/${lang}/compare/nte-vs-genshin`, label: t(lang, "compare.nteVsGenshin") },
      { href: `/${lang}/compare/nte-vs-wuthering-waves`, label: t(lang, "compare.nteVsWuwa") },
      { href: `/${lang}/compare/games-like-nte`, label: t(lang, "compare.gamesLikeNte") },
    ]},
    { href: `/${lang}/blog`, label: t(lang, "site.nav.blog") },
    { type: "dropdown", key: "wiki", label: t(lang, "site.nav.wiki"), items: [
      { href: `/${lang}/lore`, label: t(lang, "site.nav.lore") },
      { href: `/${lang}/locations`, label: t(lang, "site.nav.locations") },
      { href: `/${lang}/map`, label: t(lang, "site.nav.map") },
      { href: `/${lang}/faq`, label: t(lang, "site.nav.faq") },
    ]},
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  const isDropdownActive = (item: NavItem) =>
    item.items?.some((sub) => isActive(sub.href)) ?? false;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-bold text-lg text-primary-400">
          {t(lang, "site.title")}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => {
            if (item.type === "dropdown" && item.items) {
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.key!)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`text-sm transition-colors hover:text-primary-400 flex items-center gap-1 ${
                      isDropdownActive(item)
                        ? "text-primary-400 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {item.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.key && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg py-1 min-w-[160px] shadow-lg">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-3 py-2 text-sm transition-colors ${
                            isActive(sub.href)
                              ? "text-primary-400"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`text-sm transition-colors hover:text-primary-400 ${
                  isActive(item.href!) ? "text-primary-400 font-medium" : "text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={pathname.replace(`/${lang}`, `/${otherLang}`)}
            className="text-sm text-gray-500 hover:text-primary-400 border border-gray-700 rounded px-2 py-0.5"
          >
            {langLabel}
          </Link>
          <SearchDialog lang={lang} />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-400 hover:text-white"
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
        <nav className="lg:hidden border-t border-gray-800 bg-[var(--background)]/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            <div className="mb-2">
              <SearchDialog lang={lang} />
            </div>
            {navItems.map((item) => {
              if (item.type === "dropdown" && item.items) {
                return (
                  <div key={item.key} className="mt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider py-1">{item.label}</p>
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block pl-2 py-1.5 text-sm ${
                          isActive(sub.href) ? "text-primary-400 font-medium" : "text-gray-400"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm py-1.5 ${
                    isActive(item.href!) ? "text-primary-400 font-medium" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 pt-2 border-t border-gray-800">
              <Link
                href={pathname.replace(`/${lang}`, `/${otherLang}`)}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-500 py-1.5"
              >
                {lang === "zh" ? "English" : "中文"}
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
