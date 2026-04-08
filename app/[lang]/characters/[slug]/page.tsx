import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "../../../../lib/i18n";
import {
  getCharacter,
  getCharacterMaterials,
  getMaterialById,
  getAllCharacters,
} from "../../../../lib/queries";

export function generateStaticParams() {
  const characters = getAllCharacters();
  return characters.flatMap((c: { id: string }) => [
    { lang: "zh", slug: c.id },
    { lang: "en", slug: c.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const character = getCharacter(slug);
  if (!character) return {};
  return {
    title:
      lang === "zh"
        ? `${character.name} 升级材料 & 养成攻略`
        : `${character.nameEn} Leveling Materials & Build Guide`,
    description:
      lang === "zh"
        ? `异环 ${character.name} 完整升级材料列表，包含所有养成所需材料及获取方式。`
        : `Complete ${character.nameEn} leveling material list for YiHuan, including all farming materials and sources.`,
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as "zh" | "en";
  const character = getCharacter(slug);
  if (!character) notFound();

  const cm = getCharacterMaterials(slug);

  const elementColors: Record<string, string> = {
    electric: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    fire: "border-orange-500 bg-orange-500/10 text-orange-400",
    ice: "border-blue-500 bg-blue-500/10 text-blue-400",
    physical: "border-purple-500 bg-purple-500/10 text-purple-400",
    ether: "border-pink-500 bg-pink-500/10 text-pink-400",
  };

  const elementLabels: Record<string, string> = {
    electric: lang === "zh" ? "电" : "Electric",
    fire: lang === "zh" ? "火" : "Fire",
    ice: lang === "zh" ? "冰" : "Ice",
    physical: lang === "zh" ? "物理" : "Physical",
    ether: lang === "zh" ? "以太" : "Ether",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Character Info Card */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
            <span className="text-3xl text-gray-600">{character.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{character.name}</h1>
            <p className="text-gray-500">{character.nameEn}</p>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs border ${
                  elementColors[character.element] || ""
                }`}
              >
                {elementLabels[character.element] || character.element}
              </span>
              <span className="text-yellow-500 text-sm">
                {"★".repeat(character.rarity)}
              </span>
            </div>
            {character.description && (
              <p className="mt-3 text-sm text-gray-400">{character.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Leveling Materials */}
      {cm && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, "characters.levelingMaterials")}</h2>
          <div className="space-y-4">
            {cm.levelingMaterials.map((lr) => {
              const [start, end] = lr.levelRange.split("-");
              return (
                <div
                  key={lr.levelRange}
                  className="rounded-lg border border-gray-800 bg-gray-900/30 p-4"
                >
                  <h3 className="text-sm font-medium text-primary-400 mb-3">
                    {lang === "zh" ? `等级 ${lr.levelRange}` : `Level ${lr.levelRange}`}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lr.materials.map((m) => {
                      const material = getMaterialById(m.id);
                      if (!material) return null;
                      return (
                        <Link
                          key={m.id}
                          href={`/${lang}/materials/${m.id}`}
                          className="flex items-center justify-between px-3 py-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-sm truncate">
                            {lang === "zh" ? material.name : material.nameEn}
                          </span>
                          <span className="text-sm font-mono text-primary-400 ml-2">
                            x{m.quantity}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skill Materials */}
      {cm && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, "characters.skillMaterials")}</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cm.skillMaterials.map((m) => {
                const material = getMaterialById(m.id);
                if (!material) return null;
                return (
                  <Link
                    key={m.id}
                    href={`/${lang}/materials/${m.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm truncate">
                      {lang === "zh" ? material.name : material.nameEn}
                    </span>
                    <span className="text-sm font-mono text-primary-400 ml-2">
                      x{m.quantity}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Calculator CTA */}
      <div className="text-center py-8">
        <Link
          href={`/${lang}/calculator/leveling?character=${slug}`}
          className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
        >
          {t(locale, "characters.calculatorCta")}
        </Link>
      </div>
    </div>
  );
}
