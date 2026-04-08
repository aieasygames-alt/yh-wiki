import Link from "next/link";
import { t } from "../../../lib/i18n";
import { getAllCharacters } from "../../../lib/queries";

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

  const elementColors: Record<string, string> = {
    electric: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    fire: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    ice: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    physical: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    ether: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

  const elementLabels: Record<string, string> = {
    electric: lang === "zh" ? "电" : "Electric",
    fire: lang === "zh" ? "火" : "Fire",
    ice: lang === "zh" ? "冰" : "Ice",
    physical: lang === "zh" ? "物理" : "Physical",
    ether: lang === "zh" ? "以太" : "Ether",
  };

  return (
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
                className={`text-xs px-2 py-0.5 rounded border ${
                  elementColors[c.element] || ""
                }`}
              >
                {elementLabels[c.element] || c.element}
              </span>
              <span className="text-xs text-yellow-500">
                {"★".repeat(c.rarity)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
