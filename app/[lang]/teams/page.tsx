import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getGuide, getCharacter, getLocation, getLoreItem } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "tw" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const guide = getGuide("team-composition-guide");
  if (!guide) return {};
  const title = isZhLocale(locale) ? guide.title : guide.titleEn;
  const description = isZhLocale(locale) ? guide.summary : guide.summaryEn;
  return {
    title: `${title} | NTE Guide`,
    description,
    alternates: hreflangAlternates("teams", lang),
    openGraph: {
      title: `${title} | NTE Guide`,
      description,
      type: "article",
    },
  };
}

export default async function TeamsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const guide = getGuide("team-composition-guide");
  if (!guide) return null;

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
        url={`https://nteguide.com/${lang}/teams`}
      />
      {guide.faq && guide.faq.length > 0 && (
        <FaqPageJsonLd faqs={guide.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          {
            label: isZhLocale(locale) ? "队伍搭配" : "Team Compositions",
          },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {isZhLocale(locale) ? guide.categoryZh : guide.categoryEn}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="prose prose-invert max-w-none">
          {content.split("\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-gray-100">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={i} className="text-lg font-bold mt-6 mb-3 text-gray-200">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (!paragraph.trim()) return null;
            return (
              <p key={i} className="text-gray-300 mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

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
      </article>
    </>
  );
}
