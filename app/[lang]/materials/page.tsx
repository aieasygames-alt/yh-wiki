import { t, hreflangAlternates } from "../../../lib/i18n";
import { getAllMaterials } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { MaterialCard } from "../../../components/MaterialCard";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: t(locale, "materials.title"),
    description: t(locale, "materials.description"),
    alternates: hreflangAlternates("materials"),
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
  const locale = lang as "zh" | "en";
  const materials = getAllMaterials();

  return (
    <>
      <ItemListJsonLd
        items={materials.map((m) => ({
          name: locale === "zh" ? m.name : m.nameEn,
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {materials.map((m) => (
            <MaterialCard
              key={m.id}
              id={m.id}
              name={m.name}
              nameEn={m.nameEn}
              rarity={m.rarity}
              type={m.type}
              locale={locale}
              showType
            />
          ))}
        </div>
      </div>
    </>
  );
}
