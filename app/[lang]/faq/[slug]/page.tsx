import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getFaq, getAllFaqs, getCharacter, getMaterialById } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { FaqJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const faqs = getAllFaqs();
  return faqs.flatMap((f) => [
    { lang: "zh", slug: f.id },
    { lang: "tw", slug: f.id },
    { lang: "en", slug: f.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const faq = getFaq(slug);
  if (!faq) return {};
  const question = isZhLocale(lang) ? faq.question : faq.questionEn;
  return {
    title: `${question}${isZhLocale(lang) ? " | 异环 Wiki" : " - NTE Guide"}`,
    description: isZhLocale(lang) ? faq.answer.slice(0, 160) : faq.answerEn.slice(0, 160),
    alternates: hreflangAlternates(`faq/${slug}`, lang),
    openGraph: {
      title: `${question}${isZhLocale(lang) ? " | 异环 Wiki" : " - NTE Guide"}`,
      description: isZhLocale(lang) ? faq.answer.slice(0, 160) : faq.answerEn.slice(0, 160),
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
        <h1 className="text-2xl font-bold mb-6">{question}</h1>
        <div className="prose prose-invert max-w-none">
          {answer.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              {isZhLocale(locale) ? "相关角色" : "Related Characters"}
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
              {isZhLocale(locale) ? "相关材料" : "Related Materials"}
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
                    className="block rounded-lg border border-gray-800 bg-gray-900/30 p-4 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                  >
                    <h3 className="text-sm font-medium">
                      {isZhLocale(locale) ? rf.question : rf.questionEn}
                    </h3>
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
