import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { getAllADUnits, type ADUnit } from "../../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Anime Destiny Units - All Characters & Stats | nteguide.com",
    description: "Browse all Anime Destiny units with rarity, tier, roles, and synergy info. Find the best units for your squad composition.",
    alternates: { canonical: "https://nteguide.com/en/anime-destiny/units" },
    openGraph: {
      title: "Anime Destiny Units - All Characters & Stats",
      description: "Browse all Anime Destiny units with rarity, tier, roles, and synergy info.",
      type: "website",
      url: "https://nteguide.com/en/anime-destiny/units",
    },
  };
}

const rarityBorder: Record<string, string> = {
  Secret: "border-amber-700/50",
  Mythic: "border-purple-700/50",
  "Mythic BattlePass": "border-purple-700/50",
  Legendary: "border-yellow-700/50",
  Rare: "border-blue-700/50",
};
const rarityText: Record<string, string> = {
  Secret: "text-amber-400",
  Mythic: "text-purple-400",
  "Mythic BattlePass": "text-purple-400",
  Legendary: "text-yellow-400",
  Rare: "text-blue-400",
};

export default function ADUnitsPage() {
  const units = getAllADUnits();

  // Group by rarity
  const rarityOrder = ["Secret", "Mythic", "Mythic BattlePass", "Legendary", "Rare"];
  const byRarity = rarityOrder
    .map((rarity) => ({ rarity, units: units.filter((u) => u.rarity === rarity) }))
    .filter((g) => g.units.length > 0);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Anime Destiny Units",
    numberOfItems: units.length,
    itemListElement: units.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: u.variant ? `${u.name} (${u.variant})` : u.name,
      url: `https://nteguide.com/en/anime-destiny/units/${u.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: "Units" },
      ]} />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Anime Destiny Units</h1>
        <p className="mb-8 text-gray-400">
          All {units.length} units with rarity, tier ranking, roles, and synergy information.
        </p>

        {byRarity.map(({ rarity, units: rarityUnits }) => (
          <div key={rarity} className="mb-8">
            <h2 className={`mb-4 text-lg font-semibold ${rarityText[rarity] || "text-gray-400"}`}>
              {rarity} <span className="text-sm text-gray-500">({rarityUnits.length})</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rarityUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function UnitCard({ unit }: { unit: ADUnit }) {
  return (
    <Link
      href={`/en/anime-destiny/units/${unit.id}`}
      className={`block rounded-xl border ${rarityBorder[unit.rarity] || "border-gray-800"} bg-gray-900/50 p-4 transition-colors hover:border-purple-600/50 hover:bg-gray-900`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">
            {unit.name}
            {unit.variant && <span className="text-gray-500"> ({unit.variant})</span>}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className={`text-xs ${rarityText[unit.rarity] || "text-gray-400"}`}>{unit.rarity}</span>
            <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">Tier {unit.tier}</span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 line-clamp-2">{unit.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {unit.roles.map((role) => (
          <span key={role} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">{role}</span>
        ))}
      </div>
    </Link>
  );
}
