import Link from "next/link";
import { notFound } from "next/navigation";
import { t, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getLoreItem, getAllLore, getCharacter, getLocation } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";

function buildLoreMetaDescription(args: {
  locale: Locale;
  summary?: string;
  category?: string;
  relatedCharacters?: number;
  relatedLocations?: number;
}) {
  const { locale, summary = "", category, relatedCharacters = 0, relatedLocations = 0 } = args;
  const cleaned = summary.replace(/\s+/g, " ").trim();
  const segments = [cleaned];

  if (category) {
    segments.push(
      locale === "en"
        ? `Lore category: ${category}.`
        : locale === "tw"
          ? `此條目屬於${category}。`
          : `该条目属于${category}。`
    );
  }

  if (relatedCharacters > 0) {
    segments.push(
      locale === "en"
        ? `Connected to ${relatedCharacters} character${relatedCharacters === 1 ? "" : "s"}.`
        : locale === "tw"
          ? `並關聯 ${relatedCharacters} 名角色。`
          : `并关联 ${relatedCharacters} 名角色。`
    );
  }

  if (relatedLocations > 0) {
    segments.push(
      locale === "en"
        ? `Also links ${relatedLocations} location${relatedLocations === 1 ? "" : "s"}.`
        : locale === "tw"
          ? `同時連到 ${relatedLocations} 個相關地點。`
          : `同时连到 ${relatedLocations} 个相关地点。`
    );
  }

  return completeMetaDescription(locale, segments.join(" ").trim());
}

export function generateStaticParams() {
  const loreItems = getAllLore();
  return loreItems.flatMap((l) => LOCALES.map((lang) => ({ lang, slug: l.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const lore = getLoreItem(slug);
  if (!lore) return {};
  const locale = lang as Locale;
  const name = localizedText(locale, lore.name, lore.nameEn);
  const description = buildLoreMetaDescription({
    locale,
    summary: localizedText(locale, lore.summary, lore.summaryEn),
    category: localizedText(locale, lore.categoryZh, lore.categoryEn),
    relatedCharacters: lore.relatedCharacters.length,
    relatedLocations: lore.relatedLocations.length,
  });
  const suffix = localizedText(locale, "异环世界观", "NTE Lore");
  return {
    title: `${name} - ${suffix}`,
    description,
    alternates: hreflangAlternates(`lore/${slug}`, lang),
    openGraph: {
      title: `${name} - ${suffix}`,
      description,
      type: "article",
    },
  };
}

export default async function LoreDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const lore = getLoreItem(slug);
  if (!lore) notFound();

  const name = localizedText(locale, lore.name, lore.nameEn);
  const content = localizedText(locale, lore.content, lore.contentEn);
  const summary = localizedText(locale, lore.summary, lore.summaryEn);
  const category = localizedText(locale, lore.categoryZh, lore.categoryEn);

  const relatedChars = lore.relatedCharacters
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const relatedLocs = lore.relatedLocations
    .map((id) => getLocation(id))
    .filter(Boolean);
  const relatedCharacterNames = relatedChars
    .map((c) => localizedText(locale, c!.name, c!.nameEn))
    .slice(0, 4);
  const relatedLocationNames = relatedLocs
    .map((l) => localizedText(locale, l!.name, l!.nameEn))
    .slice(0, 4);

  return (
    <>
      <ArticleJsonLd
        title={name}
        description={summary}
        url={`https://nteguide.com/${lang}/lore/${slug}`}
      />
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "lore.title"), href: `/${lang}/lore` },
          { label: name },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {category}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{name}</h1>
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-bold mb-3">
            {localizedText(locale, "条目概览", "Lore Overview", "條目概覽")}
          </h2>
          <p className="text-sm leading-7 text-gray-300">{summary}</p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            {localizedText(
              locale,
              `「${name}」属于${category}类世界观条目。阅读这个页面时，建议同时关注它在主线叙事、角色关系和地图探索中的作用：有些名词会解释异象来源，有些组织或地点则会影响任务入口、角色背景与后续版本剧情理解。`,
              `${name} belongs to the ${category} lore category. When reading this entry, consider how it connects to the main story, character relationships, and map exploration: some terms explain anomaly origins, while organizations or places can affect quest context, character backgrounds, and later version story interpretation.`,
              `「${name}」屬於${category}類世界觀條目。閱讀這個頁面時，建議同時關注它在主線敘事、角色關係和地圖探索中的作用：有些名詞會解釋異象來源，有些組織或地點則會影響任務入口、角色背景與後續版本劇情理解。`
            )}
          </p>
        </section>
        <div className="prose prose-invert max-w-none">
          {content.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "阅读重点", "What To Watch For", "閱讀重點")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  `先确认「${name}」是设定名词、组织、地点还是角色相关概念，这会决定它更适合从剧情、探索还是角色养成角度继续阅读。`,
                  `First identify whether ${name} is a setting term, organization, location, or character-related concept; that tells you whether to continue through story, exploration, or character progression pages.`,
                  `先確認「${name}」是設定名詞、組織、地點還是角色相關概念，這會決定它更適合從劇情、探索還是角色養成角度繼續閱讀。`
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  relatedCharacterNames.length > 0
                    ? `如果你正在查角色背景，可以继续看 ${relatedCharacterNames.join("、")} 等相关角色页，把能力、阵营和剧情线索串起来。`
                    : "如果该条目暂时没有直接关联角色，优先把它当作背景设定理解，再通过主线、地点或组织条目补上下文。",
                  relatedCharacterNames.length > 0
                    ? `If you are checking character background, continue with ${relatedCharacterNames.join(", ")} and related character pages to connect abilities, factions, and story clues.`
                    : "If this entry has no direct character links yet, treat it as setting context first, then use story, location, or organization entries to fill in the picture.",
                  relatedCharacterNames.length > 0
                    ? `如果你正在查角色背景，可以繼續看 ${relatedCharacterNames.join("、")} 等相關角色頁，把能力、陣營和劇情線索串起來。`
                    : "如果該條目暫時沒有直接關聯角色，優先把它當作背景設定理解，再透過主線、地點或組織條目補上下文。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  relatedLocationNames.length > 0
                    ? `如果你在做地图探索，可以把 ${relatedLocationNames.join("、")} 等地点加入路线，避免只看设定而漏掉实际入口。`
                    : "如果没有明确地点关联，建议先回到世界观索引，寻找同分类下更接近任务或地图入口的条目。",
                  relatedLocationNames.length > 0
                    ? `If you are exploring the map, add ${relatedLocationNames.join(", ")} to your route so the lore entry does not stay disconnected from practical entry points.`
                    : "If no location is linked yet, return to the lore index and look for same-category entries that connect more directly to quests or map routes.",
                  relatedLocationNames.length > 0
                    ? `如果你在做地圖探索，可以把 ${relatedLocationNames.join("、")} 等地點加入路線，避免只看設定而漏掉實際入口。`
                    : "如果沒有明確地點關聯，建議先回到世界觀索引，尋找同分類下更接近任務或地圖入口的條目。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "后续怎么查", "Where To Go Next", "後續怎麼查")}
            </h2>
            <p className="text-sm leading-7 text-gray-300">
              {localizedText(
                locale,
                `如果「${name}」影响你理解当前版本剧情，可以先回到世界观索引查同类条目；如果它关联角色或地点，再分别进入角色页、地点页和互动地图。这样能把设定、任务和实际探索连成一条线，而不是只停留在单个名词解释。`,
                `If ${name} affects how you read the current story, return to the lore index for same-category entries first. If it connects to characters or locations, continue through character pages, location pages, and the interactive map so the setting, quests, and exploration path stay connected.`,
                `如果「${name}」影響你理解目前版本劇情，可以先回到世界觀索引查同類條目；如果它關聯角色或地點，再分別進入角色頁、地點頁和互動地圖。這樣能把設定、任務和實際探索連成一條線，而不是只停留在單個名詞解釋。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/lore/`} className="text-primary-300 hover:text-primary-200">
                {t(locale, "lore.title")}
              </Link>
              <Link href={`/${lang}/characters/`} className="text-primary-300 hover:text-primary-200">
                {t(locale, "site.nav.characters")}
              </Link>
              <Link href={`/${lang}/locations/`} className="text-primary-300 hover:text-primary-200">
                {t(locale, "site.nav.locations")}
              </Link>
              <Link href={`/${lang}/map/`} className="text-primary-300 hover:text-primary-200">
                {t(locale, "site.nav.map")}
              </Link>
            </div>
          </div>
        </section>

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "lore.relatedCharacters")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedChars.map((c) => (
                <Link
                  key={c!.id}
                  href={`/${lang}/characters/${c!.id}/`}
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

        {/* Related Locations */}
        {relatedLocs.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "lore.relatedLocations")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedLocs.map((l) => (
                <Link
                  key={l!.id}
                  href={`/${lang}/locations/${l!.id}/`}
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
      </article>
    </>
  );
}
