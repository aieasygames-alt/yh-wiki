import { t, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { CharacterCard } from "../../../components/CharacterCard";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: t(locale, "characters.title"),
    description: t(locale, "characters.description"),
    alternates: hreflangAlternates("characters"),
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
  const locale = lang as "zh" | "en";
  const characters = getAllCharacters();

  return (
    <>
      <ItemListJsonLd
        items={characters.map((c) => ({
          name: locale === "zh" ? c.name : c.nameEn,
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((c) => (
            <CharacterCard
              key={c.id}
              id={c.id}
              name={c.name}
              nameEn={c.nameEn}
              attribute={c.attribute}
              rank={c.rank}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </>
  );
}
