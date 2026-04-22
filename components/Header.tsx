"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale, isZhLocale } from "../lib/i18n";
import { SearchDialog } from "./SearchDialog";
import Logo from "./Logo";

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

  const otherLang = lang === "zh" ? "tw" : "zh";
  const langLabel = lang === "zh" ? "繁" : lang === "tw" ? "EN" : "中文";

  const navItems: NavItem[] = [
    { href: `/${lang}/characters`, label: t(lang, "site.nav.characters") },
    { type: "dropdown", key: "guides-tools", label: t(lang, "site.nav.guidesAndTools"), items: [
      { href: `/${lang}/guides`, label: t(lang, "site.nav.allGuides") },
      { href: `/${lang}/tier-list`, label: isZhLocale(lang) ? "强度排行" : "Tier List" },
      { href: `/${lang}/calculator/leveling`, label: t(lang, "site.nav.levelingCalc") },
      { href: `/${lang}/calculator/build`, label: t(lang, "site.nav.buildCalc") },
      { href: `/${lang}/gacha`, label: t(lang, "site.nav.gachaSim") },
      { href: `/${lang}/redeem-codes`, label: t(lang, "site.nav.redeemCodes") },
    ]},
    { type: "dropdown", key: "database", label: t(lang, "site.nav.database"), items: [
      { href: `/${lang}/weapons`, label: t(lang, "site.nav.weapons") },
      { href: `/${lang}/vehicles`, label: t(lang, "site.nav.vehicles") },
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
      { href: `/${lang}/changelog`, label: t(lang, "changelog.title") },
    ]},
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  const isDropdownActive = (item: NavItem) =>
    item.items?.some((sub) => isActive(sub.href)) ?? false;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-bold text-lg text-primary-400">
          <Logo size={28} />
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
          <a
            href="https://discord.gg/YOUR_INVITE_CODE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#5865F2] hover:text-[#4752C4] transition-colors"
            title={isZhLocale(lang) ? "加入 Discord 社区" : "Join Discord"}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </a>
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
                {lang === "zh" ? "English" : lang === "tw" ? "English" : "中文"}
              </Link>
              <a
                href="https://discord.gg/YOUR_INVITE_CODE"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-[#5865F2] hover:text-[#4752C4] py-1.5 mt-1"
              >
                {isZhLocale(lang) ? "加入 Discord 社区" : "Join Discord"}
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
