import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../components/JsonLd";
import { GiscusComments } from "../../../components/GiscusComments";
import { KardzPromoCard } from "../../../components/KardzPromoCard";
import { TierListView } from "../../../components/TierListView";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = locale === "en"
    ? "NTE Character Comparison Archive | Historical Tier Context"
    : t(locale, "tierList.seoTitle");
  const description = locale === "en"
    ? "Historical NTE character comparison by overall, Abyss, Anomaly, and Open World contexts. Check the target server's in-game data before investing or pulling."
    : t(locale, "tierList.seoDescription");
  return {
    title,
    description,
    alternates: hreflangAlternates("tier-list", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function TierListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const isZh = isZhLocale(locale);
  const zhTitle = locale === "tw" ? "異環角色對比檔案｜歷史場景評級" : "异环角色对比档案｜历史场景评级";
  const zhUpdated = locale === "tw" ? "歷史資料複核：2026年9月29日" : "历史资料复核：2026年9月29日";

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "tierList.title") },
        ]}
      />
      <ArticleJsonLd
        title={isZh ? zhTitle : "NTE Character Comparison Archive"}
        description={isZh
          ? (locale === "tw"
            ? `以 ${characters.length} 位角色的歷史資料，對比綜合、深淵、異象與大世界場景`
            : `以 ${characters.length} 位角色的历史资料，对比综合、深渊、异象与大世界场景`)
          : `Historical comparison of ${characters.length} characters across overall, Abyss, Anomaly, and Open World contexts`}
        url={`https://nteguide.com/${lang}/tier-list`}
        datePublished="2026-05-23"
        dateModified="2026-09-29"
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? zhTitle : "NTE Character Comparison Archive"}
        </h1>
        <time className="text-xs text-gray-500 block mb-1" dateTime="2026-09-29">
          {isZh ? zhUpdated : "Historical data reviewed September 29, 2026"}
        </time>
        <p className="text-gray-400 mb-8">
          {isZh
            ? (locale === "tw"
              ? `本页保留 ${characters.length} 位角色的历史场景对比，参考技能、队伍适配、机制应对和泛用性。它不是当前版本的抽取或养成结论。`
              : `本頁保留 ${characters.length} 位角色的歷史場景對比，參考技能、隊伍適配、機制應對和泛用性。它不是目前版本的抽取或養成結論。`)
            : `This page preserves historical scenario comparisons for ${characters.length} characters, using skill, team-fit, mechanics, and versatility context. It is not a current pull or investment verdict.`}
        </p>

        <section className="mb-8 rounded-xl border border-amber-500/25 bg-amber-500/10 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh ? (locale === "tw" ? "先用這份資料，再決定是否投入" : "先用这份资料，再决定是否投入") : "Use this archive before making an investment decision"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{isZh ? (locale === "tw" ? "先在目標區服客戶端核對角色是否可獲取、技能數值、卡池規則與近期調整。" : "先在目标区服客户端核对角色是否可获取、技能数值、卡池规则与近期调整。") : "First verify availability, skill values, banner rules, and recent balance changes in the target server's client."}</li>
            <li>{isZh ? (locale === "tw" ? "依你要打的內容、現有隊伍和操作習慣比較角色功能，不把單一檔位當作通用答案。" : "按你要打的内容、现有队伍和操作习惯比较角色功能，不把单一档位当作通用答案。") : "Compare character roles against your content goals, roster, and playstyle instead of treating one tier as a universal answer."}</li>
            <li>{isZh ? (locale === "tw" ? "抽取、覺醒或武器投入前，先確認目前資源和下一個目標，避免依賴舊榜單做不可逆消費。" : "抽取、觉醒或武器投入前，先确认当前资源和下一个目标，避免依赖旧榜单做不可逆消费。") : "Before pulls, awakenings, or weapon spending, check your current resources and next goal instead of relying on an old ranking."}</li>
          </ul>
        </section>

        <TierListView characters={characters} locale={locale} lang={lang} />

        {isZh && (
          <div className="mt-8 p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-bold mb-4">
              {locale === "tw" ? "歷史自選討論如何參考" : "历史自选讨论如何参考"}
            </h2>
            <p className="text-gray-400 mb-3">
              {locale === "tw"
                ? "過去的自選池節點、可選範圍與角色評價都可能已改變。下面僅保留當時的角色功能觀察，不代表目前仍存在相同自選機會或優先順序："
                : "过去的自选池节点、可选范围与角色评价都可能已改变。下面仅保留当时的角色功能观察，不代表当前仍存在相同自选机会或优先顺序："}
            </p>
            <ul className="space-y-2 text-gray-300">
              {locale === "tw" ? (
                <>
                  <li><strong>娜娜莉（Nanally）：</strong>歷史資料中以單體輸出與站場主C功能受關注。</li>
                  <li><strong>九原（Jiuyuan）：</strong>歷史資料中以聚怪與隊伍功能性受關注；實際技能與覺醒效果請核對客戶端。</li>
                  <li><strong>零（Zero）：</strong>歷史資料中以快切、輔助與功能位彈性受關注；是否免費及獲取條件需另行確認。</li>
                  <li><strong>穗鳥（Hotori）：</strong>歷史資料中常作為過渡或副輸出功能位討論，需按目前隊伍驗證。</li>
                </>
              ) : (
                <>
                  <li><strong>娜娜莉（Nanally）：</strong>历史资料中以单体输出与站场主C功能受关注。</li>
                  <li><strong>九原（Jiuyuan）：</strong>历史资料中以聚怪与队伍功能性受关注；实际技能与觉醒效果请核对客户端。</li>
                  <li><strong>零（Zero）：</strong>历史资料中以快切、辅助与功能位弹性受关注；是否免费及获取条件需另行确认。</li>
                  <li><strong>穗鸟（Hotori）：</strong>历史资料中常作为过渡或副输出功能位讨论，需按当前队伍验证。</li>
                </>
              )}
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              {locale === "tw"
                ? "請以客戶端目前自選頁面的可選範圍、規則和帳號缺口為準。"
                : "请以客户端当前自选页面的可选范围、规则和账号缺口为准。"}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-600 mt-8">
          {isZh
            ? (locale === "tw"
              ? "歷史評級僅用於理解舊版角色定位與場景差異。客戶端規則、數值、可獲取狀態與實戰環境優先於本頁檔位。"
              : "历史评级仅用于理解旧版角色定位与场景差异。客户端规则、数值、可获取状态与实战环境优先于本页档位。")
            : "Historical ratings help compare past roles and scenarios only. Client rules, values, availability, and the live gameplay environment take priority over every tier on this page."}
        </p>

        <div className="mt-6">
          <KardzPromoCard locale={locale} variant="compact" />
        </div>

        <div className="mt-6">
          <GiscusComments locale={locale} term="tier-list" />
        </div>
      </div>
    </>
  );
}
