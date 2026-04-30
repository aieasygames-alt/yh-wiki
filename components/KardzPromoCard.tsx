"use client";

import { isZhLocale, type Locale } from "../lib/i18n";

const KARDZ_URL = "https://kardzntewiki.kardz.cn/detail/1578299835";

interface KardzPromoCardProps {
  locale: Locale;
  variant?: "banner" | "card" | "compact";
}

export function KardzPromoCard({ locale, variant = "card" }: KardzPromoCardProps) {
  const isTw = locale === "tw";
  const isZh = isZhLocale(locale);

  const title = isTw ? "異環國際服代儲" : isZh ? "异环国际服代充" : "NTE Global Recharge";
  const desc = isTw ? "安全便捷 · 即刻到帳" : isZh ? "安全便捷 · 即刻到账" : "Safe & Fast Top-up";
  const tag = isTw ? "推薦" : isZh ? "推荐" : "Recommended";

  if (variant === "banner") {
    return (
      <a
        href={KARDZ_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 hover:border-amber-400/50 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">{title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">{tag}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </div>
          <span className="text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors">Kardz →</span>
        </div>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={KARDZ_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 hover:border-amber-500/40 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💎</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-amber-300 group-hover:text-amber-200 transition-colors">{title}</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">{tag}</span>
            </div>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
          <span className="text-xs text-amber-400/50 group-hover:text-amber-400 transition-colors shrink-0">→</span>
        </div>
      </a>
    );
  }

  // Default "card" variant
  return (
    <a
      href={KARDZ_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-amber-500/30 hover:bg-gray-900/70 transition-colors group"
    >
      <span className="text-2xl">💎</span>
      <h3 className="text-base font-bold mt-3 group-hover:text-amber-300 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
      <span className="text-xs text-amber-400/50 mt-2 inline-flex items-center gap-0.5">
        Kardz ↗
      </span>
    </a>
  );
}
