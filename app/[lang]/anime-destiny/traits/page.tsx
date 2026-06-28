import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { getADTraits } from "../../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Anime Destiny Traits & Reroll Guide | nteguide.com",
    description: "Complete guide to Anime Destiny traits including RR, Divine, Stellar, Sniper, Ninja, Starlight, Elemental, Godspeed, and more. Learn which traits to keep and when to reroll.",
    alternates: { canonical: "https://nteguide.com/en/anime-destiny/traits" },
    openGraph: {
      title: "Anime Destiny Traits & Reroll Guide",
      description: "Complete guide to Anime Destiny traits and reroll priority.",
      type: "website",
      url: "https://nteguide.com/en/anime-destiny/traits",
    },
  };
}

export default function ADTraitsPage() {
  const traits = getADTraits();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best trait in Anime Destiny?",
        acceptedAnswer: { "@type": "Answer", text: "Divine is the best trait for high-end DPS units and top Secret or Mythic carries. Stellar is excellent for DoT and shield-breaking units." },
      },
      {
        "@type": "Question",
        name: "Should I reroll traits early in Anime Destiny?",
        acceptedAnswer: { "@type": "Answer", text: "Use only light rerolling early. Save the bulk of your RR for Mythic and Secret units that stay useful in late-game content." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: "Traits" },
      ]} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Anime Destiny Traits &amp; Reroll Guide</h1>
        <p className="mb-8 text-gray-400">
          Traits improve unit performance and RR is the key reroll resource. The best early rule: use small reroll
          amounts on temporary units, save serious RR spending for Mythic and Secret units, and match traits to the
          unit role instead of blindly chasing one label.
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Trait / Resource</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Best For</th>
                <th className="px-4 py-3 font-medium">Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {traits.map((trait) => (
                <tr key={trait.id} className="hover:bg-gray-900/50">
                  <td className="px-4 py-3 font-medium text-purple-400">{trait.name}</td>
                  <td className="px-4 py-3 text-gray-400">{trait.type}</td>
                  <td className="px-4 py-3 text-gray-300">{trait.bestFor}</td>
                  <td className="px-4 py-3 text-gray-500">{trait.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h2 className="mb-2 font-semibold text-white">Reroll Priority</h2>
          <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-400">
            <li><strong className="text-gray-300">Secret units:</strong> Aim for Divine, Ninja (attack speed builds), or Sniper (crit builds).</li>
            <li><strong className="text-gray-300">Mythic units:</strong> Stellar, Sniper, or Ninja depending on role. Starlight for AOE-focused units.</li>
            <li><strong className="text-gray-300">Mythic support/utility:</strong> Elemental for effect-based units, Godspeed for endless mode.</li>
            <li><strong className="text-gray-300">Legendary units:</strong> Jack of All is acceptable early. Don&apos;t overspend.</li>
            <li><strong className="text-gray-300">Rare/Epic:</strong> Don&apos;t reroll. Replace these units instead.</li>
          </ol>
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/en/anime-destiny/units" className="text-sm text-purple-400 hover:underline">Browse Units →</Link>
          <Link href="/en/anime-destiny/tier-list" className="text-sm text-purple-400 hover:underline">View Tier List →</Link>
        </div>
      </div>
    </>
  );
}
