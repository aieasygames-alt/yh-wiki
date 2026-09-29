import { hreflangAlternates, t, Locale, isZhLocale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "mapPage.seoTitle"),
    description: t(locale, "mapPage.seoDescription"),
    alternates: hreflangAlternates("map", lang),
    openGraph: {
      title: t(locale, "mapPage.seoTitle"),
      description: t(locale, "mapPage.seoDescription"),
      type: "website",
    },
  };
}

export default function MapLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "互動地圖最適合拿來解決什麼問題？" : "互动地图最适合拿来解决什么问题？")
    : "What is the interactive map best at solving?";
  const introBody = isZh
    ? (locale === "tw"
        ? "異環互動地圖提供站內記錄的歷史標記、篩選與瀏覽器本地進度工具。它不驗證目前坐標、收集物、商店、Boss、任務、掉落或活動狀態；出發前請在目標區服客戶端核對。"
        : "异环互动地图提供站内记录的历史标记、筛选与浏览器本地进度工具。它不验证当前坐标、收集物、商店、Boss、任务、掉落或活动状态；出发前请在目标区服客户端核对。")
    : "The interactive map provides site-recorded historical markers, filters, and browser-local progress tools. It does not verify current coordinates, collectibles, shops, bosses, quests, drops, or event status; confirm them in the target server's client before acting.";
  const notesTitle = isZh
    ? (locale === "tw" ? "打開地圖前先想好這幾件事" : "打开地图前先想好这几件事")
    : "Think about these before you start";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先在客戶端確認目標標記仍存在、可到達且符合目前解鎖條件。"
          : "先在客户端确认目标标记仍存在、可到达且符合当前解锁条件。",
        locale === "tw"
          ? "本頁的路線與統計來自歷史標記資料，不能用來推斷目前材料、商店、Boss 或活動的刷新。"
          : "本页的路线与统计来自历史标记资料，不能用来推断当前材料、商店、Boss 或活动的刷新。",
        locale === "tw"
          ? "收集進度只儲存在目前瀏覽器，且不代表遊戲內完成狀態。"
          : "收集进度只储存在当前浏览器，且不代表游戏内完成状态。",
      ]
    : [
        "Confirm in the client that a target marker still exists, is reachable, and meets current unlock conditions.",
        "Routes and statistics on this page come from historical marker data and cannot establish current material, shop, boss, or event refreshes.",
        "Collection progress is stored only in this browser and does not represent in-game completion.",
      ];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-3 text-sm text-gray-300">
        <h2 className="text-xl font-semibold text-white">{introTitle}</h2>
        <p className="mt-3 leading-7">{introBody}</p>
      </section>
      {children}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">{notesTitle}</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
