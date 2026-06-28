import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { getAllADUnits, type ADUnit } from "../../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Anime Destiny Tier List - Best Units Ranked (2026) | nteguide.com",
    description: "Complete Anime Destiny unit tier list ranking all units from S to D. Find the best DPS, shield breakers, and boss killers for story, bosses, and endless trials.",
    alternates: { canonical: "https://nteguide.com/en/anime-destiny/tier-list" },
    openGraph: {
      title: "Anime Destiny Tier List - Best Units Ranked (2026)",
      description: "Complete tier list for all Anime Destiny units. Find the best units for your squad.",
      type: "website",
      url: "https://nteguide.com/en/anime-destiny/tier-list",
    },
  };
}

const tierOrder = ["S", "A", "B", "C", "D"];
const tierLabels: Record<string, string> = {
  S: "Meta DPS and Utility",
  A: "Strong Alternatives",
  B: "Usable Mid-High Investment",
  C: "Beginner and Early-Mid Game",
  D: "Temporary Units",
};
const tierColors: Record<string, string> = {
  S: "border-red-600/50 bg-red-900/10",
  A: "border-orange-600/50 bg-orange-900/10",
  B: "border-yellow-600/50 bg-yellow-900/10",
  C: "border-green-600/50 bg-green-900/10",
  D: "border-gray-600/50 bg-gray-800/30",
};
const tierBadgeColors: Record<string, string> = {
  S: "bg-red-600",
  A: "bg-orange-600",
  B: "bg-yellow-600",
  C: "bg-green-600",
  D: "bg-gray-600",
};

export default function ADTierListPage() {
  const units = getAllADUnits();
  const byTier = tierOrder.map((tier) => ({
    tier,
    label: tierLabels[tier],
    units: units.filter((u) => u.tier === tier),
  }));

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Anime Destiny Unit Tier List",
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
        { label: "Tier List" },
      ]} />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Anime Destiny Unit Tier List</h1>
        <p className="mb-8 text-gray-400">
          This tier list focuses on evolved units at high investment, with extra weight given to DPS, shield breaking,
          boss damage, summon value, and utility. Early units help during story, but Mythic and Secret units are the
          main long-term investment targets.
        </p>

        <div className="space-y-6">
          {byTier.map(({ tier, label, units: tierUnits }) => (
            <div key={tier} className={`rounded-xl border ${tierColors[tier]} p-4`}>
              <div className="mb-3 flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tierBadgeColors[tier]} text-lg font-bold text-white`}>
                  {tier}
                </span>
                <h2 className="text-lg font-semibold text-white">{label}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {tierUnits.map((unit) => (
                  <UnitTierCard key={unit.id} unit={unit} />
                ))}
                {tierUnits.length === 0 && (
                  <p className="text-sm text-gray-500">No units in this tier.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-sm text-gray-400">
            Want unit details? Browse the{" "}
            <Link href="/en/anime-destiny/units" className="text-purple-400 hover:underline">full unit list</Link>
            {" "}or learn about{" "}
            <Link href="/en/anime-destiny/traits" className="text-purple-400 hover:underline">traits and rerolls</Link>.
          </p>
        </div>
      </div>
    </>
  );
}

function UnitTierCard({ unit }: { unit: ADUnit }) {
  const rarityColor: Record<string, string> = {
    Secret: "text-amber-400",
    Mythic: "text-purple-400",
    Legendary: "text-yellow-400",
    Rare: "text-blue-400",
  };
  return (
    <Link
      href={`/en/anime-destiny/units/${unit.id}`}
      className="block rounded-lg border border-gray-800 bg-gray-900/50 p-3 transition-colors hover:border-purple-600/50"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-white">
          {unit.name}
          {unit.variant && <span className="text-gray-500"> ({unit.variant})</span>}
        </span>
        <span className={`text-xs ${rarityColor[unit.rarity] || "text-gray-400"}`}>{unit.rarity}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{unit.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {unit.roles.map((role) => (
          <span key={role} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">{role}</span>
        ))}
      </div>
    </Link>
  );
}
