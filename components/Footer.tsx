"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale, isZhLocale } from "../lib/i18n";
import Logo from "./Logo";

export function Footer() {
  const pathname = usePathname();
  const lang = (pathname.split("/")[1] || "zh") as Locale;

  const columns = [
    {
      title: t(lang, "site.nav.footer.gameData"),
      links: [
        { href: `/${lang}/characters`, label: t(lang, "site.nav.characters") },
        { href: `/${lang}/weapons`, label: t(lang, "site.nav.weapons") },
        { href: `/${lang}/materials`, label: t(lang, "site.nav.materials") },
        { href: `/${lang}/locations`, label: t(lang, "site.nav.locations") },
      ],
    },
    {
      title: t(lang, "site.nav.footer.tools"),
      links: [
        { href: `/${lang}/calculator/leveling`, label: t(lang, "site.nav.levelingCalc") },
        { href: `/${lang}/calculator/build`, label: t(lang, "site.nav.buildCalc") },
        { href: `/${lang}/gacha`, label: t(lang, "site.nav.gachaSim") },
        { href: `/${lang}/map`, label: t(lang, "site.nav.map") },
      ],
    },
    {
      title: t(lang, "site.nav.footer.content"),
      links: [
        { href: `/${lang}/guides`, label: t(lang, "site.nav.guides") },
        { href: `/${lang}/blog`, label: t(lang, "site.nav.blog") },
        { href: `/${lang}/lore`, label: t(lang, "site.nav.lore") },
      ],
    },
    {
      title: t(lang, "site.nav.footer.resources"),
      links: [
        { href: `/${lang}/tier-list`, label: isZhLocale(lang) ? "强度排行" : "Tier List" },
        { href: `/${lang}/faq`, label: t(lang, "site.nav.faq") },
        { href: `/${lang}/redeem-codes`, label: t(lang, "site.nav.redeemCodes") },
        { href: `/${lang}/sitemap.xml`, label: "Sitemap" },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-medium text-gray-300 mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Logo size={20} />
            <span className="text-primary-400 font-semibold">{t(lang, "site.title")}</span>
          </div>
          <p>&copy; {new Date().getFullYear()} {t(lang, "site.title")}</p>
          <p className="mt-1 text-gray-600">
            {isZhLocale(lang)
              ? "本站为玩家社区工具站，与官方无关"
              : "This is a community fan site, not affiliated with the official game."}
          </p>
        </div>
      </div>
    </footer>
  );
}
