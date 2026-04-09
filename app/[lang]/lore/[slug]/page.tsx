import Link from "next/link";
import { notFound } from "next/navigation";
import { t, hreflangAlternates } from "../../../../lib/i18n";
import { getLoreItem, getAllLore, getCharacter, getLocation } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const loreItems = getAllLore();
  return loreItems.flatMap((l) => [
    { lang: "zh", slug: l.id },
    { lang: "en", slug: l.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const lore = getLoreItem(slug);
  if (!lore) return {};
  const name = lang === "zh" ? lore.name : lore.nameEn;
  const description = lang === "zh" ? lore.summary : lore.summaryEn;
  return {
    title: `${name} - ${lang === "zh" ? "异环世界观" : "NTE Lore"} | NTE Guide`,
    description,
    alternates: hreflangAlternates(`lore/${slug}`),
    openGraph: {
      title: `${name} - ${lang === "zh" ? "异环世界观" : "NTE Lore"} | NTE Guide`,
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
  const locale = lang as "zh" | "en";
  const lore = getLoreItem(slug);
  if (!lore) notFound();

  const name = locale === "zh" ? lore.name : lore.nameEn;
  const content = locale === "zh" ? lore.content : lore.contentEn;
  const summary = locale === "zh" ? lore.summary : lore.summaryEn;

  const relatedChars = lore.relatedCharacters
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const relatedLocs = lore.relatedLocations
    .map((id) => getLocation(id))
    .filter(Boolean);

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
            {locale === "zh" ? lore.categoryZh : lore.categoryEn}
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
              {t(locale, "lore.relatedCharacters")}
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
              {t(locale, "lore.relatedLocations")}
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
      </article>
    </>
  );
}
