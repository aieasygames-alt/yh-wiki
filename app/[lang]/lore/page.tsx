import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllLore } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const loreItems = getAllLore();
  const title = isZhLocale(locale)
    ? (locale === "tw" ? `異環世界觀歷史資料 — ${loreItems.length} 條敘事記錄` : `异环世界观历史资料 — ${loreItems.length} 条叙事记录`)
    : `NTE Lore History - ${loreItems.length} Narrative Records`;
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環世界觀歷史資料索引，收錄 ${loreItems.length} 條名稱、組織、角色與地點關聯記錄。劇情、任務與可訪問內容須以目標客戶端及官方資料覆核。`
      : `异环世界观历史资料索引，收录 ${loreItems.length} 条名称、组织、角色与地点关联记录。剧情、任务与可访问内容须以目标客户端及官方资料复核。`)
    : `Historical NTE lore index with ${loreItems.length} records of terms, organizations, characters, and locations. Verify story, quest, and accessibility details in the target client and official sources.`;
  return {
    title,
    description,
    alternates: hreflangAlternates("lore", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function LoreListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const loreItems = getAllLore();

  const categories = Array.from(
    new Set(loreItems.map((l) => l.category))
  ).map((cat) => {
    const item = loreItems.find((l) => l.category === cat)!;
    return { slug: cat, name: isZhLocale(locale) ? item.categoryZh : item.categoryEn };
  });

  const loreByCategory = categories.map((cat) => ({
    ...cat,
    items: loreItems.filter((l) => l.category === cat.slug),
  }));

  return (
    <>
      <ItemListJsonLd
        items={loreItems.map((l) => ({
          name: isZhLocale(locale) ? l.name : l.nameEn,
          url: `https://nteguide.com/${lang}/lore/${l.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "lore.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{isZhLocale(locale) ? "异环世界观历史资料" : "NTE Lore History"}</h1>

        <section className="mb-8 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {isZhLocale(locale) ? "叙事历史资料，不等于当前可访问内容" : "Narrative history is not proof of current accessibility"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {isZhLocale(locale)
              ? "角色、组织、地点、任务和剧情关联可能来自不同测试阶段、服务器或版本。资料页保留的是叙事线索；当前主线进度、任务入口、地图可达性与角色状态请以目标客户端和官方公告为准。"
              : "Character, organization, location, quest, and story links may come from different test phases, servers, or versions. These pages preserve narrative leads; confirm current story progress, quest access, map availability, and character status in the target client and official notices."}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "这页历史资料适合做什么？" : "What is this historical index useful for?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "用它查找旧资料中出现过的名词、组织和关系，再作为检索当前官方资料的关键词。它不提供现行剧情顺序、任务路线或角色养成结论。"
              : "Use it to find terms, organizations, and relationships that appeared in older material, then use them as search terms for current official references. It does not provide a live story order, quest route, or character-progression conclusion."}
          </p>
        </section>

        {loreByCategory.map((cat) => (
          <section key={cat.slug} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary-400">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <a
                  key={item.id}
                  href={`/${lang}/lore/${item.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 p-5 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                >
                  <h3 className="text-base font-medium">
                    {isZhLocale(locale) ? item.name : item.nameEn}
                  </h3>
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
