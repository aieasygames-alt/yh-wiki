"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, isZhLocale, LOCALES, LOCALE_NATIVE_NAME, type Locale } from "../lib/i18n";
import { canonicalPath, localizedPath } from "../lib/url";
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
  const lang = (pathname.split("/")[1] || "en") as Locale;
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = useCallback((key: string) => {
    closeTimer.current = setTimeout(() => {
      setOpenDropdown((prev) => (prev === key ? null : prev));
    }, 300);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const navItems: NavItem[] = [
    { href: localizedPath(lang, "characters"), label: t(lang, "site.nav.characters") },
    { type: "dropdown", key: "guides-tools", label: t(lang, "site.nav.guidesAndTools"), items: [
      { href: localizedPath(lang, "guides"), label: t(lang, "site.nav.allGuides") },
      { href: localizedPath(lang, "tier-list"), label: t(lang, "footer.tierList") },
      { href: localizedPath(lang, "calculator/leveling"), label: t(lang, "site.nav.levelingCalc") },
      { href: localizedPath(lang, "calculator/build"), label: t(lang, "site.nav.buildCalc") },
      { href: localizedPath(lang, "gacha"), label: t(lang, "site.nav.gachaSim") },
      { href: localizedPath(lang, "banners"), label: isZhLocale(lang) ? "卡池时间表" : "Banner Schedule" },
      { href: localizedPath(lang, "gacha-analyzer"), label: t(lang, "site.nav.gachaAnalyzer") },
      { href: localizedPath(lang, "redeem-codes"), label: t(lang, "site.nav.redeemCodes") },
      { href: localizedPath(lang, "999-nights-planner"), label: isZhLocale(lang) ? (lang === "tw" ? "999夜規劃器" : "999夜规划器") : "999 Nights Planner" },
      { href: localizedPath(lang, "explorer"), label: t(lang, "site.nav.explorer") },
      { href: localizedPath(lang, "team-builder"), label: t(lang, "teamBuilder.title") },
      { href: localizedPath(lang, "city-tycoon"), label: t(lang, "cityTycoon.title") },
      { href: localizedPath(lang, "calculator/stats"), label: t(lang, "statsCalc.title") },
      { href: localizedPath(lang, "calculator/dps"), label: isZhLocale(lang) ? "DPS 计算器" : "DPS Calculator" },
      { href: localizedPath(lang, "calculator/planner"), label: t(lang, "materialPlanner.title") },
      { href: localizedPath(lang, "calculator/disk-score"), label: t(lang, "diskScore.title") },
      { href: localizedPath(lang, "compare-characters"), label: t(lang, "compareCharacters.title") },
      { href: localizedPath(lang, "events"), label: t(lang, "eventsCalendar.title") },
    ]},
    { type: "dropdown", key: "database", label: t(lang, "site.nav.database"), items: [
      { href: localizedPath(lang, "weapons"), label: t(lang, "site.nav.weapons") },
      { href: localizedPath(lang, "vehicles"), label: t(lang, "site.nav.vehicles") },
      { href: localizedPath(lang, "materials"), label: t(lang, "site.nav.materials") },
      { href: localizedPath(lang, "disk-sets"), label: t(lang, "site.nav.cassettes") },
      { href: localizedPath(lang, "effects"), label: t(lang, "effects.title") },
      { href: localizedPath(lang, "bosses"), label: t(lang, "bossGuide.title") },
      { href: localizedPath(lang, "compare/nte-vs-genshin"), label: t(lang, "compare.nteVsGenshin") },
      { href: localizedPath(lang, "compare/nte-vs-wuthering-waves"), label: t(lang, "compare.nteVsWuwa") },
      { href: localizedPath(lang, "compare/nte-vs-honkai-star-rail"), label: "NTE vs Star Rail" },
      { href: localizedPath(lang, "compare/games-like-nte"), label: t(lang, "compare.gamesLikeNte") },
    ]},
    { href: localizedPath(lang, "blog"), label: t(lang, "site.nav.blog") },
    { type: "dropdown", key: "wiki", label: t(lang, "site.nav.wiki"), items: [
      { href: localizedPath(lang, "lore"), label: t(lang, "site.nav.lore") },
      { href: localizedPath(lang, "locations"), label: t(lang, "site.nav.locations") },
      { href: localizedPath(lang, "map"), label: t(lang, "site.nav.map") },
      { href: localizedPath(lang, "faq"), label: t(lang, "site.nav.faq") },
      { href: localizedPath(lang, "changelog"), label: t(lang, "changelog.title") },
    ]},
  ];

  const isActive = (href: string) =>
    canonicalPath(pathname) === href || (href !== localizedPath(lang) && canonicalPath(pathname).startsWith(href));

  const isDropdownActive = (item: NavItem) =>
    item.items?.some((sub) => isActive(sub.href)) ?? false;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={localizedPath(lang)} className="flex items-center gap-2 font-bold text-lg text-primary-400">
          <Logo size={28} />
          {t(lang, "site.title")}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 min-w-0">
          {navItems.map((item) => {
            if (item.type === "dropdown" && item.items) {
              return (
                <div
                  key={item.key}
                  className="relative shrink-0"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenDropdown(item.key!);
                  }}
                  onMouseLeave={() => scheduleClose(item.key!)}
                >
                  <button
                    aria-expanded={openDropdown === item.key}
                    aria-haspopup="menu"
                    aria-label={t(lang, `header.${item.key === "guides-tools" ? "openGuidesTools" : item.key === "database" ? "OpenDatabase" : item.key === "wiki" ? "openWikiMenu" : "toggleMenu"}`)}
                    className={`text-sm whitespace-nowrap transition-colors hover:text-primary-400 flex items-center gap-1 px-2 py-1 ${
                      isDropdownActive(item)
                        ? "text-primary-400 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {item.label}
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.key && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      {/* Invisible bridge to prevent mouseLeave gap — must not block clicks */}
                      <div className="absolute inset-0 -top-1 pointer-events-none" />
                      <div className="bg-gray-900 border border-gray-700 rounded-lg py-1 min-w-[160px] shadow-lg whitespace-nowrap">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                              isActive(sub.href)
                                ? "text-primary-400"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`text-sm whitespace-nowrap shrink-0 transition-colors hover:text-primary-400 px-2 py-1 ${
                  isActive(item.href!) ? "text-primary-400 font-medium" : "text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {/* Spacer */}
          <div className="flex-1 min-w-2" />
          {/* Right side: social icons, language, search — outside nav overflow */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.reddit.com/r/NevernessToEverness/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm shrink-0 text-[#FF4500] hover:text-[#D63E00] transition-colors"
              title={t(lang, "header.joinReddit")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
            <a
              href="https://discord.com/invite/PuWfNRcBt9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm shrink-0 text-[#5865F2] hover:text-[#4752C4] transition-colors"
              title={t(lang, "header.joinDiscord")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
              </svg>
            </a>
            {/* Language switcher dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                onBlur={() => setTimeout(() => setLangMenuOpen(false), 200)}
                aria-expanded={langMenuOpen}
                aria-haspopup="menu"
                aria-label={t(lang, "header.changeLanguage")}
                className="text-sm text-gray-500 hover:text-primary-400 border border-gray-700 rounded px-2 py-0.5 flex items-center gap-1 max-w-[120px]"
              >
                <span className="truncate">{LOCALE_NATIVE_NAME[lang]}</span>
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg py-1 min-w-[160px] shadow-lg z-50">
                  {LOCALES.map((loc) => (
                    <Link
                      key={loc}
                      href={canonicalPath(pathname.replace(`/${lang}`, `/${loc}`))}
                      className={`block px-3 py-1.5 text-sm whitespace-nowrap ${
                        loc === lang
                          ? "text-primary-400 font-medium"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {LOCALE_NATIVE_NAME[loc]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <SearchDialog lang={lang} />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={t(lang, "header.toggleMenu")}
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
        <nav className="lg:hidden border-t border-gray-800 bg-[var(--background)]/95 backdrop-blur-md max-h-[calc(100vh-3.5rem)] overflow-y-auto">
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
              <div className="flex items-center gap-3 mb-2">
                <a
                  href="https://discord.com/invite/PuWfNRcBt9"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[#5865F2] hover:text-[#4752C4] py-1.5"
                >
                  {t(lang, "header.joinDiscord")}
                </a>
                <a
                  href="https://www.reddit.com/r/NevernessToEverness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#FF4500] hover:text-[#D63E00] py-1.5"
                >
                  {t(lang, "header.joinReddit")}
                </a>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider py-1">Language</p>
              <div className="grid grid-cols-2 gap-1">
                {LOCALES.map((loc) => (
                  <Link
                    key={loc}
                    href={canonicalPath(pathname.replace(`/${lang}`, `/${loc}`))}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm py-1.5 px-1 rounded ${
                      loc === lang
                        ? "text-primary-400 font-medium bg-gray-800"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {LOCALE_NATIVE_NAME[loc]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
