"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { t, type Locale } from "../../../lib/i18n";
import { trackEvent } from "../../../lib/analytics";
import { getAttributeColor } from "../../../lib/attributes";
import redeemCodesData from "../../../data/redeem-codes.json";
import charactersData from "../../../data/characters.json";
import blogData from "../../../data/blog.json";

interface RedeemCode {
  code: string;
  reward: string;
  rewardEn: string;
  status: "active" | "expired" | "unknown";
  expiresAt: string;
  source: string;
  region: "cn" | "global";
  revealedAt?: string;
}

const codes = redeemCodesData as RedeemCode[];

const STATUS_CONFIG = {
  active: {
    label: { zh: "有效", en: "Active" },
    dot: "bg-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  expired: {
    label: { zh: "已过期", en: "Expired" },
    dot: "bg-gray-500",
    border: "border-gray-700",
    bg: "bg-gray-800/30 opacity-50",
  },
  unknown: {
    label: { zh: "未知", en: "Unknown" },
    dot: "bg-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
};

const REGION_LABELS = {
  cn: { zh: "国服", en: "CN Server" },
  global: { zh: "国际服", en: "Global Server" },
};

export default function RedeemCodesPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [region, setRegion] = useState<"all" | "cn" | "global">("all");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => { setNow(new Date()); }, []);

  const getCountdown = useCallback((expiresAt: string) => {
    if (!now) return null;
    const diff = new Date(expiresAt).getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  }, [now]);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
      trackEvent({ event: "copy_redeem_code", label: code });
    });
  }, []);

  const filteredCodes = codes.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (region !== "all" && c.region !== region) return false;
    return true;
  });
  const activeCount = codes.filter((c) => c.status === "active").length;
  const expiredCount = codes.filter((c) => c.status === "expired").length;
  const cnCount = codes.filter((c) => c.region === "cn").length;
  const globalCount = codes.filter((c) => c.region === "global").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t(lang, "redeemCodes.title")}</h1>
      <p className="text-sm text-gray-500 mb-2">{t(lang, "redeemCodes.description")}</p>
      <p className="text-xs text-gray-600 mb-8">
        {t(lang, "redeemCodes.lastUpdate")}: 2026-04-18
      </p>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "redeemCodes.total")}</p>
          <p className="text-lg font-bold text-gray-300">{codes.length}</p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "redeemCodes.active")}</p>
          <p className="text-lg font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500">{t(lang, "redeemCodes.expired")}</p>
          <p className="text-lg font-bold text-gray-500">{expiredCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "active", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              filter === f
                ? "bg-primary-500/20 text-primary-400 border-primary-500/30"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {t(lang, `redeemCodes.filter_${f}`)}
          </button>
        ))}
      </div>

      {/* Region Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "cn", "global"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              region === r
                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {r === "all"
              ? t(lang, "redeemCodes.filter_all")
              : `${REGION_LABELS[r][lang]} (${r === "cn" ? cnCount : globalCount})`}
          </button>
        ))}
      </div>

      {/* Codes List */}
      <div className="space-y-3">
        {filteredCodes.map((code) => {
          const config = STATUS_CONFIG[code.status] || STATUS_CONFIG.unknown;
          const reward = lang === "zh" ? code.reward : code.rewardEn;
          const isExpired = code.status === "expired";

          return (
            <div
              key={code.code}
              className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-colors`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <code className={`text-sm font-mono font-bold ${isExpired ? "text-gray-500 line-through" : "text-gray-200"}`}>
                      {code.code}
                    </code>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      code.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700/50 text-gray-500"
                    }`}>
                      {config.label[lang]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {REGION_LABELS[code.region]?.[lang] || code.region}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 ${isExpired ? "text-gray-600" : "text-gray-300"}`}>
                    {t(lang, "redeemCodes.reward")}: {reward}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      {t(lang, "redeemCodes.expires")}: {code.expiresAt}
                    </span>
                    {code.status === "active" && getCountdown(code.expiresAt) && (() => {
                      const cd = getCountdown(code.expiresAt)!;
                      const isUrgent = cd.days < 7;
                      return (
                        <span className={`px-1.5 py-0.5 rounded ${isUrgent ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-gray-800 text-gray-400"}`}>
                          {isUrgent ? "⚠ " : ""}
                          {lang === "zh" ? `剩余 ${cd.days}天${cd.hours}小时` : `${cd.days}d ${cd.hours}h left`}
                        </span>
                      );
                    })()}
                    {code.source && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">
                        {code.source}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => !isExpired && handleCopy(code.code)}
                  disabled={isExpired}
                  className={`shrink-0 px-3 py-2 text-xs rounded-lg border transition-all ${
                    copiedCode === code.code
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : isExpired
                      ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-primary-500/50 hover:text-primary-400"
                  }`}
                >
                  {copiedCode === code.code
                    ? t(lang, "redeemCodes.copied")
                    : t(lang, "redeemCodes.copy")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Redeem */}
      <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-lg font-bold mb-4">{t(lang, "redeemCodes.howToTitle")}</h2>
        <ol className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">1.</span>
            <span>{t(lang, "redeemCodes.step1")}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">2.</span>
            <span>{t(lang, "redeemCodes.step2")}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">3.</span>
            <span>{t(lang, "redeemCodes.step3")}</span>
          </li>
        </ol>
      </div>

      {/* Module A: Next Steps */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">{t(lang, "redeemCodes.nextSteps.title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { key: "tierList", href: `/${lang}/tier-list` },
            { key: "reroll", href: `/${lang}/guides/reroll-guide-detailed` },
            { key: "beginner", href: `/${lang}/guides/beginner-guide` },
            { key: "teamBuilding", href: `/${lang}/guides/team-building` },
          ] as const).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/40 hover:bg-gray-900/80 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
                {t(lang, `redeemCodes.nextSteps.${item.key}` as `redeemCodes.nextSteps.${string}`)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {t(lang, `redeemCodes.nextSteps.${item.key}Desc` as `redeemCodes.nextSteps.${string}`)}
              </p>
              <span className="text-xs text-primary-400/60 group-hover:text-primary-400 mt-2 inline-block">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Module B: Top Characters */}
      {(() => {
        const topChars = useMemo(
          () =>
            (charactersData as Array<{ id: string; name: string; nameEn: string; attribute: string; tierRank?: string; image?: string }>)
              .filter((c) => c.tierRank === "S")
              .slice(0, 8),
          []
        );
        if (topChars.length === 0) return null;
        return (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">{t(lang, "redeemCodes.topCharacters.title")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topChars.map((c) => (
                <Link
                  key={c.id}
                  href={`/${lang}/characters/${c.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-3 hover:border-primary-500/40 transition-colors"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={lang === "zh" ? c.name : c.nameEn}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-primary-400 transition-colors">
                      {lang === "zh" ? c.name : c.nameEn}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getAttributeColor(c.attribute)}`}>
                        {t(lang, `attributes.${c.attribute}` as `attributes.${string}`)}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                        S
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href={`/${lang}/tier-list`}
              className="inline-block mt-3 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {t(lang, "redeemCodes.topCharacters.viewAll")}
            </Link>
          </div>
        );
      })()}

      {/* Module C: Latest Posts */}
      {(() => {
        const latestPosts = useMemo(
          () =>
            [...(blogData as Array<{ id: string; title: string; titleEn: string; summary: string; summaryEn: string; category: string; categoryEn: string; date: string; tags: string[] }>)]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 3),
          []
        );
        if (latestPosts.length === 0) return null;
        return (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">{t(lang, "redeemCodes.latestPosts.title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${lang}/blog/${post.id}`}
                  className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary-600/20 text-primary-400">
                      {lang === "zh" ? post.category : (post.categoryEn || post.category)}
                    </span>
                    <time className="text-xs text-gray-500">{post.date}</time>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {lang === "zh" ? post.title : post.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {lang === "zh" ? post.summary : post.summaryEn}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
