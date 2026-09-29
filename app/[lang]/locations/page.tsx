import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllLocations } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const locations = getAllLocations();
  const categoryCount = new Set(locations.map((location) => location.category)).size;
  const description = isZhLocale(locale)
    ? (locale === "tw"
        ? `異環地點與世界觀歷史資料索引，彙整 ${locations.length} 個地點與 ${categoryCount} 種分類。名稱、坐標、入口、任務與收集內容須以目標客戶端及官方資料覆核。`
        : `异环地点与世界观历史资料索引，汇总 ${locations.length} 个地点与 ${categoryCount} 种分类。名称、坐标、入口、任务与收集内容须以目标客户端及官方资料复核。`)
    : `Historical NTE location and lore index with ${locations.length} entries across ${categoryCount} categories. Verify names, coordinates, access, quests, and collectibles in your target client and official sources.`;
  const title = isZhLocale(locale)
    ? (locale === "tw"
        ? `異環地點歷史資料 — ${locations.length} 個區域與世界觀記錄`
        : `异环地点历史资料 — ${locations.length} 个区域与世界观记录`)
    : `NTE Location History - ${locations.length} Region and Lore Records`;
  return {
    title,
    description,
    alternates: hreflangAlternates("locations", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function LocationsListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const locations = getAllLocations();

  const categories = Array.from(
    new Set(locations.map((l) => l.category))
  ).map((cat) => {
    const item = locations.find((l) => l.category === cat)!;
    return { slug: cat, name: isZhLocale(locale) ? item.categoryZh : item.categoryEn };
  });

  const locsByCategory = categories.map((cat) => ({
    ...cat,
    items: locations.filter((l) => l.category === cat.slug),
  }));

  return (
    <>
      <ItemListJsonLd
        items={locations.map((l) => ({
          name: isZhLocale(locale) ? l.name : l.nameEn,
          url: `https://nteguide.com/${lang}/locations/${l.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "locations.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{isZhLocale(locale) ? "异环地点历史资料" : "NTE Location History"}</h1>

        <section className="mb-8 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {isZhLocale(locale) ? "历史地点资料，使用前须复核" : "Historical location references require verification"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {isZhLocale(locale)
              ? "地点名称、坐标、入口、开放条件、任务、收集物和关联角色都可能因版本、服务器或活动而变化。请在目标客户端地图与官方公告中确认，再进行跑图或任务规划。"
              : "Location names, coordinates, entrances, access conditions, quests, collectibles, and related characters can change by version, server, or event. Confirm them in the target client map and official notices before planning routes or tasks."}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁歷史資料最適合怎麼看？" : "这页历史资料最适合怎么用？")
              : "How should you use this historical location index?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "先按區域或分類查找曾出現過的名稱，再進入單地點頁查看摘要與世界觀關聯。這個索引用於保留和交叉核對舊資料，不提供目前版本的坐標、開放條件或跑圖結論。"
                  : "先按区域或分类查找曾出现过的名称，再进入单地点页查看摘要与世界观关联。这个索引用于保留和交叉核对旧资料，不提供当前版本的坐标、开放条件或跑图结论。")
              : "Start by finding names that appeared in older material, then open a detail page for its summary and lore links. This index preserves and cross-checks old references; it does not provide current coordinates, access conditions, or route conclusions."}
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "核對目前地圖時先看什麼" : "核对当前地图时先看什么")
                : "What to check in the current map"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "地點是否仍存在，且名稱、區域與分類是否和目標客戶端一致。" : "地点是否仍存在，且名称、区域与分类是否和目标客户端一致。") : "Whether the location still exists and whether its name, region, and category match the target client."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "目前坐標、入口、開放條件和關聯任務是否已變動。" : "当前坐标、入口、开放条件和关联任务是否已变动。") : "Whether current coordinates, entrances, access conditions, and linked quests have changed."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "收集物、首領或功能設施是否確實存在於目前版本與伺服器。" : "收集物、首领或功能设施是否确实存在于当前版本与服务器。") : "Whether collectibles, bosses, or utility facilities actually exist in the current version and server."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把歷史地點名稱或描述直接當成目前地圖坐標。" : "把历史地点名称或描述直接当成当前地图坐标。") : "Treating historical location names or descriptions as current map coordinates."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "根據舊入口、任務或收集物安排目前跑圖。" : "根据旧入口、任务或收集物安排当前跑图。") : "Planning a current route from old entrances, quests, or collectibles."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把世界觀關聯誤讀為目前可訪問或可互動的功能。" : "把世界观关联误读为当前可访问或可互动的功能。") : "Mistaking a lore association for a currently accessible or interactive feature."}</li>
            </ul>
          </div>
        </section>

        {locsByCategory.map((cat) => (
          <section key={cat.slug} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary-400">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <a
                  key={item.id}
                  href={`/${lang}/locations/${item.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 p-5 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium">
                      {isZhLocale(locale) ? item.name : item.nameEn}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 shrink-0 ml-2">
                      {isZhLocale(locale) ? item.categoryZh : item.categoryEn}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {isZhLocale(locale) ? item.summary : item.summaryEn}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
