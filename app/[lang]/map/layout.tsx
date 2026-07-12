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
        ? "異環互動地圖最適合處理兩類需求：第一種是補漏，像是少了箱子、材料、挑戰點或區域收集；第二種是規劃，像是先跑哪個區、每天清哪些標記比較省時間。和只看單篇採集路線不同，地圖工具更適合長期追蹤自己的收集進度。"
        : "异环互动地图最适合处理两类需求：第一种是补漏，像是少了箱子、材料、挑战点或区域收集；第二种是规划，像是先跑哪个区、每天清哪些标记更省时间。和只看单篇采集路线不同，地图工具更适合长期追踪自己的收集进度。")
    : "The interactive map is most useful for two jobs in NTE: cleanup and planning. It helps when you are missing chests, materials, challenge markers, or regional collectibles, and it also helps you decide which route or zone to farm first. Compared with a one-off route guide, the map works better as a long-term progress tracker.";
  const notesTitle = isZh
    ? (locale === "tw" ? "打開地圖前先想好這幾件事" : "打开地图前先想好这几件事")
    : "Think about these before you start";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先決定你是要查單一標記，還是做整個區域的補完，這會直接影響篩選方式。"
          : "先决定你是要查单一标记，还是做整个区域的补完，这会直接影响筛选方式。",
        locale === "tw"
          ? "如果你每天只有零碎時間，按區域或素材類型分批處理，通常比整張圖一起清更有效率。"
          : "如果你每天只有零碎时间，按区域或素材类型分批处理，通常比整张图一起清更有效率。",
        locale === "tw"
          ? "跨裝置使用時要留意瀏覽器本地進度，避免把舊記錄當成最新狀態。"
          : "跨设备使用时要留意浏览器本地进度，避免把旧记录当成最新状态。",
      ]
    : [
        "Decide whether you are checking one marker or cleaning up an entire region, because that changes how you should filter the map.",
        "If you only play in short sessions, clearing by region or material type is usually more efficient than forcing a full-map sweep.",
        "If you switch devices, watch your browser-local progress state so an older record does not replace the one you actually want.",
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
