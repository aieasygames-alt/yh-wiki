import { t, hreflangAlternates } from "../../../lib/i18n";
import { getAllGuides, getGuideCategories } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: t(locale, "guides.title"),
    description: t(locale, "guides.description"),
    alternates: hreflangAlternates("guides"),
    openGraph: {
      title: t(locale, "guides.title"),
      description: t(locale, "guides.description"),
      type: "website",
    },
  };
}

export default async function GuidesListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  const guides = getAllGuides();
  const categories = getGuideCategories(locale);

  const guidesByCategory = categories.map((cat) => ({
    ...cat,
    guides: guides.filter((g) => g.category === cat.slug),
  }));

  return (
    <>
      <ItemListJsonLd
        items={guides.map((g) => ({
          name: locale === "zh" ? g.title : g.titleEn,
          url: `https://nteguide.com/${lang}/guides/${g.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "guides.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "guides.title")}</h1>

        {guidesByCategory.map((cat) => (
          <section key={cat.slug} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary-400">{cat.name}</h2>
            <div className="space-y-4">
              {cat.guides.map((guide) => (
                <a
                  key={guide.id}
                  href={`/${lang}/guides/${guide.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 p-5 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                >
                  <h3 className="text-base font-medium">
                    {locale === "zh" ? guide.title : guide.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {locale === "zh" ? guide.summary : guide.summaryEn}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {guide.tags.slice(0, 3).map((tag) => (
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
