import Link from "next/link";
import { notFound } from "next/navigation";
import { t, hreflangAlternates } from "../../../../lib/i18n";
import { getWeapon, getAllWeapons, getCharactersUsingWeapon } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const weapons = getAllWeapons();
  return weapons.flatMap((w: { id: string }) => [
    { lang: "zh", slug: w.id },
    { lang: "en", slug: w.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const weapon = getWeapon(slug);
  if (!weapon) return {};
  return {
    title:
      lang === "zh"
        ? `${weapon.name} - 异环武器`
        : `${weapon.nameEn} - YiHuan Weapon`,
    description:
      lang === "zh"
        ? `异环武器「${weapon.name}」详细介绍，包含武器类型和使用角色。`
        : `Detailed guide for YiHuan weapon "${weapon.nameEn}", including weapon type and characters who use it.`,
    alternates: hreflangAlternates(`weapons/${slug}`),
    openGraph: {
      title:
        lang === "zh"
          ? `${weapon.name} | 异环 Wiki`
          : `${weapon.nameEn} | YiHuan Wiki`,
      description:
        lang === "zh"
          ? `异环武器「${weapon.name}」介绍`
          : `YiHuan weapon "${weapon.nameEn}" guide`,
      type: "article",
    },
  };
}

const TYPE_LABELS: Record<string, Record<"zh" | "en", string>> = {
  melee: { zh: "近战", en: "Melee" },
  ranged: { zh: "远程", en: "Ranged" },
  magic: { zh: "异能", en: "Esper" },
  companion: { zh: "伴生体", en: "Companion" },
  summon: { zh: "召唤", en: "Summon" },
  support: { zh: "辅助", en: "Support" },
};

export default async function WeaponDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as "zh" | "en";
  const weapon = getWeapon(slug);
  if (!weapon) notFound();

  const characters = getCharactersUsingWeapon(slug);

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.weapons"), href: `/${lang}/weapons` },
          { label: locale === "zh" ? weapon.name : weapon.nameEn },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Weapon Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{locale === "zh" ? weapon.name : weapon.nameEn}</h1>
              <p className="text-gray-500">{locale === "zh" ? weapon.nameEn : weapon.name}</p>
              <div className="mt-2">
                <span className="text-xs px-3 py-1 rounded-full border bg-gray-800 text-gray-300">
                  {TYPE_LABELS[weapon.type]?.[locale] || weapon.type}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            {locale === "zh" ? weapon.description : weapon.descriptionEn}
          </p>
        </div>

        {/* Related Characters */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, "weapons.relatedCharacters")}</h2>
          {characters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {characters.map((c) => (
                <Link
                  key={c.id}
                  href={`/${lang}/characters/${c.id}`}
                  className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
                >
                  <h3 className="font-medium text-sm truncate">{locale === "zh" ? c.name : c.nameEn}</h3>
                  <p className="text-xs text-gray-500 truncate">{locale === "zh" ? c.nameEn : c.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold ${c.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
                      {c.rank}
                    </span>
                    <span className="text-xs text-gray-500">{locale === "zh" ? c.role : c.roleEn}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </section>

        {/* Calculator CTA */}
        <div className="text-center py-8">
          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
          >
            {t(locale, "characters.calculatorCta")}
          </Link>
        </div>
      </div>
    </>
  );
}
