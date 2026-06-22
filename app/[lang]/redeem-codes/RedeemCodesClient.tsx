"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { t, isZhLocale, Locale } from "../../../lib/i18n";
import { trackEvent } from "../../../lib/analytics";
import { getAttributeColor } from "../../../lib/attributes";
import redeemCodesData from "../../../data/redeem-codes.json";
import charactersData from "../../../data/characters.json";
import blogData from "../../../data/blog.json";
import { KardzPromoCard } from "../../../components/KardzPromoCard";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import Link from "next/link";

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
    labelKey: "status.active",
    dot: "bg-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  expired: {
    labelKey: "status.expired",
    dot: "bg-gray-500",
    border: "border-gray-700",
    bg: "bg-gray-800/30 opacity-50",
  },
  unknown: {
    labelKey: "status.unknown",
    dot: "bg-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
};

const REGION_LABEL_KEYS = {
  cn: "redeemCodesStatus.cnServer",
  global: "redeemCodesStatus.globalServer",
};

export function RedeemCodesClient({ lang }: { lang: string }) {
  const locale = lang as Locale;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // Default to "active" so users landing on the page see usable codes first
  // rather than the 19 expired ones. They can switch to "all" / "expired".
  const [filter, setFilter] = useState<"all" | "active" | "expired">("active");
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

  const topChars = useMemo(
    () =>
      (charactersData as Array<{ id: string; name: string; nameEn: string; attribute: string; tierRank?: string; image?: string }>)
        .filter((c) => c.tierRank === "SS" || c.tierRank === "S+")
        .slice(0, 8),
    []
  );

  const latestPosts = useMemo(
    () =>
      [...(blogData as Array<{ id: string; title: string; titleEn: string; summary: string; summaryEn: string; category: string; categoryEn: string; date: string; tags: string[] }>)]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    []
  );

  const filteredCodes = codes.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (region !== "all" && c.region !== region) return false;
    return true;
  });
  const activeCount = codes.filter((c) => c.status === "active").length;
  const expiredCount = codes.filter((c) => c.status === "expired").length;
  const cnCount = codes.filter((c) => c.region === "cn").length;
  const globalCount = codes.filter((c) => c.region === "global").length;

  const activeCodeList = codes.filter(c => c.status === "active").map(c => c.code).join("、");
  const activeCodeListEn = codes.filter(c => c.status === "active").map(c => c.code).join(", ");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Quick Answer — GEO-optimized structured summary for AI engines */}
      <QuickAnswerCard
        locale={locale}
        items={isZhLocale(locale) ? [
          {
            label: locale === "tw" ? "異環有效兌換碼：" : "异环有效兑换码：",
            value: `${activeCodeList}${locale === "tw" ? "（國際服）" : "（国际服）"}`,
          },
          {
            label: locale === "tw" ? "如何兌換：" : "如何兑换：",
            value: locale === "tw" ? "遊戲內點擊頭像 → 設定 → 兌換碼輸入框。" : "游戏内点击头像 → 设置 → 兑换码输入框。",
          },
        ] : [
          {
            label: "Active NTE Codes:",
            value: `${activeCodeListEn} (Global server)`,
          },
          {
            label: "How to redeem:",
            value: "In-game, tap your profile icon → Settings → enter code in the Redeem Code field.",
          },
        ]}
        footer={isZhLocale(locale)
          ? (locale === "tw" ? `共 ${activeCount} 個有效碼 · ${codes.length} 個總碼數 · 頁面即時更新` : `共 ${activeCount} 个有效码 · ${codes.length} 个总码数 · 页面实时更新`)
          : `${activeCount} active codes · ${codes.length} total · Updated in real-time`}
      />

      <div className="mb-6">
        <KardzPromoCard locale={locale} variant="banner" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <p className="text-xs text-gray-500">{t(locale, "redeemCodes.total")}</p>
          <p className="text-lg font-bold text-gray-300">{codes.length}</p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
          <p className="text-xs text-gray-500">{t(locale, "redeemCodes.active")}</p>
          <p className="text-lg font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500">{t(locale, "redeemCodes.expired")}</p>
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
            {t(locale, `redeemCodes.filter_${f}`)}
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
              ? t(locale, "redeemCodes.filter_all")
              : `${t(locale, REGION_LABEL_KEYS[r] as `redeemCodesStatus.${string}`)} (${r === "cn" ? cnCount : globalCount})`}
          </button>
        ))}
      </div>

      {/* Codes List */}
      <div className="space-y-3">
        {filteredCodes.map((code) => {
          const config = STATUS_CONFIG[code.status] || STATUS_CONFIG.unknown;
          const reward = isZhLocale(locale) ? code.reward : code.rewardEn;
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
                      {t(locale, config.labelKey as `status.${string}`)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {t(locale, REGION_LABEL_KEYS[code.region as keyof typeof REGION_LABEL_KEYS] as `redeemCodesStatus.${string}`) || code.region}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 ${isExpired ? "text-gray-600" : "text-gray-300"}`}>
                    {t(locale, "redeemCodes.reward")}: {reward}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      {t(locale, "redeemCodes.expires")}: {code.expiresAt}
                    </span>
                    {code.status === "active" && getCountdown(code.expiresAt) && (() => {
                      const cd = getCountdown(code.expiresAt)!;
                      const isUrgent = cd.days < 7;
                      return (
                        <span className={`px-1.5 py-0.5 rounded ${isUrgent ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-gray-800 text-gray-400"}`}>
                          {isUrgent ? "⚠ " : ""}
                          {isZhLocale(locale) ? `剩余 ${cd.days}天${cd.hours}小时` : `${cd.days}d ${cd.hours}h left`}
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
                    ? t(locale, "redeemCodes.copied")
                    : t(locale, "redeemCodes.copy")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Redeem */}
      <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-lg font-bold mb-4">{t(locale, "redeemCodes.howToTitle")}</h2>
        <ol className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">1.</span>
            <span>{t(locale, "redeemCodes.step1")}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">2.</span>
            <span>{t(locale, "redeemCodes.step2")}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">3.</span>
            <span>{t(locale, "redeemCodes.step3")}</span>
          </li>
        </ol>
      </div>

      {/* FAQ Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          {isZhLocale(locale)
            ? (locale === "tw" ? "兌換碼常見問題" : "兑换码常见问题")
            : "Redeem Codes FAQ"}
        </h2>
        <div className="space-y-3">
          {(isZhLocale(locale)
            ? (locale === "tw"
              ? [
                  { q: "異環兌換碼怎麼用？在哪裡輸入？", a: "進入遊戲後，點擊右上角頭像 → 設定 → 兌換碼輸入框，輸入有效的兌換碼即可領取獎勵。建議開服後第一時間兌換，避免過期。" },
                  { q: "異環國際服兌換碼有哪些？", a: "目前國際服有效兌換碼包括 NTENOWTOENJOY、NTENANALLYGO、NTE0429 等，有效期至2026年5月。請以本頁面最新資訊為準。" },
                  { q: "異環兌換碼過期了怎麼辦？", a: "兌換碼有使用期限，過期後無法使用。請關注官方直播和社群活動獲取新兌換碼，本頁面也會即時更新。" },
                  { q: "異環前瞻直播兌換碼有哪些？", a: "公測前瞻直播（4月18日）公布了國服3個和國際服3個兌換碼。國服碼有效期至5月7日，國際服碼有效期至5月29日。" },
                ]
              : [
                  { q: "异环兑换码在哪里输入？怎么用？", a: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效的兑换码即可领取奖励。建议开服后第一时间兑换，避免过期。" },
                  { q: "异环国际服兑换码有哪些？", a: "目前国际服有效兑换码包括 NTENOWTOENJOY、NTENANALLYGO、NTE0429 等，有效期至2026年5月。请以本页面最新信息为准。" },
                  { q: "异环开服兑换码有哪些？公测码是多少？", a: "异环公测兑换码分为国服和国际服两组。国服：YHNOWTOENJOY、YHNANALLYGO、YHOB0423（有效期至5月7日）。国际服：NTENOWTOENJOY、NTENANALLYGO、NTE0429（有效期至5月29日）。" },
                  { q: "异环前瞻直播兑换码有哪些？", a: "公测前瞻直播（4月18日）公布了国服3个和国际服3个兑换码。国服码有效期至5月7日，国际服码有效期至5月29日。后续直播活动可能发布更多兑换码。" },
                ])
            : [
                { q: "How to redeem codes in Neverness to Everness?", a: "Launch the game, tap your profile icon (top-right) → Settings → enter the code in the Redeem Code field. Redeem immediately after launch to avoid expiration." },
                { q: "What are the active NTE redeem codes for Global server?", a: "Active Global codes include NTENOWTOENJOY, NTENANALLYGO, and NTE0429, valid through May 2026. Check this page for the latest updates." },
                { q: "Do NTE redeem codes expire?", a: "Yes, all redeem codes have expiration dates and some have usage limits. Redeem them as soon as possible after the game launches." },
                { q: "Where do I find new NTE redeem codes?", a: "New codes are announced during official livestreams, social media events, and partner promotions. This page is updated in real-time with all available codes." },
              ]
          ).map((item, i) => (
            <details key={i} className="group rounded-xl border border-gray-800 bg-gray-900/50">
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-200 hover:text-primary-400 transition-colors list-none flex items-center gap-2">
                <span className="text-primary-400 group-open:rotate-90 transition-transform">▸</span>
                {item.q}
              </summary>
              <div className="px-4 pb-3 text-sm text-gray-400">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Module A: Next Steps */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">{t(locale, "redeemCodes.nextSteps.title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {([
            { key: "tierList", href: `/${lang}/tier-list` },
            { key: "reroll", href: `/${lang}/guides/reroll-guide-detailed` },
            { key: "beginner", href: `/${lang}/guides/beginner-guide` },
            { key: "teamBuilding", href: `/${lang}/guides/team-building` },
            { key: "cnVsGlobal", href: `/${lang}/cn-vs-global` },
          ] as const).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/40 hover:bg-gray-900/80 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
                {t(locale, `redeemCodes.nextSteps.${item.key}` as `redeemCodes.nextSteps.${string}`)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {t(locale, `redeemCodes.nextSteps.${item.key}Desc` as `redeemCodes.nextSteps.${string}`)}
              </p>
              <span className="text-xs text-primary-400/60 group-hover:text-primary-400 mt-2 inline-block">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Guides */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          {isZhLocale(locale)
            ? (locale === "tw" ? "熱門攻略" : "热门攻略")
            : "Popular Guides"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            {
              href: `/${lang}/faq/multiplayer-coop`,
              title: isZhLocale(locale) ? (locale === "tw" ? "多人聯機攻略" : "多人联机攻略") : "Is NTE Multiplayer? Co-op Guide",
              desc: isZhLocale(locale) ? (locale === "tw" ? "4人聯機、跨平台、組隊方法" : "4人联机、跨平台、组队方法") : "4-player co-op, cross-platform & how to team up",
            },
            {
              href: `/${lang}/guides/download-install-guide`,
              title: isZhLocale(locale) ? (locale === "tw" ? "下載安裝指南" : "下载安装指南") : "How to Download NTE",
              desc: isZhLocale(locale) ? (locale === "tw" ? "PC、PS5、手機安裝教程" : "PC、PS5、手机安装教程") : "PC, PS5, Mobile install guide & system requirements",
            },
            {
              href: `/${lang}/guides/vehicle-system-guide`,
              title: isZhLocale(locale) ? (locale === "tw" ? "載具系統攻略" : "载具系统攻略") : "NTE Vehicles & Driving Guide",
              desc: isZhLocale(locale) ? (locale === "tw" ? "車輛獲取、駕駛技巧" : "车辆获取、驾驶技巧") : "How to get cars, driving controls & racing events",
            },
          ]).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/40 hover:bg-gray-900/80 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              <span className="text-xs text-primary-400/60 group-hover:text-primary-400 mt-2 inline-block">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Module B: Top Characters */}
      {topChars.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t(locale, "redeemCodes.topCharacters.title")}</h2>
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
                    alt={isZhLocale(locale) ? c.name : c.nameEn}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate group-hover:text-primary-400 transition-colors">
                    {isZhLocale(locale) ? c.name : c.nameEn}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getAttributeColor(c.attribute)}`}>
                      {t(locale, `attributes.${c.attribute}` as `attributes.${string}`)}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                      {c.tierRank || "S"}
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
            {t(locale, "redeemCodes.topCharacters.viewAll")}
          </Link>
        </div>
      )}

      {/* Module C: Latest Posts */}
      {latestPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t(locale, "redeemCodes.latestPosts.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${lang}/blog/${post.id}`}
                className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary-600/20 text-primary-400">
                    {isZhLocale(locale) ? post.category : (post.categoryEn || post.category)}
                  </span>
                  <time className="text-xs text-gray-500">{post.date}</time>
                </div>
                <h3 className="text-sm font-semibold text-gray-200 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {isZhLocale(locale) ? post.title : post.titleEn}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {isZhLocale(locale) ? post.summary : post.summaryEn}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
