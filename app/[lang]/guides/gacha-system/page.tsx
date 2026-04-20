import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import gachaSystemData from "../../../../data/gacha-system.json";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { FaqSection } from "../../../../components/FaqSection";
import { FaqPageJsonLd } from "../../../../components/JsonLd";

const locales: Locale[] = ["zh", "tw", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title =
    isZhLocale(locale)
      ? "异环抽卡系统详解 — 保底机制、概率分析与抽卡策略 | NTE Guide"
      : "NTE Gacha System — Rates, Pity & Best Pull Strategy | NTE Guide";
  const description =
    isZhLocale(locale)
      ? "全面解析异环(NTE)抽卡系统：无50/50机制、90抽保底、新手20抽自选、概率分析与零氪最优抽卡策略。"
      : "Complete guide to Neverness to Everness gacha system: no 50/50, 90-pull pity, beginner 20-pull selector, rates analysis and F2P strategy.";
  return {
    title,
    description,
    alternates: hreflangAlternates("guides/gacha-system", lang),
    openGraph: { title, description, type: "article" },
  };
}

interface Banner {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  sRate: string;
  aRate: string;
  bRate: string;
  hardPity: number;
  softPity: number | null;
  avgPity: number;
  no5050: boolean;
  maxPulls?: number;
  oneTimeOnly?: boolean;
  selectorAt?: number;
  pityFeatured?: number;
}

export default async function GachaSystemPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const banners = gachaSystemData.banners as Banner[];
  const faqs = gachaSystemData.faqs;

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.guides"), href: `/${lang}/guides` },
          {
            label: isZhLocale(locale) ? "抽卡系统详解" : "Gacha System Guide",
          },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* H1 */}
        <h1 className="text-2xl font-bold mb-6">
          {isZhLocale(locale)
            ? "异环抽卡系统详解：保底机制、概率分析与抽卡策略"
            : "NTE Gacha System — Complete Guide to Rates, Pity & Strategy"}
        </h1>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          {isZhLocale(locale)
            ? "异环（Neverness to Everness）的抽卡系统相比原神、鸣潮等同类游戏更加玩家友好：没有50/50机制，限定池首次S级必为UP角色。本文将详细解析所有卡池类型、概率、保底机制和最优抽卡策略。"
            : "NTE's gacha system is significantly more player-friendly than similar games like Genshin Impact and Wuthering Waves — there's no 50/50 mechanic, and your first S-rank on the limited banner is guaranteed to be the featured character. This guide covers all banner types, rates, pity mechanics, and optimal pull strategy."}
        </p>

        {/* Banner Types */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "卡池类型一览" : "Banner Types Overview"}
          </h2>
          <div className="space-y-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {isZhLocale(locale) ? b.nameZh : b.nameEn}
                  </h3>
                  {b.no5050 && (
                    <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400">
                      {isZhLocale(locale) ? "无50/50" : "No 50/50"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {isZhLocale(locale) ? b.descZh : b.descEn}
                </p>
                <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                  <div className="rounded bg-gray-800/50 p-2">
                    <div className="text-yellow-400 font-bold">{b.sRate}</div>
                    <div className="text-xs text-gray-500">
                      {isZhLocale(locale) ? "S级" : "S-Rank"}
                    </div>
                  </div>
                  <div className="rounded bg-gray-800/50 p-2">
                    <div className="text-purple-400 font-bold">{b.aRate}</div>
                    <div className="text-xs text-gray-500">
                      {isZhLocale(locale) ? "A级" : "A-Rank"}
                    </div>
                  </div>
                  <div className="rounded bg-gray-800/50 p-2">
                    <div className="text-blue-400 font-bold">{b.bRate}</div>
                    <div className="text-xs text-gray-500">
                      {isZhLocale(locale) ? "B级" : "B-Rank"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>
                    {isZhLocale(locale) ? "硬保底" : "Hard Pity"}:{" "}
                    <strong className="text-white">{b.hardPity}</strong>
                  </span>
                  {b.softPity && (
                    <span>
                      {isZhLocale(locale) ? "软保底" : "Soft Pity"}:{" "}
                      <strong className="text-white">{b.softPity}</strong>
                    </span>
                  )}
                  <span>
                    {isZhLocale(locale) ? "平均抽数" : "Avg Pulls"}:{" "}
                    <strong className="text-white">{b.avgPity}</strong>
                  </span>
                  {b.maxPulls && (
                    <span>
                      {isZhLocale(locale) ? "最大抽数" : "Max Pulls"}:{" "}
                      <strong className="text-white">{b.maxPulls}</strong>
                    </span>
                  )}
                  {b.selectorAt && (
                    <span>
                      {isZhLocale(locale) ? "自选节点" : "Selector At"}:{" "}
                      <strong className="text-white">{b.selectorAt}</strong>
                    </span>
                  )}
                  {b.pityFeatured && (
                    <span>
                      {isZhLocale(locale) ? "UP保底" : "Featured Pity"}:{" "}
                      <strong className="text-white">{b.pityFeatured}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pity System */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale)
              ? "保底机制详解"
              : "Pity System Explained"}
          </h2>
          <div className="text-gray-300 text-sm space-y-4 leading-relaxed">
            <p>
              {isZhLocale(locale)
                ? "异环的保底系统分为硬保底和软保底两种机制。硬保底是指在达到指定抽数后，必定获得S级角色。限定池和常驻池的硬保底均为90抽，新手池为20抽，武器池为60抽。"
                : "NTE's pity system has both hard pity and soft pity mechanics. Hard pity guarantees an S-rank at a specific pull count — 90 for limited/standard banners, 20 for beginner, and 60 for weapon banner."}
            </p>
            <p>
              {isZhLocale(locale)
                ? "软保底从第74抽开始（限定池），S级角色的出现概率会显著提升。根据大量玩家数据统计，大多数玩家在50-60抽之间就能获得S级角色，平均约53.5抽。这意味着实际上很少需要到90抽硬保底。"
                : "Soft pity starts at pull 74 (limited banner), significantly increasing S-rank rates. Based on player data, most players get an S-rank between 50-60 pulls, averaging around 53.5 pulls. This means you rarely need to reach the 90-pull hard pity."}
            </p>
            <p>
              {isZhLocale(locale)
                ? "最关键的是：异环限定池没有50/50机制！当你抽到S级角色时，必定是当期UP角色，不会出现「歪了」的情况。这使得异环成为目前同类游戏中对玩家最友好的抽卡系统之一。"
                : "Most importantly: NTE's limited banner has NO 50/50 system! When you pull an S-rank, it's guaranteed to be the featured character. You can never \"lose\" your 50/50. This makes NTE one of the most player-friendly gacha systems in the genre."}
            </p>
          </div>
        </section>

        {/* Gacha Strategy */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale)
              ? "最优抽卡策略"
              : "Best Gacha Strategy"}
          </h2>
          <div className="space-y-3">
            {(
              isZhLocale(locale)
                ? [
                    { step: "1", title: "新手池优先", desc: "20抽必出S级且可自选（薄荷或早雾），全游戏最高性价比，务必第一时间抽完。" },
                    { step: "2", title: "常驻池自然积累", desc: "使用免费赠送的常驻抽卡券，积累到50抽可自选S级角色。不需要花方斯（高级货币）。" },
                    { step: "3", title: "限定池按需抽取", desc: "根据当前Tier List和你的队伍需求选择UP角色。由于无50/50，90抽即可确保获得，规划更加可控。" },
                    { step: "4", title: "武器池量力而行", desc: "武器池对角色提升明显但不是必需。建议先确保核心角色到位，有余力再考虑专属武器。" },
                  ]
                : [
                    { step: "1", title: "Beginner Banner First", desc: "20 pulls for a guaranteed S-rank with selector (Mint or Sakiri) — the best value in the game. Do this immediately." },
                    { step: "2", title: "Standard Banner Naturally", desc: "Use free standard tickets to accumulate pulls. At 50 pulls you get an S-rank selector. No need to spend Phantom Amber here." },
                    { step: "3", title: "Limited Banner Strategically", desc: "Pull based on the current Tier List and your team needs. With no 50/50, 90 pulls guarantees the featured character — very plannable." },
                    { step: "4", title: "Weapon Banner if Budget Allows", desc: "Weapons provide noticeable power boosts but aren't essential. Secure core characters first, then consider signature weapons." },
                  ]
            ).map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-lg border border-gray-800 bg-gray-900/30 p-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "常见问题" : "Frequently Asked Questions"}
          </h2>
          <FaqSection faqs={faqs} locale={locale} />
          <FaqPageJsonLd faqs={faqs} lang={locale} />
        </section>

        {/* Internal Links */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-bold mb-4">
            {isZhLocale(locale) ? "相关内容" : "Related Content"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              isZhLocale(locale)
                ? [
                    { label: "Tier List 角色排行", href: `/${lang}/tier-list` },
                    { label: "抽卡模拟器", href: `/${lang}/gacha` },
                    { label: "新手攻略", href: `/${lang}/guides/beginner-quick-start` },
                  ]
                : [
                    { label: "Tier List", href: `/${lang}/tier-list` },
                    { label: "Gacha Simulator", href: `/${lang}/gacha` },
                    { label: "Beginner Guide", href: `/${lang}/guides/beginner-quick-start` },
                  ]
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
              >
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
