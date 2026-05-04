import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getFaq, getAllFaqs, getCharacter, getMaterialById } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { FaqJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const faqs = getAllFaqs();
  return faqs.flatMap((f) => LOCALES.map((lang) => ({ lang, slug: f.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const faq = getFaq(slug);
  if (!faq) return {};
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  // Use custom SEO title/description if defined, otherwise fall back to question
  const title = isZh
    ? (faq.seoTitleZh || `${faq.question} | 异环游戏 Wiki`)
    : (faq.seoTitleEn || `${faq.questionEn} - NTE Guide`);
  const description = isZh
    ? (faq.seoDescriptionZh || faq.answer.slice(0, 160))
    : (faq.seoDescriptionEn || faq.answerEn.slice(0, 160));

  return {
    title,
    description,
    alternates: hreflangAlternates(`faq/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function FaqDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const faq = getFaq(slug);
  if (!faq) notFound();

  const question = isZhLocale(locale) ? faq.question : faq.questionEn;
  const answer = isZhLocale(locale) ? faq.answer : faq.answerEn;

  const relatedChars = faq.relatedCharacters
    .map((id) => getCharacter(id))
    .filter(Boolean);

  const relatedMats = faq.relatedMaterials
    .map((id) => getMaterialById(id))
    .filter(Boolean);

  return (
    <>
      <FaqJsonLd faq={faq} lang={locale} />
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "faq.title"), href: `/${lang}/faq` },
          { label: question },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* FAQ Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug">{question}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
              {isZhLocale(locale) ? faq.categoryZh : faq.categoryEn}
            </span>
            <span>{isZhLocale(locale) ? `共 ${faq.tags.length} 个标签` : `${faq.tags.length} tags`}</span>
          </div>
        </header>

        {/* Answer Content Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 sm:p-8">
          <div className="prose prose-invert max-w-none">
            {answer.split("\n").map((line, i) => {
              // Empty line = paragraph break spacer
              if (!line.trim()) {
                return <div key={i} className="h-3" />;
              }

              // Detect list items (e.g. "1）xxx" or "1) xxx" or "- xxx" or "• xxx")
              const isNumberedList = /^[\d]+[）\)]\s*/.test(line);
              const isBulletList = /^[•\-\*]\s/.test(line);

              if (isNumberedList || isBulletList) {
                return (
                  <p key={i} className="text-gray-300 leading-relaxed pl-3 border-l-2 border-primary-500/30 my-1.5 py-0.5">
                    {line}
                  </p>
                );
              }

              // Section headers (short lines ending with Chinese/English colon)
              const isSectionHeader = line.trim().length < 25 && (line.trim().endsWith("：") || line.trim().endsWith(":"));

              if (isSectionHeader) {
                return (
                  <h3 key={i} className="text-base font-semibold text-gray-200 mt-5 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary-500 rounded-full inline-block" />
                    {line}
                  </h3>
                );
              }

              return (
                <p key={i} className="text-gray-300 leading-7 my-3">
                  {line}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {faq.tags && faq.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-800 flex gap-2 flex-wrap">
              {faq.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-800/80 text-gray-400 border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "faqDetails.relatedCharacters")}
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

        {/* Related Materials */}
        {relatedMats.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-4">
              {t(locale, "faqDetails.relatedMaterials")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedMats.map((m) => (
                <Link
                  key={m!.id}
                  href={`/${lang}/materials/${m!.id}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m!.name}</p>
                    <p className="text-xs text-gray-500">
                      {"★".repeat(m!.rarity)} {m!.nameEn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related FAQs (same category) */}
        {(() => {
          const allFaqs = getAllFaqs();
          const relatedFaqs = allFaqs.filter(
            (f) => f.category === faq.category && f.id !== faq.id
          ).slice(0, 5);
          return relatedFaqs.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-lg font-bold mb-4">
                {t(locale, "faq.relatedFaqs")}
              </h2>
              <div className="space-y-3">
                {relatedFaqs.map((rf) => (
                  <Link
                    key={rf.id}
                    href={`/${lang}/faq/${rf.id}`}
                    className="group block rounded-xl border border-gray-800 bg-gray-900/30 p-4 hover:border-primary-500/50 hover:bg-gray-900/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium group-hover:text-primary-300 transition-colors">
                        {isZhLocale(locale) ? rf.question : rf.questionEn}
                      </h3>
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-colors flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null;
        })()}

        {/* Calculator CTA */}
        <div className="text-center py-8 mt-8">
          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
          >
            {t(locale, "characters.calculatorCta")}
          </Link>
        </div>
      </article>
    </>
  );
}
