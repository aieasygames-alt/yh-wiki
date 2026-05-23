import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getGuide, getAllGuides, getCharacter, getLocation, getLoreItem } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { FaqSection } from "../../../../components/FaqSection";
import { ArticleContent } from "../../../../components/ArticleContent";
import { TableOfContents, TableOfContentsDesktop, extractHeadings } from "../../../../components/TableOfContents";
import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("../../../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

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
  const title = isZhLocale(lang) ? guide.title : guide.titleEn;
  const description = isZhLocale(lang) ? guide.summary : guide.summaryEn;
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

  const title = isZhLocale(locale) ? guide.title : guide.titleEn;
  const content = isZhLocale(locale) ? guide.content : guide.contentEn;
  const summary = isZhLocale(locale) ? guide.summary : guide.summaryEn;

  const relatedChars = guide.relatedCharacters
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const relatedLocs = guide.relatedLocations
    .map((id) => getLocation(id))
    .filter(Boolean);

  const relatedLoreItems = guide.relatedLore
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

        {/* Quick Download CTA */}
        {slug === "download-install-guide" && (
          <div className="mb-8 rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-900/40 to-gray-900/60 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="text-3xl">⬇️</div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isZhLocale(locale) ? "立即下载异环" : "Download NTE Now — Free to Play"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? "PC 约90GB · 手机约15GB · 全平台免费"
                    : "PC ~90GB · Mobile ~15GB · Free on all platforms"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                🤖 Android
              </a>
              <a
                href="https://apps.apple.com/app/neverness-to-everness/id6741713522"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
              >
                🍎 iOS
              </a>
              <a
                href="https://store.playstation.com/concept/10008264"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium text-sm transition-colors"
              >
                🎮 PS5
              </a>
            </div>
          </div>
        )}

        <ArticleContent content={content} />

        {/* FAQ Section */}
        {guide.faq && guide.faq.length > 0 && (
          <FaqSection faqs={guide.faq} locale={locale} />
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
