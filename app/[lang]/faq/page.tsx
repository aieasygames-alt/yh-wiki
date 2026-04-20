import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllFaqs, getFaqCategories } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "faq.title"),
    description: t(locale, "faq.description"),
    alternates: hreflangAlternates("faq", lang),
    openGraph: {
      title: t(locale, "faq.title"),
      description: t(locale, "faq.description"),
      type: "website",
    },
  };
}

export default async function FaqListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const faqs = getAllFaqs();
  const categories = getFaqCategories(locale);

  const faqsByCategory = categories.map((cat) => ({
    ...cat,
    faqs: faqs.filter((f) => f.category === cat.slug),
  }));

  return (
    <>
      <ItemListJsonLd
        items={faqs.map((f) => ({
          name: isZhLocale(locale) ? f.question : f.questionEn,
          url: `https://nteguide.com/${lang}/faq/${f.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "faq.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "faq.title")}</h1>

        {faqsByCategory.map((cat) => (
          <section key={cat.slug} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary-400">{cat.name}</h2>
            <div className="space-y-4">
              {cat.faqs.map((faq) => (
                <a
                  key={faq.id}
                  href={`/${lang}/faq/${faq.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 p-5 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                >
                  <h3 className="text-base font-medium">
                    {isZhLocale(locale) ? faq.question : faq.questionEn}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {isZhLocale(locale) ? faq.answer : faq.answerEn}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {faq.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
