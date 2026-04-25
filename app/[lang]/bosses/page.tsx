import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getGuide } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";

const BOSS_GUIDE_ID = "boss-guide-comprehensive";

export function generateStaticParams() {
  return [
    { lang: "zh" },
    { lang: "tw" },
    { lang: "en" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const guide = getGuide(BOSS_GUIDE_ID);
  if (!guide) return {};

  const title = isZhLocale(lang) ? guide.title : guide.titleEn;
  const description = isZhLocale(lang) ? guide.summary : guide.summaryEn;
  return {
    title: `${title} - ${isZhLocale(lang) ? "异环攻略" : "Neverness to Everness Guide"} | NTE Guide`,
    description,
    alternates: hreflangAlternates("bosses", lang),
    openGraph: {
      title: `${title} - ${isZhLocale(lang) ? "异环攻略" : "Neverness to Everness Guide"} | NTE Guide`,
      description,
      type: "article",
    },
  };
}

export default async function BossGuidePage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const guide = getGuide(BOSS_GUIDE_ID);
  if (!guide) notFound();

  const title = isZhLocale(locale) ? guide.title : guide.titleEn;
  const content = isZhLocale(locale) ? guide.content : guide.contentEn;
  const summary = isZhLocale(locale) ? guide.summary : guide.summaryEn;

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={summary}
        url={`https://nteguide.com/${lang}/bosses`}
      />
      {guide.faq && guide.faq.length > 0 && (
        <FaqPageJsonLd faqs={guide.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? "Boss攻略" : "Boss Guide" },
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
          {content.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* FAQ Section */}
        {guide.faq && guide.faq.length > 0 && (
          <FaqSection faqs={guide.faq} locale={locale} />
        )}
      </article>
    </>
  );
}
