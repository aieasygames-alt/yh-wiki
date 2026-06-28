import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "../../../../../components/Breadcrumb";
import { getAllADUnits, getADUnit } from "../../../../../lib/ad-queries";

export function generateStaticParams() {
  return getAllADUnits().map((u) => ({ lang: "en", slug: u.id }));
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const unit = getADUnit(slug);
  if (!unit) return {};

  const fullName = unit.variant ? `${unit.name} (${unit.variant})` : unit.name;
  return {
    title: `${fullName} - Stats, Tier & Roles | Anime Destiny Wiki`,
    description: unit.description,
    alternates: { canonical: `https://nteguide.com/en/anime-destiny/units/${slug}` },
    openGraph: {
      title: `${fullName} | Anime Destiny Wiki`,
      description: unit.description,
      type: "article",
      url: `https://nteguide.com/en/anime-destiny/units/${slug}`,
    },
  };
}

const rarityText: Record<string, string> = {
  Secret: "text-amber-400",
  Mythic: "text-purple-400",
  "Mythic BattlePass": "text-purple-400",
  Legendary: "text-yellow-400",
  Rare: "text-blue-400",
};

export default async function ADUnitDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const { slug } = await params;
  const unit = getADUnit(slug);
  if (!unit) notFound();

  const fullName = unit.variant ? `${unit.name} (${unit.variant})` : unit.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: fullName,
    description: unit.description,
    mainEntity: {
      "@type": "VideoGame",
      name: "Anime Destiny",
      gamePlatform: "Roblox",
      genre: "Tower Defense",
    },
  };

  let synergyUnit = null;
  if (unit.synergy) {
    synergyUnit = getADUnit(unit.synergy);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: "Units", href: "/en/anime-destiny/units" },
        { label: unit.name },
      ]} />

      <div className="mx-auto max-w-3xl px-4 py-12">

        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {unit.name}
                {unit.variant && <span className="text-gray-500"> ({unit.variant})</span>}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className={`text-sm font-medium ${rarityText[unit.rarity] || "text-gray-400"}`}>{unit.rarity}</span>
                <span className="rounded bg-purple-600/20 px-2 py-0.5 text-xs text-purple-400">Tier {unit.tier}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-gray-400">{unit.description}</p>
        </div>

        {/* Roles */}
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-white">Roles</h2>
          <div className="flex flex-wrap gap-2">
            {unit.roles.map((role) => (
              <span key={role} className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-1.5 text-sm text-gray-300">
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Combat Stats */}
        {unit.stats && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Combat Stats</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-xs text-gray-500">Damage</div>
                <div className="text-sm font-semibold text-white">{unit.stats.damage}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-xs text-gray-500">Range</div>
                <div className="text-sm font-semibold text-white">{unit.stats.range}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-xs text-gray-500">Attack Speed</div>
                <div className="text-sm font-semibold text-white">{unit.stats.attackSpeed}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-xs text-gray-500">AOE</div>
                <div className="text-sm font-semibold text-white">{unit.stats.aoe}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-xs text-gray-500">Attack Type</div>
                <div className="text-sm font-semibold text-white">{unit.stats.attackType}</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="text-xs text-gray-500">Placement Cost</div>
                <div className="text-sm font-semibold text-white">{unit.stats.placementCost}</div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Table */}
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-white">Overview</h2>
          <table className="w-full rounded-lg border border-gray-800">
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-500">Rarity</td>
                <td className={`px-4 py-2 text-sm font-medium ${rarityText[unit.rarity] || "text-gray-300"}`}>{unit.rarity}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-500">Tier</td>
                <td className="px-4 py-2 text-sm font-medium text-white">{unit.tier}</td>
              </tr>
              {unit.variant && (
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-500">Variant</td>
                  <td className="px-4 py-2 text-sm font-medium text-white">{unit.variant}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Upgrade Path */}
        {unit.upgrades && unit.upgrades.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Upgrade Path</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Level</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Damage</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {unit.upgrades.map((upgrade) => (
                    <tr key={upgrade.level}>
                      <td className="px-4 py-2 text-sm font-medium text-purple-400">Lv {upgrade.level}</td>
                      <td className="px-4 py-2 text-sm text-gray-300">{upgrade.cost}</td>
                      <td className="px-4 py-2 text-sm font-semibold text-white">{upgrade.damage}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{upgrade.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Evolution */}
        {unit.evolution && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Evolution</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              {unit.evolution.from ? (
                <p className="mb-2 text-sm text-gray-400">
                  Evolves from <span className="font-medium text-purple-400">{unit.evolution.from}</span>
                </p>
              ) : (
                <p className="mb-2 text-sm text-gray-400">Base unit — no pre-evolution.</p>
              )}
              <div className="mb-3">
                <div className="text-xs text-gray-500">Materials Required</div>
                <ul className="mt-1 space-y-1">
                  {unit.evolution.materials.map((mat) => (
                    <li key={mat} className="text-sm text-gray-300">
                      <span className="mr-1 text-gray-600">•</span>{mat}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-500">{unit.evolution.notes}</p>
            </div>
          </div>
        )}

        {/* Synergy */}
        {synergyUnit && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Synergy</h2>
            <Link
              href={`/en/anime-destiny/units/${synergyUnit.id}`}
              className="block rounded-lg border border-purple-700/50 bg-purple-900/10 p-4 transition-colors hover:bg-purple-900/20"
            >
              <span className="font-medium text-purple-400">
                {synergyUnit.name}
                {synergyUnit.variant && <span className="text-gray-500"> ({synergyUnit.variant})</span>}
              </span>
              <p className="mt-1 text-sm text-gray-500">{synergyUnit.description}</p>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link href="/en/anime-destiny/units" className="text-sm text-purple-400 hover:underline">
            ← All Units
          </Link>
          <Link href="/en/anime-destiny/tier-list" className="text-sm text-purple-400 hover:underline">
            View Tier List →
          </Link>
        </div>
      </div>
    </>
  );
}
