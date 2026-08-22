import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getGuide, getAllGuides, getCharacter, getLocation, getLoreItem } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { QuickAnswerCard } from "../../../../components/QuickAnswerCard";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { FaqSection } from "../../../../components/FaqSection";
import { ArticleContent } from "../../../../components/ArticleContent";
import { TableOfContents, TableOfContentsDesktop, extractHeadings } from "../../../../components/TableOfContents";
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";
import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("../../../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

function buildGuideMetaDescription(args: {
  locale: Locale;
  summary?: string;
  category?: string;
  relatedCharacters?: string[];
  relatedLocations?: string[];
  relatedLore?: string[];
}) {
  const { locale, summary = "", category, relatedCharacters = [], relatedLocations = [], relatedLore = [] } = args;
  const cleaned = summary.replace(/\s+/g, " ").trim();
  const segments = [cleaned];

  if (category) {
    segments.push(
      locale === "en"
        ? `Topic: ${category}.`
        : locale === "tw"
          ? `主題聚焦：${category}。`
          : `主题聚焦：${category}。`
    );
  }

  if (relatedCharacters.length > 0) {
    segments.push(
      locale === "en"
        ? `Covers ${relatedCharacters.length} related character${relatedCharacters.length === 1 ? "" : "s"}.`
        : locale === "tw"
          ? `並串連 ${relatedCharacters.length} 名相關角色。`
          : `并串联 ${relatedCharacters.length} 名相关角色。`
    );
  }

  if (relatedLocations.length > 0 || relatedLore.length > 0) {
    const relatedCount = relatedLocations.length + relatedLore.length;
    segments.push(
      locale === "en"
        ? `Includes ${relatedCount} linked location or lore reference${relatedCount === 1 ? "" : "s"}.`
        : locale === "tw"
          ? `同時整理 ${relatedCount} 個相關地點或世界觀線索。`
          : `同时整理 ${relatedCount} 个相关地点或世界观线索。`
    );
  }

  return completeMetaDescription(locale, segments.join(" ").trim());
}

export function generateStaticParams() {
  const guides = getAllGuides();
  return guides.flatMap((g) => LOCALES.map((lang) => ({ lang, slug: g.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const locale = lang as Locale;
  const seoTitle = localizedText(locale, guide.seoTitleZh || guide.title, guide.seoTitleEn || guide.titleEn, guide.seoTitleTw || guide.titleTw);
  const title = locale === "tw" && seoTitle === guide.title ? `${seoTitle}（繁中）` : seoTitle;
  const seoDescription = localizedText(locale, guide.seoDescriptionZh || guide.summary, guide.seoDescriptionEn || guide.summaryEn, guide.seoDescriptionTw || guide.summaryTw);
  const baseDescription = locale === "tw" && seoDescription === guide.summary ? `${seoDescription} 本頁為繁體中文版本，整理重點、步驟與相關資源。` : seoDescription;
  const description = buildGuideMetaDescription({
    locale,
    summary: baseDescription,
    category: localizedText(locale, guide.categoryZh, guide.categoryEn, guide.categoryTw || guide.categoryZh),
    relatedCharacters: guide.relatedCharacters,
    relatedLocations: guide.relatedLocations,
    relatedLore: guide.relatedLore,
  });
  return {
    title,
    description,
    alternates: hreflangAlternates(`guides/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
      ...(guide.date ? { publishedTime: guide.date } : {}),
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const localizedTitle = localizedText(locale, guide.title, guide.titleEn, guide.titleTw);
  const title = locale === "tw" && localizedTitle === guide.title ? `${localizedTitle}（繁中）` : localizedTitle;
  const content = localizedText(locale, guide.content, guide.contentEn, guide.contentTw);
  const summary = localizedText(locale, guide.summary, guide.summaryEn, guide.summaryTw);

  const relatedChars = (guide.relatedCharacters || [])
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const relatedLocs = (guide.relatedLocations || [])
    .map((id) => getLocation(id))
    .filter(Boolean);

  const relatedLoreItems = (guide.relatedLore || [])
    .map((id) => getLoreItem(id))
    .filter(Boolean);

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={summary}
        url={`https://nteguide.com/${lang}/guides/${slug}`}
        datePublished={guide.date}
        dateModified={guide.date}
      />
      {guide.faq && guide.faq.length > 0 && (
        <FaqPageJsonLd faqs={guide.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "guides.title"), href: `/${lang}/guides` },
          { label: title },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <TableOfContents headings={extractHeadings(content)} />
        <TableOfContentsDesktop headings={extractHeadings(content)} />
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {isZhLocale(locale) ? guide.categoryZh : guide.categoryEn}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {guide.date && (
          <time className="text-xs text-gray-500 mb-6 block" dateTime={guide.date}>
            {isZhLocale(locale)
              ? (locale === "tw" ? `更新於 ${guide.date}` : `更新于 ${guide.date}`)
              : `Updated ${guide.date}`}
          </time>
        )}

        {slug === "download-install-guide" ? (
          <QuickAnswerCard
            locale={locale}
            items={[
              {
                label: isZhLocale(locale) ? (locale === "tw" ? "先選入口：" : "先选入口：") : "Pick entry:",
                value: isZhLocale(locale)
                  ? (locale === "tw"
                    ? "高頻 PC 遊玩選本地啟動器或 Steam/Epic；手機用 App Store / Android 商店；低配或短時上線看雲異環。"
                    : "高频 PC 游玩选本地启动器或 Steam/Epic；手机用 App Store / Android 商店；低配或短时上线看云异环。")
                  : "Use local launcher or Steam/Epic for frequent PC play, mobile stores for phones, and Cloud PC for low-spec or short sessions.",
              },
              {
                label: isZhLocale(locale) ? (locale === "tw" ? "安裝空間：" : "安装空间：") : "Install size:",
                value: isZhLocale(locale)
                  ? (locale === "tw" ? "PC 建議在 SSD / NVMe 預留約 90GB，手機預留約 20-25GB，並給後續補丁留空間。" : "PC 建议在 SSD / NVMe 预留约 90GB，手机预留约 20-25GB，并给后续补丁留空间。")
                  : "Reserve around 90GB on SSD/NVMe for PC and around 20-25GB on mobile, with extra room for patches.",
              },
              {
                label: isZhLocale(locale) ? (locale === "tw" ? "安全提醒：" : "安全提醒：") : "Safety:",
                value: isZhLocale(locale)
                  ? (locale === "tw" ? "不要從第三方網盤隨便下載 EXE；先確認國服/國際服，再走官網、商店或平台入口。" : "不要从第三方网盘随便下载 EXE；先确认国服/国际服，再走官网、商店或平台入口。")
                  : "Avoid random EXE mirrors. Confirm CN/global route first, then use official, store, or platform entries.",
              },
            ]}
          />
        ) : summary && (
          <QuickAnswerCard
            locale={locale}
            items={[
              {
                label: isZhLocale(locale) ? "核心要点：" : "Key takeaway:",
                value: summary,
              },
            ]}
          />
        )}

        {/* Quick Download CTA */}
        {slug === "download-install-guide" && (
          <div className="mb-8 rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-900/40 to-gray-900/60 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "異環官網入口與下載路徑導航" : "异环官网入口与下载路径导航")
                    : "NTE official-site and download path guide"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? (locale === "tw"
                      ? "本頁為非官方整理：先按 PC 啟動器、手機、PS5、Steam/Epic 或雲異環選入口，再核對配置與伺服器。"
                      : "本页为非官方整理：先按 PC 启动器、手机、PS5、Steam/Epic 或云异环选入口，再核对配置与服务器。")
                    : "Unofficial guide: choose the PC launcher, mobile, PS5, Steam/Epic, or Cloud PC path, then check requirements and server fit."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link
                href={`/${lang}/official-site`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-medium text-sm transition-colors"
              >
                {isZhLocale(locale) ? (locale === "tw" ? "入口導航" : "入口导航") : "Entry Guide"}
              </Link>
              <a
                href="https://nte.perfectworld.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm transition-colors"
              >
                🖥 PC
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.pwrd.nteglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 hover:bg-green-600 text-white font-medium text-sm transition-colors"
              >
                Android
              </a>
              <a
                href="https://apps.apple.com/app/neverness-to-everness/id6741713522"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
              >
                iOS
              </a>
              <a
                href="https://store.playstation.com/concept/10008264"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium text-sm transition-colors"
              >
                PS5
              </a>
              <Link
                href={`/${lang}/blog/cloud-yihuan-pc-guide`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-colors"
              >
                {isZhLocale(locale) ? (locale === "tw" ? "雲異環" : "云异环") : "Cloud PC"}
              </Link>
            </div>
          </div>
        )}

        <ArticleContent content={content} lang={lang} />

        {/* FAQ Section */}
        {guide.faq && guide.faq.length > 0 && (
          <FaqSection faqs={guide.faq} locale={locale} />
        )}

        {guide.internalLinks && guide.internalLinks.length > 0 && (
          <section className="mt-10 mb-8 border-t border-gray-800 pt-6">
            <h2 className="text-lg font-bold mb-4">
              {isZhLocale(locale) ? (locale === "tw" ? "接著看這些" : "接着看这些") : "Related Guides"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {guide.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${lang}${link.href}`}
                  className="rounded-lg border border-gray-800 bg-gray-900/30 p-3 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors"
                >
                  {isZhLocale(locale) ? link.label : link.labelEn}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "guides.relatedCharacters")}
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

        {/* Related Locations */}
        {relatedLocs.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "guides.relatedLocations")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedLocs.map((l) => (
                <Link
                  key={l!.id}
                  href={`/${lang}/locations/${l!.id}`}
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

        {/* Related Lore */}
        {relatedLoreItems.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "guides.relatedLore")}
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
        {/* Player Discussion */}
        <GiscusComments locale={locale} term={`guide-${slug}`} />
      </article>
    </>
  );
}
