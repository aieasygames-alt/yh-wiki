import Link from "next/link";
import { notFound } from "next/navigation";
import { t, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getLoreItem, getAllLore, getCharacter, getLocation } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
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
  const suffix = localizedText(locale, "异环世界观历史资料", "NTE Lore History", "異環世界觀歷史資料");
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
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "lore.title"), href: `/${lang}/lore` },
          { label: name },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-6 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
          <h2 className="text-lg font-semibold text-amber-100">
            {localizedText(locale, "历史世界观资料，须以当前内容复核", "Historical lore reference - verify against current content", "歷史世界觀資料，須以目前內容覆核")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-50/80">
            {localizedText(
              locale,
              `本页的名称、设定、角色、地点和剧情关联均为历史叙事记录，不证明「${name}」当前仍在主线中出现、可访问或关联相同任务。请在目标客户端剧情、地图和官方公告中确认。`,
              `This page records historical names, setting notes, character links, locations, and story relationships. It does not prove that ${name} still appears in the live story, is accessible, or connects to the same quests. Confirm it in the target client story, map, and official notices.`,
              `本頁的名稱、設定、角色、地點和劇情關聯均為歷史敘事記錄，不證明「${name}」目前仍在主線中出現、可訪問或關聯相同任務。請在目標客戶端劇情、地圖和官方公告中確認。`
            )}
          </p>
        </section>
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {category}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{name}</h1>
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "历史条目概览", "Historical lore overview", "歷史條目概覽")}
          </h2>
          <p className="text-sm leading-7 text-gray-300">{summary}</p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            {localizedText(
              locale,
              `「${name}」在历史资料中被归类为${category}。本页保留其与角色、地点和叙事概念的关联线索，适合用于交叉检索旧资料；它不确认当前主线、任务入口、角色背景或后续版本剧情。`,
              `${name} was categorized as ${category} in historical material. This page preserves leads linking it to characters, locations, and narrative concepts for cross-referencing older material; it does not confirm the current main story, quest access, character background, or later-version plot.`,
              `「${name}」在歷史資料中被歸類為${category}。本頁保留其與角色、地點和敘事概念的關聯線索，適合用於交叉檢索舊資料；它不確認目前主線、任務入口、角色背景或後續版本劇情。`
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
              {localizedText(locale, "如何使用历史叙事线索", "How to use historical narrative leads", "如何使用歷史敘事線索")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  `先确认「${name}」在历史资料中被描述为设定名词、组织、地点还是角色相关概念，再用这一分类检索当前官方剧情、地图或角色资料。`,
                  `First identify whether older material described ${name} as a setting term, organization, location, or character-related concept, then use that classification to search current official story, map, or character material.`,
                  `先確認「${name}」在歷史資料中被描述為設定名詞、組織、地點還是角色相關概念，再用這一分類檢索目前官方劇情、地圖或角色資料。`
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  relatedCharacterNames.length > 0
                    ? `相关角色「${relatedCharacterNames.join("、")}」可作为当前资料的检索词；历史关联不代表现行角色状态、能力、阵营或剧情仍然一致。`
                    : "若该条目没有直接关联角色，可将其视为背景设定的历史线索，并从当前官方剧情、地点或组织资料补充上下文。",
                  relatedCharacterNames.length > 0
                    ? `Related characters such as ${relatedCharacterNames.join(", ")} are search terms for current references; a historical link does not establish that live character status, abilities, factions, or plot remain the same.`
                    : "If this entry has no direct character links, treat it as a historical setting lead and fill in context from current official story, location, or organization references.",
                  relatedCharacterNames.length > 0
                    ? `相關角色「${relatedCharacterNames.join("、")}」可作為目前資料的檢索詞；歷史關聯不代表現行角色狀態、能力、陣營或劇情仍然一致。`
                    : "若該條目沒有直接關聯角色，可將其視為背景設定的歷史線索，並從目前官方劇情、地點或組織資料補充上下文。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  relatedLocationNames.length > 0
                    ? `相关地点「${relatedLocationNames.join("、")}」只能作为当前地图的检索词；完成坐标与可用性复核前，不要据此安排跑图或任务路线。`
                    : "如果没有明确地点关联，可回到世界观索引寻找同分类的历史条目，再从当前官方资料核对地图和任务上下文。",
                  relatedLocationNames.length > 0
                    ? `Related locations such as ${relatedLocationNames.join(", ")} are only search terms for the current map; do not plan routes or quests from them before coordinates and availability are verified.`
                    : "If no location is linked, return to the lore index for same-category historical entries, then verify map and quest context in current official material.",
                  relatedLocationNames.length > 0
                    ? `相關地點「${relatedLocationNames.join("、")}」只能作為目前地圖的檢索詞；完成座標與可用性覆核前，不要據此安排跑圖或任務路線。`
                    : "如果沒有明確地點關聯，可回到世界觀索引尋找同分類的歷史條目，再從目前官方資料核對地圖和任務上下文。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "继续核验相关资料", "Continue verifying related references", "繼續覆核相關資料")}
            </h2>
            <p className="text-sm leading-7 text-gray-300">
              {localizedText(
                locale,
                `可先回到世界观索引查同类历史条目，并将关联角色或地点名称用于检索当前客户端和官方资料。只有在确认当前剧情、任务和地图状态后，才将它们用于实际游玩判断。`,
                `Return to the lore index for same-category historical entries, and use linked character or location names to search the current client and official material. Use them for live gameplay decisions only after current story, quest, and map status are confirmed.`,
                `可先回到世界觀索引查同類歷史條目，並將關聯角色或地點名稱用於檢索目前客戶端和官方資料。只有在確認目前劇情、任務和地圖狀態後，才將它們用於實際遊玩判斷。`
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
