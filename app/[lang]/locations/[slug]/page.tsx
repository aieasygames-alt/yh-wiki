import Link from "next/link";
import { notFound } from "next/navigation";
import { t, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getLocation, getAllLocations, getCharacter, getLoreItem } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";

const EN_LOCATION_SEO: Record<string, { title: string; description: string; h1: string }> = {
  "groth-island": {
    title: "Groth Island NTE Historical Location Record | Neverness to Everness",
    description: "Historical Groth Island NTE reference: recorded map and lore context, anomaly and Appraiser mentions, and related material. Verify current access and map details in the target client.",
    h1: "Groth Island NTE Historical Location Record",
  },
  "new-helios": {
    title: "New Helios NTE Historical District Record | Neverness to Everness",
    description: "Historical New Helios NTE reference: recorded Hethereau map context, city lore, and related material. Verify current access, map details, and routes in the target client.",
    h1: "New Helios NTE Historical District Record",
  },
};

export function generateStaticParams() {
  const locations = getAllLocations();
  return locations.flatMap((l) => LOCALES.map((lang) => ({ lang, slug: l.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  const locale = lang as Locale;
  const name = localizedText(locale, loc.name, loc.nameEn);
  const enSeo = locale === "en" ? EN_LOCATION_SEO[slug] : undefined;
  const description = completeMetaDescription(locale, enSeo?.description || localizedText(locale, loc.summary, loc.summaryEn));
  const suffix = localizedText(locale, "异环地点历史资料", "NTE Historical Location Record", "異環地點歷史資料");
  const title = enSeo?.title || `${name} - ${suffix}`;
  return {
    title,
    description,
    alternates: hreflangAlternates(`locations/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const name = localizedText(locale, loc.name, loc.nameEn);
  const content = localizedText(locale, loc.content, loc.contentEn);
  const summary = localizedText(locale, loc.summary, loc.summaryEn);
  const enSeo = locale === "en" ? EN_LOCATION_SEO[slug] : undefined;

  const relatedChars = loc.relatedCharacters
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const relatedLoreItems = loc.relatedLore
    .map((id) => getLoreItem(id))
    .filter(Boolean);

  return (
    <>
      <ArticleJsonLd
        title={name}
        description={summary}
        url={`https://nteguide.com/${lang}/locations/${slug}`}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "locations.title"), href: `/${lang}/locations` },
          { label: name },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-6 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {localizedText(locale, "历史地点资料，须以当前地图复核", "Historical location reference - verify in the current map", "歷史地點資料，須以目前地圖覆核")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {localizedText(
              locale,
              `本页的名称、摘要、地图描述、关联内容和入口线索均为历史记录，不证明「${name}」当前仍存在、可到达或关联相同任务与收集物。跑图、任务或收集前，请在目标客户端地图和官方公告中确认。`,
              `This page records historical names, summaries, map descriptions, related content, and access leads. It does not prove that ${name} still exists, is reachable, or has the same linked quests and collectibles today. Confirm it in the target client map and official notices before routing, questing, or collecting.`,
              `本頁的名稱、摘要、地圖描述、關聯內容和入口線索均為歷史記錄，不證明「${name}」目前仍存在、可到達或關聯相同任務與收集物。跑圖、任務或收集前，請在目標客戶端地圖和官方公告中確認。`
            )}
          </p>
        </section>
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {localizedText(locale, loc.categoryZh, loc.categoryEn)}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{enSeo?.h1 || name}</h1>
        <div className="prose prose-invert max-w-none">
          {content.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "locations.relatedCharacters")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedChars.map((c) => (
                <Link
                  key={c!.id}
                  href={`/${lang}/characters/${c!.id}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c!.name}</p>
                    <p className="text-xs text-gray-500">{c!.nameEn}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Lore */}
        {relatedLoreItems.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "locations.relatedLore")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedLoreItems.map((l) => (
                <Link
                  key={l!.id}
                  href={`/${lang}/lore/${l!.id}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{l!.name}</p>
                    <p className="text-xs text-gray-500">{l!.nameEn}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "如何阅读这些历史地点字段", "How to read these historical location fields", "如何閱讀這些歷史地點字段")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `「${name}」这类页面保留曾出现过的区域归类、角色与世界观关联，以及地图描述线索。它们可帮助检索旧资料，但不能确认当前坐标、入口、开放条件或跑图价值。`,
                `A page like ${name} preserves previously recorded region classification, character and lore links, and map-description leads. They can help search older material, but cannot confirm current coordinates, access, availability, or route value.`,
                `「${name}」這類頁面保留曾出現過的區域歸類、角色與世界觀關聯，以及地圖描述線索。它們可幫助檢索舊資料，但不能確認目前座標、入口、開放條件或跑圖價值。`
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "核验相关资料", "Verify related references", "覆核相關資料")}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/map/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "打开地图", "Open map", "打開地圖")}
              </Link>
              {relatedChars[0] && (
                <Link href={`/${lang}/characters/${relatedChars[0]!.id}`} className="text-primary-300 hover:text-primary-200">
                  {localizedText(locale, "关联角色", "Related character", "關聯角色")}
                </Link>
              )}
              {relatedLoreItems[0] && (
                <Link href={`/${lang}/lore/${relatedLoreItems[0]!.id}`} className="text-primary-300 hover:text-primary-200">
                  {localizedText(locale, "关联世界观", "Related lore", "關聯世界觀")}
                </Link>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {localizedText(
                locale,
                "若历史资料同时提及任务、世界观或收集物，可将这些名称作为当前客户端和官方资料的检索词。完成地图与可用性复核前，不要据此安排探索路线。",
                "When historical material mentions quests, lore, or collectibles together, use those names as search terms in the current client and official sources. Do not plan an exploration route until map and availability checks are complete.",
                "若歷史資料同時提及任務、世界觀或收集物，可將這些名稱作為目前客戶端和官方資料的檢索詞。完成地圖與可用性覆核前，不要據此安排探索路線。"
              )}
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
