"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "../lib/i18n";

const links = [
  { key: "redeemCodes", href: "/redeem-codes" },
  { key: "characters", href: "/characters" },
  { key: "gacha", href: "/gacha" },
  { key: "guides", href: "/guides" },
  { key: "faq", href: "/faq" },
] as const;

export function QuickLinks({ lang }: { lang: string }) {
  const locale = lang as Locale;
  const pathname = usePathname();

  return (
    <nav className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <span className="text-xs text-gray-500 mr-2 shrink-0 hidden sm:inline">
          {locale === "zh" ? "快速导航：" : "Quick Links:"}
        </span>
        {links.map((link) => {
          const fullHref = `/${lang}${link.href}`;
          const isActive = pathname === fullHref || pathname === fullHref + "/";
          return (
            <Link
              key={link.key}
              href={fullHref}
              className={`text-xs px-3 py-1.5 rounded-full shrink-0 transition-colors ${
                isActive
                  ? "bg-primary-600/20 text-primary-400"
                  : "text-gray-400 hover:text-primary-400 hover:bg-gray-800/50"
              }`}
            >
              {t(locale, `site.nav.${link.key}` as `site.nav.${string}`)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
