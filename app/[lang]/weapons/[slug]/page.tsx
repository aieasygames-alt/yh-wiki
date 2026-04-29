import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getWeapon, getAllWeapons, getCharactersUsingWeapon } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ProductJsonLd } from "../../../../components/JsonLd";
import { WeaponSummary } from "../../../../components/WeaponSummary";
import { GameImage } from "../../../../components/GameImage";
import { ARC_TYPE_LABELS, ARC_RANK_LABELS, SUBSTAT_LABELS, OBTAIN_METHOD_LABELS } from "../../../../lib/attributes";

export function generateStaticParams() {
  const weapons = getAllWeapons();
  return weapons.flatMap((w: { id: string }) => [
    { lang: "zh", slug: w.id },
    { lang: "tw", slug: w.id },
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
  const locale = lang as Locale;
  const displayName = locale === "en" ? weapon.nameEn : (locale === "tw" ? (weapon.nameTw || weapon.name) : weapon.name);
  return {
    title:
      locale === "tw"
        ? `${displayName} 屬性與獲取方式 | 異環弧盤 Wiki`
        : isZhLocale(locale)
        ? `${displayName} 属性、精炼与获取方式 | 异环弧盘 Wiki`
        : `${weapon.nameEn} Stats & Best Characters - NTE Arc Disks`,
    description:
      locale === "tw"
        ? `異環弧盤「${displayName}」${weapon.rank}級${ARC_TYPE_LABELS[weapon.type]?.tw || weapon.type}屬性、被動效果與獲取方式。`
        : isZhLocale(locale)
        ? `异环弧盘「${displayName}」${weapon.rank}级${ARC_TYPE_LABELS[weapon.type]?.zh || weapon.type}属性、被动效果及获取方式详解。`
        : `${weapon.nameEn} ${weapon.rank}-Rank ${ARC_TYPE_LABELS[weapon.type]?.en || weapon.type} Arc in NTE. ATK ${weapon.baseAtk}, ${SUBSTAT_LABELS[weapon.substat]?.en || weapon.substat} ${weapon.substatValue}. Complete stats and guide.`,
    alternates: hreflangAlternates(`weapons/${slug}`, lang),
    openGraph: {
      title: isZhLocale(locale) ? `${displayName} | 异环弧盘 Wiki` : `${weapon.nameEn} Stats | NTE`,
      description: isZhLocale(locale) ? `异环弧盘「${displayName}」详细属性与获取方式。` : `${weapon.nameEn} stats in Neverness to Everness`,
      type: "article",
    },
  };
}

export default async function WeaponDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const weapon = getWeapon(slug);
  if (!weapon) notFound();

  const characters = getCharactersUsingWeapon(slug);
  const displayName = locale === "en" ? weapon.nameEn : (locale === "tw" ? (weapon.nameTw || weapon.name) : weapon.name);
  const altName = locale === "en" ? weapon.name : weapon.nameEn;
  const typeLabel = ARC_TYPE_LABELS[weapon.type]?.[locale] || weapon.type;
  const rankLabel = ARC_RANK_LABELS[weapon.rank]?.[locale] || weapon.rank;
  const substatLabel = SUBSTAT_LABELS[weapon.substat]?.[locale] || weapon.substat;
  const effectName = locale === "en" ? weapon.effectNameEn : (locale === "tw" ? (weapon.effectNameTw || weapon.effectName) : weapon.effectName);
  const effectDesc = locale === "en" ? weapon.effectDescriptionEn : (locale === "tw" ? (weapon.effectDescriptionTw || weapon.effectDescription) : weapon.effectDescription);
  const obtainDesc = locale === "en" ? weapon.howToObtainEn : (locale === "tw" ? weapon.howToObtainZh : weapon.howToObtainZh);
  const obtainLabel = OBTAIN_METHOD_LABELS[weapon.howToObtain]?.[locale] || weapon.howToObtain;

  return (
    <>
      <ProductJsonLd name={displayName} description={effectDesc} url={`https://nteguide.com/${lang}/weapons/${slug}`} image="https://nteguide.com/og-weapon.svg" />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.weapons"), href: `/${lang}/weapons` },
          { label: displayName },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Weapon Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage
              type="weapon"
              id={weapon.id}
              name={weapon.name}
              className="w-24 h-24 rounded-lg shrink-0"
              priority
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-sm font-bold ${weapon.rank === "S" ? "text-yellow-400" : weapon.rank === "A" ? "text-purple-400" : "text-blue-400"}`}>
                  {rankLabel}
                </span>
                <span className="text-xs px-2 py-0.5 rounded border bg-gray-800 text-gray-300">
                  {typeLabel}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-gray-500 text-sm">{altName}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">ATK</p>
              <p className="text-lg font-bold text-primary-400">{weapon.baseAtk}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">{substatLabel}</p>
              <p className="text-lg font-bold text-primary-400">{weapon.substatValue}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">{locale === "en" ? "Source" : locale === "tw" ? "來源" : "来源"}</p>
              <p className="text-sm font-medium text-gray-300">{obtainLabel}</p>
            </div>
          </div>
        </div>

        <WeaponSummary
          name={weapon.name} nameTw={weapon.nameTw} nameEn={weapon.nameEn}
          rank={weapon.rank} type={weapon.type}
          baseAtk={weapon.baseAtk} substat={weapon.substat} substatValue={weapon.substatValue}
          howToObtain={weapon.howToObtain} howToObtainZh={weapon.howToObtainZh} howToObtainEn={weapon.howToObtainEn}
          relatedCharacters={characters.map(c => ({ name: c.name, nameTw: c.nameTw || "", nameEn: c.nameEn }))}
          locale={locale}
        />

        {/* Passive Effect */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-xl font-bold mb-3">
            {locale === "en" ? "Arc Effect" : locale === "tw" ? "弧盤效果" : "弧盘效果"}
            {effectName !== weapon.effectNameEn && effectName !== weapon.effectName && (
              <span className="text-gray-500 font-normal text-sm ml-2">
                {locale === "en" ? weapon.effectName : weapon.effectNameEn}
              </span>
            )}
          </h2>
          <h3 className="text-primary-400 font-semibold mb-2">
            {locale === "en" ? weapon.effectNameEn : (locale === "tw" ? (weapon.effectNameTw || weapon.effectName) : weapon.effectName)}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{effectDesc}</p>
        </section>

        {/* How to Obtain */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-xl font-bold mb-3">
            {locale === "en" ? "How to Obtain" : locale === "tw" ? "獲取方式" : "获取方式"}
          </h2>
          <div className="flex items-start gap-3">
            <span className="text-xs px-2 py-1 rounded border bg-primary-500/20 text-primary-400 border-primary-500/30 whitespace-nowrap">
              {obtainLabel}
            </span>
            <p className="text-sm text-gray-300">{obtainDesc}</p>
          </div>
        </section>

        {/* Related Characters */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, "weapons.relatedCharacters")}</h2>
          {characters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {characters.map((c) => {
                const charName = locale === "en" ? c.nameEn : (locale === "tw" ? (c.nameTw || c.name) : c.name);
                return (
                  <Link
                    key={c.id}
                    href={`/${lang}/characters/${c.id}`}
                    className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
                  >
                    <h3 className="font-medium text-sm truncate">{charName}</h3>
                    <p className="text-xs text-gray-500 truncate">{locale === "en" ? c.name : c.nameEn}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-bold ${c.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
                        {c.rank}
                      </span>
                      <span className="text-xs text-gray-500">{isZhLocale(locale) ? c.role : c.roleEn}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </section>
      </div>
    </>
  );
}
