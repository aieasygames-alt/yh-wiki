"use client";

import { usePathname } from "next/navigation";
import { t, type Locale } from "../lib/i18n";

export function Footer() {
  const pathname = usePathname();
  const lang = (pathname.split("/")[1] || "zh") as Locale;

  return (
    <footer className="border-t border-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {t(lang, "site.title")}
        </p>
        <p className="mt-1 text-gray-600">
          {lang === "zh"
            ? "本站为玩家社区工具站，与官方无关"
            : "This is a community fan site, not affiliated with the official game."}
        </p>
      </div>
    </footer>
  );
}
