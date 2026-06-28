import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { getAllADArtifacts } from "../../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Anime Destiny Artifacts Tier List & Guide | nteguide.com",
    description: "Complete guide to Anime Destiny artifacts. Find the best artifacts for your units, including drop rates, effects, and tier rankings.",
    alternates: { canonical: "https://nteguide.com/en/anime-destiny/artifacts" },
    openGraph: {
      title: "Anime Destiny Artifacts Tier List & Guide",
      description: "Complete guide to Anime Destiny artifacts — effects, drop rates, and tier rankings.",
      type: "website",
      url: "https://nteguide.com/en/anime-destiny/artifacts",
    },
  };
}

const tierColor: Record<string, string> = {
  S: "text-amber-400",
  A: "text-purple-400",
  B: "text-blue-400",
  C: "text-gray-400",
  D: "text-gray-500",
};

export default function ADArtifactsPage() {
  const artifacts = getAllADArtifacts();
  const grouped: Record<string, typeof artifacts> = { S: [], A: [], B: [] };
  for (const a of artifacts) {
    if (!grouped[a.tier]) grouped[a.tier] = [];
    grouped[a.tier].push(a);
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best artifact in Anime Destiny?",
        acceptedAnswer: { "@type": "Answer", text: "Demon Shard is the best artifact overall, providing +40% Damage and +15% Crit Damage. It drops from the Demon Raid at a very low rate." },
      },
      {
        "@type": "Question",
        name: "How many artifact slots does each unit have?",
        acceptedAnswer: { "@type": "Answer", text: "Each unit has 1 artifact slot. Choose the artifact that best matches the unit's role and damage type." },
      },
      {
        "@type": "Question",
        name: "Where do I get artifacts in Anime Destiny?",
        acceptedAnswer: { "@type": "Answer", text: "Artifacts are obtained from Raids, Boss Events, Dungeons, the Guild Shop, and Daily Login rewards. Higher rarity artifacts have lower drop rates." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: "Artifacts" },
      ]} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Anime Destiny Artifacts</h1>
        <p className="mb-8 text-gray-400">
          Artifacts are equippable items that boost unit performance. Each unit has one artifact slot —
          match the artifact to the unit&apos;s role for maximum effectiveness. Higher-tier artifacts are
          rarer but provide significantly stronger bonuses.
        </p>

        {/* Tier sections */}
        {["S", "A", "B"].map((tier) => (
          grouped[tier]?.length > 0 && (
            <div key={tier} className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className={`text-2xl font-bold ${tierColor[tier]}`}>Tier {tier}</span>
                <span className="text-sm text-gray-500">{grouped[tier].length} artifacts</span>
              </div>
              <div className="space-y-3">
                {grouped[tier].map((artifact) => (
                  <div key={artifact.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{artifact.name}</h3>
                          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">{artifact.rarity}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-purple-400">{artifact.effect}</p>
                        <p className="mt-1 text-sm text-gray-500">{artifact.description}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span><span className="text-gray-600">Best for:</span> {artifact.bestFor}</span>
                          <span><span className="text-gray-600">Source:</span> {artifact.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Tips */}
        <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h2 className="mb-2 font-semibold text-white">Artifact Tips</h2>
          <ul className="ml-4 list-disc space-y-2 text-sm text-gray-400">
            <li><strong className="text-gray-300">Match role:</strong> DoT artifacts for DoT units, crit artifacts for crit-scaling units, etc.</li>
            <li><strong className="text-gray-300">Farm priority:</strong> Focus on Demon Raid and Shadow Dungeon for S-tier artifacts.</li>
            <li><strong className="text-gray-300">Don&apos;t over-invest:</strong> B-tier artifacts are fine for Legendary and Rare units — save S-tier for Mythic and Secret.</li>
            <li><strong className="text-gray-300">Guild Shop:</strong> Warrior Banner is a reliable mid-tier pick if RNG isn&apos;t favoring you.</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/en/anime-destiny/units" className="text-sm text-purple-400 hover:underline">Browse Units →</Link>
          <Link href="/en/anime-destiny/tier-list" className="text-sm text-purple-400 hover:underline">View Tier List →</Link>
          <Link href="/en/anime-destiny/traits" className="text-sm text-purple-400 hover:underline">Traits Guide →</Link>
        </div>
      </div>
    </>
  );
}
