import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllMaterials } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { MaterialFilter } from "../../../components/MaterialFilter";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "materials.title"),
    description: t(locale, "materials.description"),
    alternates: hreflangAlternates("materials", lang),
    openGraph: {
      title: t(locale, "materials.title"),
      description: t(locale, "materials.description"),
      type: "website",
    },
  };
}

export default async function MaterialsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const materials = getAllMaterials();

  return (
    <>
      <ItemListJsonLd
        items={materials.map((m) => ({
          name: isZhLocale(locale) ? m.name : m.nameEn,
          url: `https://nteguide.com/${lang}/materials/${m.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.materials") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "materials.title")}</h1>
        <MaterialFilter materials={materials} locale={locale} lang={lang} />
      </div>
    </>
  );
}
