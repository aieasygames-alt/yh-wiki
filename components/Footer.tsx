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
          <div className="flex items-center justify-center gap-4 mb-3">
            <a
              href="https://discord.gg/YOUR_INVITE_CODE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#5865F2] hover:text-[#4752C4] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
              </svg>
              Discord
            </a>
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
