import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
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
  const locale = lang as Locale;
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

const TYPE_ORDER = ["melee", "companion", "magic", "ranged", "summon", "support"];

const TYPE_LABELS: Record<string, Record<Locale, string>> = {
  melee: { zh: "近战武器", tw: "近战武器", en: "Melee Weapons" },
  companion: { zh: "伴生体武器", tw: "伴生体武器", en: "Companion Weapons" },
  magic: { zh: "异能武器", tw: "异能武器", en: "Esper Weapons" },
  ranged: { zh: "远程武器", tw: "远程武器", en: "Ranged Weapons" },
  summon: { zh: "召唤武器", tw: "召唤武器", en: "Summon Weapons" },
  support: { zh: "辅助武器", tw: "辅助武器", en: "Support Weapons" },
};

export default async function WeaponsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const weapons = getAllWeapons();

  const weaponsByType = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type]?.[locale] || type,
    weapons: weapons.filter((w) => w.type === type),
  })).filter((group) => group.weapons.length > 0);

  return (
    <>
      <ItemListJsonLd
        items={weapons.map((w) => ({
          name: isZhLocale(locale) ? w.name : w.nameEn,
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
        <h1 className="text-3xl font-bold mb-2">{t(locale, "weapons.title")}</h1>
        <p className="text-gray-400 mb-8">{t(locale, "weapons.description")}</p>

        {weaponsByType.map((group) => (
          <section key={group.type} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary-400">{group.label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.weapons.map((w) => (
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
          </section>
        ))}
      </div>
    </>
  );
}
