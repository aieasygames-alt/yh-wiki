import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllLore } from "../../../lib/queries";
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
    title: t(locale, "lore.title"),
    description: t(locale, "lore.description"),
    alternates: hreflangAlternates("lore", lang),
    openGraph: {
      title: t(locale, "lore.title"),
      description: t(locale, "lore.description"),
      type: "website",
    },
  };
}

export default async function LoreListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const loreItems = getAllLore();

  const categories = Array.from(
    new Set(loreItems.map((l) => l.category))
  ).map((cat) => {
    const item = loreItems.find((l) => l.category === cat)!;
    return { slug: cat, name: isZhLocale(locale) ? item.categoryZh : item.categoryEn };
  });

  const loreByCategory = categories.map((cat) => ({
    ...cat,
    items: loreItems.filter((l) => l.category === cat.slug),
  }));

  return (
    <>
      <ItemListJsonLd
        items={loreItems.map((l) => ({
          name: isZhLocale(locale) ? l.name : l.nameEn,
          url: `https://nteguide.com/${lang}/lore/${l.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "lore.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "lore.title")}</h1>

        {loreByCategory.map((cat) => (
          <section key={cat.slug} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary-400">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <a
                  key={item.id}
                  href={`/${lang}/lore/${item.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/30 p-5 hover:border-primary-500/50 hover:bg-gray-900/50 transition-colors"
                >
                  <h3 className="text-base font-medium">
                    {isZhLocale(locale) ? item.name : item.nameEn}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {isZhLocale(locale) ? item.summary : item.summaryEn}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
