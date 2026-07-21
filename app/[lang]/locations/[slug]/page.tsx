import Link from "next/link";
import { notFound } from "next/navigation";
import { t, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getLocation, getAllLocations, getCharacter, getLoreItem } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";

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
  const description = completeMetaDescription(locale, localizedText(locale, loc.summary, loc.summaryEn));
  const suffix = localizedText(locale, "异环地图", "NTE Location Guide");
  return {
    title: `${name} - ${suffix}`,
    description,
    alternates: hreflangAlternates(`locations/${slug}`, lang),
    openGraph: {
      title: `${name} - ${suffix}`,
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
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "locations.title"), href: `/${lang}/locations` },
          { label: name },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {localizedText(locale, loc.categoryZh, loc.categoryEn)}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{name}</h1>
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
              {localizedText(locale, "地点阅读方式", "How to read this location", "地點閱讀方式")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `「${name}」这类地点页最适合用来确认它属于哪个区域、和哪些角色或世界观条目有关、以及是否值得纳入跑图或收集路线。地点本身可能不是长篇攻略，但它承担的是坐标、叙事和入口提示的枢纽作用。`,
                `A location page like ${name} is best used to confirm which region it belongs to, which characters or lore entries connect to it, and whether it should be part of your route or collection plan. Even if the page is not long, it acts as the hub for coordinates, narrative context, and access hints.`,
                `「${name}」這類地點頁最適合用來確認它屬於哪個區域、和哪些角色或世界觀條目有關、以及是否值得納入跑圖或收集路線。地點本身可能不是長篇攻略，但它承擔的是座標、敘事和入口提示的樞紐作用。`
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "建议搭配查看", "Recommended follow-up", "建議搭配查看")}
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
                "如果这个地点和任务、世界观或收集品同时相关，先把它记入当前探索路线，再去补周边内容。这样更容易把单点信息转成可执行的跑图计划。",
                "If the location links to quests, lore, or collectibles at the same time, add it to your current exploration route first and then sweep the surrounding content. That turns one location into an actionable route plan.",
                "如果這個地點和任務、世界觀或收集品同時相關，先把它記入目前探索路線，再去補周邊內容。這樣更容易把單點資訊轉成可執行的跑圖計劃。"
              )}
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
