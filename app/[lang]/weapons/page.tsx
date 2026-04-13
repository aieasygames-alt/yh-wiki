import { t, hreflangAlternates } from "../../../lib/i18n";
import { getAllWeapons } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { WeaponCard } from "../../../components/WeaponCard";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: t(locale, "weapons.title"),
    description: t(locale, "weapons.description"),
    alternates: hreflangAlternates("weapons", lang),
    openGraph: {
      title: t(locale, "weapons.title"),
      description: t(locale, "weapons.description"),
      type: "website",
    },
  };
}

export default async function WeaponsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  const weapons = getAllWeapons();

  return (
    <>
      <ItemListJsonLd
        items={weapons.map((w) => ({
          name: locale === "zh" ? w.name : w.nameEn,
          url: `https://nteguide.com/${lang}/weapons/${w.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.weapons") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "weapons.title")}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {weapons.map((w) => (
            <WeaponCard
              key={w.id}
              id={w.id}
              name={w.name}
              nameEn={w.nameEn}
              type={w.type}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </>
  );
}
