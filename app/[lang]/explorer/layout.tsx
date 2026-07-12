import { hreflangAlternates, t, Locale, isZhLocale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "explorer.seoTitle"),
    description: t(locale, "explorer.seoDescription"),
    alternates: hreflangAlternates("explorer", lang),
    openGraph: {
      title: t(locale, "explorer.seoTitle"),
      description: t(locale, "explorer.seoDescription"),
      type: "website",
    },
  };
}

export default function ExplorerLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "探索伴侶主要適合哪些玩家？" : "探索伴侣主要适合哪些玩家？")
    : "Who is the Explorer tool for?";
  const introBody = isZh
    ? (locale === "tw"
        ? "如果你在異環裡最常卡的是收集漏點、區域掃圖順序和每日/每週重置節奏，探索伴侶的用途就是把地圖標記、掃圖路線和個人進度集中到同一頁。它更像是長期補完工具，不只是一次性查某個點位在哪裡。"
        : "如果你在异环里最常卡的是收集漏点、区域扫图顺序和每日/每周重置节奏，探索伴侣的用途就是把地图标记、扫图路线和个人进度集中到同一页。它更像是长期补完工具，不只是一次性查某个点位在哪里。")
    : "If your biggest friction in NTE is missed collectibles, inefficient sweep order, or losing track of daily and weekly reset routes, the Explorer tool is meant to keep map markers, sweep planning, and personal progress in one place. It works better as a long-term completion companion than as a one-off map lookup.";
  const notesTitle = isZh
    ? (locale === "tw" ? "使用前建議先確認" : "使用前建议先确认")
    : "Before you start";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先決定你現在是要補全地圖收集、做每日/每週清理，還是只查單一區域。"
          : "先决定你现在是要补全地图收集、做每日/每周清理，还是只查单一区域。",
        locale === "tw"
          ? "如果你的進度是跨裝置操作，記得先確認目前瀏覽器裡的本地記錄是不是最新。"
          : "如果你的进度是跨设备操作，记得先确认当前浏览器里的本地记录是不是最新。",
        locale === "tw"
          ? "掃圖時優先按區域或標記類型拆批處理，通常比一次清完整張圖更有效率。"
          : "扫图时优先按区域或标记类型拆批处理，通常比一次清完整张图更有效率。",
      ]
    : [
        "Decide whether you are doing full-map cleanup, daily/weekly resets, or a single-region lookup first.",
        "If you switch devices often, make sure the current browser's local progress record is the one you want to continue from.",
        "Sweeping by region or marker type is usually more efficient than trying to clear the entire map in one pass.",
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
