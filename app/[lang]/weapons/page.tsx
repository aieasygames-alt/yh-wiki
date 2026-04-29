import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllWeapons } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { WeaponCard } from "../../../components/WeaponCard";
import { ARC_TYPE_LABELS, ARC_RANK_LABELS } from "../../../lib/attributes";

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

const RANK_ORDER = ["S", "A", "B"];
const TYPE_ORDER = ["solid", "liquid", "gas", "plasma", "synthesis"];

export default async function WeaponsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const weapons = getAllWeapons();

  const weaponsByRank = RANK_ORDER.map((rank) => ({
    rank,
    rankLabel: ARC_RANK_LABELS[rank]?.[locale] || rank,
    types: TYPE_ORDER.map((type) => ({
      type,
      typeLabel: ARC_TYPE_LABELS[type]?.[locale] || type,
      weapons: weapons.filter((w) => w.rank === rank && w.type === type),
    })).filter((group) => group.weapons.length > 0),
  })).filter((group) => group.types.length > 0);

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

        {weaponsByRank.map((rankGroup) => (
          <section key={rankGroup.rank} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary-400">{rankGroup.rankLabel}</h2>
            {rankGroup.types.map((typeGroup) => (
              <div key={typeGroup.type} className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">{typeGroup.typeLabel}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {typeGroup.weapons.map((w) => (
                    <WeaponCard
                      key={w.id}
                      id={w.id}
                      name={w.name}
                      nameTw={w.nameTw}
                      nameEn={w.nameEn}
                      rank={w.rank}
                      type={w.type}
                      baseAtk={w.baseAtk}
                      substat={w.substat}
                      substatValue={w.substatValue}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
