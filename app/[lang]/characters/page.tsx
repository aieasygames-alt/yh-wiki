import Link from "next/link";
import { t } from "../../../lib/i18n";
import { getAllCharacters } from "../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";

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
            <Link
              key={c.id}
              href={`/${lang}/characters/${c.id}`}
              className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
            >
              <div className="w-full aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                <span className="text-2xl text-gray-600">{c.name.charAt(0)}</span>
              </div>
              <h3 className="font-medium truncate">{c.name}</h3>
              <p className="text-xs text-gray-500 truncate">{c.nameEn}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(c.attribute)}`}
                >
                  {getAttributeLabel(c.attribute, locale)}
                </span>
                <span className={`text-xs font-bold ${c.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
                  {c.rank}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
