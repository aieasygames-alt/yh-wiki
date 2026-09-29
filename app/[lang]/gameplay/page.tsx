import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../components/JsonLd";
import { ArticleContent } from "../../../components/ArticleContent";
import { TableOfContents, TableOfContentsDesktop, extractHeadings } from "../../../components/TableOfContents";

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
      ? "異環玩法歷史資料｜系統線索與版本覆核"
      : "异环玩法历史资料｜系统线索与版本复核")
    : "NTE Gameplay History | System Records & Version Verification";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環（NTE）玩法歷史資料，整理曾被提及的探索、戰鬥、角色取得、載具、房屋與聯機系統。規則、平台與獎勵須以目標客戶端及官方公告覆核。"
      : "异环（NTE）玩法历史资料，整理曾被提及的探索、战斗、角色获取、载具、房屋与联机系统。规则、平台与奖励须以目标客户端及官方公告复核。")
    : "Historical NTE gameplay records covering previously mentioned exploration, combat, character acquisition, vehicle, housing, and multiplayer systems. Verify rules, platforms, and rewards in your target client and official notices.";
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
  // Historical system mentions are retained as research leads, not current mechanics.
  const gameplayContent = isZhLocale(locale)
    ? `## 异环（NTE）玩法历史资料

本页汇总公开资料中曾出现过的玩法系统线索，包括探索、战斗、角色获取、载具、房屋和联机。它不证明这些系统已在当前客户端上线，也不确认具体规则、奖励、人数、平台或跨平台能力。

## 历史探索系统线索

过去资料曾描述都市街道、异空间与神秘区域等探索场景，也曾提及昼夜、天气、宝箱、任务、收集品和首领等元素。具体地图范围、刷新、开放条件和奖励结构需要在目标版本中逐项确认。

## 历史战斗系统线索

历史描述中出现过元素反应、角色技能、精准闪避、连锁攻击和爆发窗口等概念。它们只能作为查找官方演示、公告或当前教学的关键词，不能用来推断现行数值、配队、伤害机制或操作收益。

## 历史角色获取线索

过去内容曾讨论角色获取、限定角色、保底和新手奖励等机制。概率、保底次数、歪池规则、兑换条件、免费奖励和适用服务器均可能随版本改变；在抽取或消费前，应以游戏内详情和官方公告为唯一依据。

## 历史载具系统线索

公开材料曾展示载具驾驶、加速、漂移和联名车辆等内容。车辆清单、驾驶规则、获取方式、合作内容和可操作平台均需在当前客户端复核，不应依据旧资料安排货币或路线。

## 历史房屋与经营线索

历史内容曾提到房产、装修、经营和 City Tycoon 等名称。模式是否开放、投入成本、产出、奖励和角色获得条件都可能变化，不能将历史描述作为当前长期养成计划。

## 历史联机线索

过往资料出现过合作、社交小队和跨平台等表述，但联机人数、模式、存档互通、跨平台范围和服务地区必须以当前客户端与官方服务说明确认。`
    : `## NTE Gameplay History

This page gathers gameplay-system leads that have appeared in public material, including exploration, combat, character acquisition, vehicles, housing, and multiplayer. It does not establish that a system is live in the current client or confirm its rules, rewards, player count, platform support, or cross-platform capabilities.

## Historical exploration leads

Earlier material described urban streets, otherworldly spaces, and mysterious areas, along with day-night cycles, weather, chests, quests, collectibles, and bosses. Confirm map scope, refresh behavior, access conditions, and reward structures in the target version.

## Historical combat leads

Historical descriptions mentioned elemental reactions, character skills, precise dodges, chain attacks, and burst windows. Use these only as terms for finding current official demonstrations, notices, or tutorials; they cannot establish live values, team builds, damage rules, or input rewards.

## Historical character-acquisition leads

Earlier coverage discussed character acquisition, limited characters, pity, and newcomer rewards. Rates, pity counts, guarantee rules, exchange conditions, free rewards, and eligible servers can change by version; use in-game details and official notices as the only basis for pulls or spending.

## Historical vehicle-system leads

Public material previously showed vehicle driving, acceleration, drifting, and collaboration vehicles. Verify the roster, driving rules, acquisition methods, collaboration content, and supported platforms in the current client before planning currency use or routes.

## Historical housing and management leads

Historical material mentioned property, decoration, management, and the name City Tycoon. Mode availability, costs, outputs, rewards, and character conditions can all change, so this is not a current long-term progression plan.

## Historical multiplayer leads

Earlier coverage referred to co-op, social squads, and cross-platform play. Confirm player limits, modes, save sharing, cross-play scope, and service regions in the current client and official service information.`;

  const headings = extractHeadings(gameplayContent);

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环玩法历史资料" : "NTE Gameplay History"}
        description={isZhLocale(locale)
          ? (locale === "tw"
            ? "異環玩法歷史資料：探索、戰鬥、角色取得、載具、房屋與聯機線索"
            : "异环玩法历史资料：探索、战斗、角色获取、载具、房屋与联机线索")
          : "Historical gameplay records: exploration, combat, character acquisition, vehicles, housing, and multiplayer leads"}
        url={`https://nteguide.com/${lang}/gameplay`}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "玩法歷史資料" : "玩法历史资料") : "Gameplay history" },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <TableOfContents headings={headings} />
        <TableOfContentsDesktop headings={headings} />
        <h1 className="text-2xl font-bold mb-2">
          {isZhLocale(locale)
            ? (locale === "tw" ? "異環玩法歷史資料" : "异环玩法历史资料")
            : "NTE Gameplay History"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isZhLocale(locale)
            ? (locale === "tw"
              ? "曾被公開資料提及的玩法系統線索；規則、獎勵、平台與可用性都須以目前客戶端和官方公告覆核。"
              : "曾被公开资料提及的玩法系统线索；规则、奖励、平台与可用性都须以当前客户端和官方公告复核。")
            : "Gameplay-system leads from earlier public material; verify rules, rewards, platforms, and availability in the current client and official notices."}
        </p>

        <section className="mb-6 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {isZhLocale(locale) ? (locale === "tw" ? "歷史玩法線索，不能替代目前規則" : "历史玩法线索，不能替代当前规则") : "Historical gameplay leads do not replace current rules"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {isZhLocale(locale)
              ? (locale === "tw" ? "抽卡機率與保底、免費獎勵、聯機人數、跨平台、可用平台、系統開放條件與活動內容都有可能變動。在下載、抽取、消費或安排遊玩前，請以目標客戶端內說明與官方公告為準。" : "抽卡概率与保底、免费奖励、联机人数、跨平台、可用平台、系统开放条件与活动内容都有可能变动。在下载、抽取、消费或安排游玩前，请以目标客户端内说明与官方公告为准。")
              : "Rates and pity, free rewards, player limits, cross-play, supported platforms, unlock conditions, and event content can change. Before downloading, pulling, spending, or planning play, rely on in-client information and official notices for your target version."}
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁歷史資料最適合怎麼看？" : "这页历史资料最适合怎么用？")
              : "How should you use this historical reference?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "把這頁當作查找舊資料與官方關鍵詞的索引，再到目標客戶端、官方公告或可驗證的專題頁確認細節。它不適合替代目前版本的機制、抽卡、平台或聯機說明。"
                  : "把这页当作查找旧资料与官方关键词的索引，再到目标客户端、官方公告或可验证的专题页确认细节。它不适合替代当前版本的机制、抽卡、平台或联机说明。")
              : "Use this as an index for old material and official search terms, then confirm details in the target client, official notices, or verifiable dedicated pages. It cannot replace current mechanic, gacha, platform, or multiplayer information."}
          </p>
        </section>

        <section className="my-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "確認目前版本時先看什麼" : "确认当前版本时先看什么")
                : "What to check in the current version"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "目標伺服器是否可下載、是否已開服，以及目前支援的平台與地區。" : "目标服务器是否可下载、是否已开服，以及当前支持的平台与地区。") : "Whether the target server is downloadable and live, and which platforms and regions it currently supports."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "遊戲內的抽卡詳情、保底、機率、兌換、免費獎勵和角色取得條件。" : "游戏内的抽卡详情、保底、概率、兑换、免费奖励和角色获取条件。") : "In-client pull details, pity, rates, exchanges, free rewards, and character-acquisition conditions."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "目前已開放的玩法、聯機模式、人數限制、跨平台與存檔規則。" : "当前已开放的玩法、联机模式、人数限制、跨平台与存档规则。") : "Currently available systems, multiplayer modes, player limits, cross-play, and save rules."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把舊宣傳、測試內容或歷史資料視為已上線且適用於所有伺服器。" : "把旧宣传、测试内容或历史资料视为已上线且适用于所有服务器。") : "Assuming old marketing, test material, or historical records are live and apply to every server."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "依據過往保底、獎勵或免費角色說法直接安排抽取與消費。" : "依据过往保底、奖励或免费角色说法直接安排抽取与消费。") : "Planning pulls or spending from past claims about pity, rewards, or free characters."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "沒有先確認平台、地區、聯機與存檔規則就決定下載或邀請朋友。" : "没有先确认平台、地区、联机与存档规则就决定下载或邀请朋友。") : "Deciding to download or invite friends before checking current platform, region, multiplayer, and save rules."}</li>
            </ul>
          </div>
        </section>

        {/* Main Content */}
        <ArticleContent content={gameplayContent} lang={lang} />

        {/* Key Features Grid */}
        <section className="mb-10 mt-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "历史系统资料入口" : "Historical system reference links"}
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
