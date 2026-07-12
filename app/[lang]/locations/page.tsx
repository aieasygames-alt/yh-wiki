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
        ? `異環全地圖地點、區域與探索內容索引，彙整 ${locations.length} 個地點與 ${categoryCount} 種分類，方便快速查找海特洛城各區域資訊、探索方向與關聯內容。`
        : `异环全地图地点、区域与探索内容索引，汇总 ${locations.length} 个地点与 ${categoryCount} 种分类，方便快速查找海特洛城各区域信息、探索方向与关联内容。`)
    : `Browse ${locations.length} NTE locations across ${categoryCount} categories, with quick links for region info, exploration routes, and related world details.`;
  const title = isZhLocale(locale)
    ? (locale === "tw"
        ? `異環地點索引 — ${locations.length} 個區域、設施與探索地圖入口`
        : `异环地点索引 — ${locations.length} 个区域、设施与探索地图入口`)
    : `NTE Locations - ${locations.length} Regions, Facilities, and Exploration Hubs`;
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
        <h1 className="text-3xl font-bold mb-8">{t(locale, "locations.title")}</h1>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁地點索引最適合怎麼用？" : "这页地点索引最适合怎么用？")
              : "How should you use this location index?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "先按區域分類縮小範圍，再進入單地點頁查看用途、探索方向與關聯內容。這個索引最適合快速定位你要找的城市區塊、功能建築或世界觀地點，不適合只看名稱就判斷是否有探索價值。"
                  : "先按区域分类缩小范围，再进入单地点页查看用途、探索方向与关联内容。这个索引最适合快速定位你要找的城市区块、功能建筑或世界观地点，不适合只看名字就判断是否有探索价值。")
              : "Start by narrowing down the region or category, then open the location page for purpose, exploration context, and related content. This hub is best for quickly finding districts, buildings, and lore-relevant spots, not judging exploration value from the name alone."}
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "查地點前先看什麼" : "查地点前先看什么")
                : "What should you check before using this location list?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "先確認你是在找主線區域、探索收集點，還是功能型建築。" : "先确认你是在找主线区域、探索收集点，还是功能型建筑。") : "Know whether you are looking for a story region, exploration target, or utility building."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "同一分類下的地點用途可能差很多，最好進單頁確認摘要和關聯內容。" : "同一分类下的地点用途可能差很多，最好进单页确认摘要和关联内容。") : "Locations within the same category can serve very different purposes, so open the detail page before deciding."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "如果你是為了跑圖或收集，配合互動地圖與探索工具一起看會更快。" : "如果你是为了跑图或收集，配合互动地图与探索工具一起看会更快。") : "For route planning or collectibles, this page works best alongside the interactive map and exploration tools."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "只看區域名，不看地點摘要，結果點進錯的內容頁。" : "只看区域名，不看地点摘要，结果点进错的内容页。") : "Clicking based on region names alone and missing the actual place you need."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把世界觀地點和實用建築混在一起找，降低搜尋效率。" : "把世界观地点和实用建筑混在一起找，降低搜索效率。") : "Mixing lore locations with practical buildings and slowing down discovery."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把索引頁當成完整探索指南，忽略了地點詳情與地圖工具。" : "把索引页当成完整探索指南，忽略了地点详情与地图工具。") : "Treating the index like a full exploration guide and ignoring detail pages or map tools."}</li>
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
