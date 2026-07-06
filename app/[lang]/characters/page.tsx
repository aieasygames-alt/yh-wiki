import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { CharacterFilter } from "../../../components/CharacterFilter";
import { KardzPromoCard } from "../../../components/KardzPromoCard";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "characters.title"),
    description: t(locale, "characters.description"),
    alternates: hreflangAlternates("characters", lang),
    openGraph: {
      title: t(locale, "characters.title"),
      description: t(locale, "characters.description"),
      type: "website",
    },
  };
}

export default async function CharactersPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const allCharacters = getAllCharacters();
  const priorityLinks = [
    { id: "shinku", en: "Shinku NTE guide", zh: "沁红攻略", tw: "沁紅攻略" },
    { id: "black-bird", en: "Black Bird NTE guide", zh: "黑鸟攻略", tw: "黑鳥攻略" },
    { id: "akane", en: "Akane NTE guide", zh: "Akane 攻略", tw: "Akane 攻略" },
    { id: "lingko", en: "Lingko NTE guide", zh: "凛子攻略", tw: "凛子攻略" },
    { id: "illica", en: "Illica NTE guide", zh: "伊洛伊攻略", tw: "伊洛伊攻略" },
    { id: "renee", en: "Renee NTE guide", zh: "蕾妮攻略", tw: "蕾妮攻略" },
    { id: "nitsa", en: "Nitsa NTE guide", zh: "尼察攻略", tw: "尼察攻略" },
  ].filter((link) => allCharacters.some((character) => character.id === link.id));

  return (
    <>
      <ItemListJsonLd
        items={characters.map((c) => ({
          name: isZhLocale(locale) ? c.name : c.nameEn,
          url: `https://nteguide.com/${lang}/characters/${c.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.characters") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "characters.title")}</h1>
        <div className="mb-6">
          <KardzPromoCard locale={locale} variant="banner" />
        </div>
        {priorityLinks.length > 0 && (
          <nav className="mb-6 rounded-xl border border-gray-800 bg-gray-900/40 p-4" aria-label={isZhLocale(locale) ? "热门角色攻略" : "Popular NTE character guides"}>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">
              {isZhLocale(locale) ? (locale === "tw" ? "熱門搜尋" : "热门搜索") : "Popular searches"}
            </p>
            <div className="flex flex-wrap gap-2">
              {priorityLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/${lang}/characters/${link.id}`}
                  className="rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors"
                >
                  {locale === "tw" ? link.tw : isZhLocale(locale) ? link.zh : link.en}
                </Link>
              ))}
            </div>
          </nav>
        )}
        <CharacterFilter characters={characters} locale={locale} lang={lang} />
      </div>
    </>
  );
}
