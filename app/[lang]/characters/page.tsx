import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { CharacterFilter } from "../../../components/CharacterFilter";
import { KardzPromoCard } from "../../../components/KardzPromoCard";
import { localizedText } from "../../../lib/seo-copy";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const recordedCount = getAvailableCharacters().length;
  const title = localizedText(
    locale,
    `异环历史角色索引 - ${recordedCount} 条角色资料与关联字段`,
    `NTE Historical Characters - ${recordedCount} Recorded Character References`
  );
  const description = localizedText(
    locale,
    `异环 ${recordedCount} 条历史角色资料，整理记录中的定位、构筑、配队和评级字段；当前可用性、技能、材料与投入价值请以目标区服客户端为准。`,
    `Browse ${recordedCount} historical NTE character records with role, build, team, and tier fields. Verify current availability, skills, materials, and investment value in the target server's client.`
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("characters", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CharactersPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const allCharacters = getAllCharacters();
  const priorityLinks = [
    { id: "canhong", en: "Canhong NTE guide", zh: "残虹材料攻略", tw: "殘虹材料攻略" },
    { id: "zhenhong", en: "Zhenhong NTE guide", zh: "真红攻略", tw: "真紅攻略" },
    { id: "shinku", en: "Shinku NTE guide", zh: "沁红攻略", tw: "沁紅攻略" },
    { id: "black-bird", en: "Black Bird NTE guide", zh: "黑鸟攻略", tw: "黑鳥攻略" },
    { id: "akane", en: "Akane NTE guide", zh: "Akane 攻略", tw: "Akane 攻略" },
    { id: "lingko", en: "Lingko NTE guide", zh: "凛子攻略", tw: "凛子攻略" },
    { id: "illica", en: "Illica NTE guide", zh: "伊洛伊攻略", tw: "伊洛伊攻略" },
    { id: "renee", en: "Renee NTE guide", zh: "蕾妮攻略", tw: "蕾妮攻略" },
    { id: "nitsa", en: "Nitsa NTE guide", zh: "尼察攻略", tw: "尼察攻略" },
    { id: "nixia", en: "Nixia NTE guide", zh: "尼夏攻略", tw: "尼夏攻略" },
  ].filter((link) => allCharacters.some((character) => character.id === link.id));

  return (
    <>
      <ItemListJsonLd
        items={characters.map((c) => ({
          name: isZhLocale(locale) ? c.name : c.nameEn,
          url: `https://nteguide.com/${lang}/characters/${c.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.characters") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "characters.title")}</h1>
        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? (locale === "tw" ? "這頁角色圖鑑最適合怎麼看？" : "这页角色图鉴最适合怎么用？") : "How should you use this character index?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "這裡只用於篩選站內歷史屬性、定位與角色欄位。單角色頁中的構築、隊伍、材料和評級也屬於歷史資料；目前可用性、技能、卡池與投入決策請以目標區服客戶端和官方公告為準。"
                  : "这里只用于筛选站内历史属性、定位与角色字段。单角色页中的构筑、队伍、材料和评级也属于历史资料；当前可用性、技能、卡池与投入决策请以目标区服客户端和官方公告为准。")
              : "Use this page only to filter historical role and character fields. Builds, teams, materials, and tier fields on character pages are historical too; verify current availability, skills, banners, and investment decisions with the target server's client and official notices."}
          </p>
        </section>
        <div className="mb-6">
          <KardzPromoCard locale={locale} variant="banner" />
        </div>
        {priorityLinks.length > 0 && (
          <nav className="mb-6 rounded-xl border border-gray-800 bg-gray-900/40 p-4" aria-label={isZhLocale(locale) ? "热门角色攻略" : "Popular NTE character guides"}>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">
              {isZhLocale(locale) ? (locale === "tw" ? "熱門搜尋" : "热门搜索") : "Popular searches"}
            </p>
            <div className="flex flex-wrap gap-2">
              {priorityLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/${lang}/characters/${link.id}`}
                  className="rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors"
                >
                  {locale === "tw" ? link.tw : isZhLocale(locale) ? link.zh : link.en}
                </Link>
              ))}
            </div>
          </nav>
        )}
        <CharacterFilter characters={characters} locale={locale} lang={lang} />

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? (locale === "tw" ? "目前選角前先核對" : "当前选角前先核对") : "Verify this before choosing a character"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "客戶端中目標角色是否存在、是否可獲得，以及卡池或活動期限。" : "客户端中目标角色是否存在、是否可获得，以及卡池或活动期限。") : "Whether the target character exists and is obtainable in the client, including banner or event dates."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "目前技能、命座、裝備效果、等級上限和材料需求。" : "当前技能、命座、装备效果、等级上限和材料需求。") : "Current skills, upgrades, equipment effects, level caps, and material requirements."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "目前隊伍成員與元素觸發是否仍可用，而非依賴歷史評級。" : "当前队伍成员与元素触发是否仍可用，而非依赖历史评级。") : "Whether current team members and element triggers still work, rather than relying on historical tier fields."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? (locale === "tw" ? "常見誤區" : "常见误区") : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把歷史強度、構築或隊伍欄位當成目前抽取結論。" : "把历史强度、构筑或队伍字段当成当前抽取结论。") : "Treating historical tier, build, or team fields as current pull conclusions."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "將本站的『可用』篩選視為遊戲內目前可用狀態。" : "将本站的“可用”筛选视为游戏内当前可用状态。") : "Treating the site’s available filter as live in-game availability."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "未核對客戶端與官方公告就升級、刷取或消費。" : "未核对客户端与官方公告就升级、刷取或消费。") : "Upgrading, farming, or spending without checking the client and official notices."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
