import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getAllFaqs } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqPageJsonLd, ArticleJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { ArticleContent } from "../../../components/ArticleContent";
import { TableOfContents, TableOfContentsDesktop, extractHeadings } from "../../../components/TableOfContents";
import { FaqSection } from "../../../components/FaqSection";

const GAMEPLAY_FAQ_IDS = [
  "multiplayer-coop",
  "nte-vehicles-cars-guide",
  "ride-assault-guide",
];

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環遊戲玩法概覽 — 開放世界、戰鬥、抽卡、載具全介紹 | NTE Guide"
      : "异环游戏玩法概览 — 开放世界、战斗、抽卡、载具全介绍 | NTE Guide")
    : "Neverness to Everness Gameplay — Open World, Combat, Gacha & Vehicles";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環（NTE）完整玩法介紹：開放世界探索、元素反應戰鬥、抽卡系統（無50/50）、載具駕駛、房屋建造、多人聯機等核心系統一覽。"
      : "异环（NTE）完整玩法介绍：开放世界探索、元素反应战斗、抽卡系统（无50/50）、载具驾驶、房屋建造、多人联机等核心系统一览。")
    : "Complete gameplay overview for Neverness to Everness: open-world exploration, elemental combat, gacha (no 50/50), vehicles, housing, co-op and more.";
  return {
    title,
    description,
    alternates: hreflangAlternates("gameplay", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function GameplayPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const allFaqs = getAllFaqs();
  const faqs = GAMEPLAY_FAQ_IDS
    .map((id) => allFaqs.find((f) => f.id === id))
    .filter(Boolean)
    .map((f) => ({
      question: f!.question,
      questionZh: f!.question,
      answer: f!.answer,
      answerZh: f!.answer,
    }));

  // Build gameplay overview content
  const gameplayContent = isZhLocale(locale)
    ? `## 异环（NTE）游戏玩法概览

异环（Neverness to Everness）是由完美世界 Hotta Studio 开发的都市奇幻开放世界动作 RPG。游戏融合了开放世界探索、元素反应战斗、抽卡角色收集、载具驾驶和多人联机等多种玩法系统。

## 开放世界探索

异环的世界设定在一个超自然的都市环境中，玩家可以自由探索城市街道、异空间和其他神秘区域。游戏支持完整的昼夜循环和天气系统，为探索增添沉浸感。世界散布着宝箱、隐藏任务、收集品和世界 Boss 等丰富内容。

## 元素反应战斗系统

战斗是异环的核心亮点。游戏采用元素反应机制，鼓励玩家根据敌人属性搭配队伍。每个角色拥有独特的技能组合，闪避机制在精准时机触发完美闪避奖励。连锁攻击和爆发技能创造高伤害窗口，战斗节奏紧凑且富有策略性。

## 抽卡系统（无 50/50）

异环的抽卡系统相比同类游戏更加友好：没有 50/50 机制，90 抽保底必定获得当期限定角色。新手还有 20 抽自选 S 级角色的福利。这使得零氪和微氪玩家的角色收集更加可预期。

## 载具系统

异环是少数拥有完整载具驾驶系统的二次元游戏。玩家可以在开放世界中驾驶各种载具自由行驶，包括与保时捷联名的限定车辆。载具拥有加速、漂移等真实物理手感，并支持跨平台驾驶操作。

## 房屋建造（City Tycoon）

游戏内置房屋建造和经营系统（City Tycoon 模式）。玩家可以购买房产、装修布置，并通过经营获得收入，最终可以免费获得 S 级角色。这是异环独有的长期养成系统。

## 多人联机

支持最多 4 人在线合作，包括 Pink Paws 社交小队系统。全平台（PC、手机、PS5）数据互通，可跨平台联机游戏。`
    : `## Neverness to Everness Gameplay Overview

Neverness to Everness (NTE) is an urban-fantasy open-world action RPG developed by Hotta Studio (Perfect World). The game combines open-world exploration, elemental combat, gacha character collection, vehicle driving, housing, and multiplayer co-op into a single cohesive experience.

## Open World Exploration

NTE is set in a supernatural urban environment where players freely explore city streets, otherworldly dimensions, and mysterious areas. The game features a full day-night cycle and weather system for immersive exploration. The open world is packed with chests, hidden quests, collectibles, and world bosses.

## Elemental Combat System

Combat is NTE's standout feature. The elemental reaction system encourages strategic team building based on enemy attributes. Each character has a unique skill kit, with dodge mechanics that reward precise timing through perfect dodge bonuses. Chain attacks and burst skills create exciting damage windows.

## Gacha System (No 50/50)

NTE's gacha system is notably player-friendly: there is NO 50/50 mechanic, meaning your 90-pull pity guarantees the featured character. New players also get a 20-pull S-rank selector, making character collection more predictable for F2P and low-spend players.

## Vehicle System

NTE is one of the few anime games with a full vehicle driving system. Players can drive various vehicles in the open world, including a Porsche collaboration car. Vehicles feature realistic physics with acceleration, drifting, and cross-platform controls.

## Housing & City Tycoon

The built-in housing and management system (City Tycoon mode) lets players buy property, decorate homes, and earn income through management — eventually earning a free S-rank character. This is NTE's unique long-term progression system.

## Multiplayer Co-op

Supports up to 4-player online co-op including the Pink Paws social squad system. Full cross-platform save and cross-play across PC, mobile, and PS5.`;

  const headings = extractHeadings(gameplayContent);

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环游戏玩法概览" : "Neverness to Everness Gameplay Overview"}
        description={isZhLocale(locale)
          ? (locale === "tw"
            ? "異環核心玩法總覽：開放世界探索、戰鬥、抽卡、載具、房屋與多人聯機介紹"
            : "异环核心玩法总览：开放世界探索、战斗、抽卡、载具、房屋与多人联机介绍")
          : "Complete gameplay overview: open world, combat, gacha, vehicles, housing, and more"}
        url={`https://nteguide.com/${lang}/gameplay`}
      />
      {faqs.length > 0 && <FaqPageJsonLd faqs={faqs} lang={locale} />}
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "遊戲概覽" : "游戏概览") : "Gameplay" },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <TableOfContents headings={headings} />
        <TableOfContentsDesktop headings={headings} />
        <h1 className="text-2xl font-bold mb-2">
          {isZhLocale(locale)
            ? (locale === "tw" ? "異環遊戲玩法概覽" : "异环游戏玩法概览")
            : "Neverness to Everness Gameplay Overview"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isZhLocale(locale)
            ? (locale === "tw"
              ? "異環（NTE）核心玩法系統全面介紹：開放世界探索、元素戰鬥、抽卡、載具、房屋建造與多人聯機。"
              : "异环（NTE）核心玩法系统全面介绍：开放世界探索、元素战斗、抽卡、载具、房屋建造和多人联机。")
            : "Complete guide to all NTE gameplay systems: open-world, combat, gacha, vehicles, housing, and multiplayer."}
        </p>

        {/* Quick Answer for Featured Snippet */}
        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZhLocale(locale) ? "游戏类型：" : "Genre:",
              value: isZhLocale(locale) ? "开放世界动作 RPG" : "Open-world action RPG",
            },
            {
              label: isZhLocale(locale) ? "开发商：" : "Developer:",
              value: "Hotta Studio (Perfect World)",
            },
            {
              label: isZhLocale(locale) ? "平台：" : "Platforms:",
              value: "PC, Android, iOS, PS5",
            },
            {
              label: isZhLocale(locale) ? "付费模式：" : "Monetization:",
              value: isZhLocale(locale) ? "免费游玩 + 抽卡（无50/50）" : "Free to play + gacha (no 50/50)",
            },
            {
              label: isZhLocale(locale) ? "联机：" : "Multiplayer:",
              value: isZhLocale(locale) ? "最多 4 人合作" : "Up to 4-player co-op",
            },
          ]}
        />

        {/* Main Content */}
        <ArticleContent content={gameplayContent} lang={lang} />

        {/* Key Features Grid */}
        <section className="mb-10 mt-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "核心玩法系统一览" : "Key Gameplay Systems"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: "⚔️", label: isZhLocale(locale) ? "元素战斗" : "Elemental Combat", href: `/${lang}/guides/elemental-reactions` },
              { icon: "🎰", label: isZhLocale(locale) ? "抽卡系统" : "Gacha System", href: `/${lang}/guides/gacha-system` },
              { icon: "🏆", label: isZhLocale(locale) ? "强度排行" : "Tier List", href: `/${lang}/tier-list` },
              { icon: "🚗", label: isZhLocale(locale) ? "载具系统" : "Vehicles", href: `/${lang}/vehicles` },
              { icon: "🏠", label: isZhLocale(locale) ? "房屋建造" : "Housing", href: `/${lang}/guides/housing-system-guide` },
              { icon: "👥", label: isZhLocale(locale) ? "多人联机" : "Multiplayer", href: `/${lang}/multiplayer` },
              { icon: "🗺️", label: isZhLocale(locale) ? "互动地图" : "Map", href: `/${lang}/map` },
              { icon: "🎮", label: isZhLocale(locale) ? "配置要求" : "System Requirements", href: `/${lang}/system-requirements` },
              { icon: "📱", label: isZhLocale(locale) ? "下载安装" : "Download", href: `/${lang}/guides/download-install-guide` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-4 hover:border-primary-500/50 transition-colors text-center"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {isZhLocale(locale) ? "常见问题" : "FAQ"}
            </h2>
            <FaqSection faqs={faqs} locale={locale} />
          </section>
        )}

        {/* Related Links */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-bold mb-4">
            {isZhLocale(locale) ? "深入了解更多" : "Learn More"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: isZhLocale(locale) ? "角色一览" : "All Characters", href: `/${lang}/characters` },
              { label: isZhLocale(locale) ? "武器一览" : "Weapons", href: `/${lang}/weapons` },
              { label: isZhLocale(locale) ? "新手攻略" : "Beginner Guide", href: `/${lang}/guides/beginner-quick-start` },
            ].map((link) => (
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
