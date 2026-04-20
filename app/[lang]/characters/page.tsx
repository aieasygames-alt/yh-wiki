import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { CharacterFilter } from "../../../components/CharacterFilter";

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
  const characters = getAllCharacters();

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
        <CharacterFilter characters={characters} locale={locale} lang={lang} />
      </div>
    </>
  );
}
