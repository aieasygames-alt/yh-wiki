import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { getADCodes } from "../../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Anime Destiny Codes - Active & Expired (2026) | nteguide.com",
    description: "All active Anime Destiny codes for free Gems, RR, Cubes, and Malice. Updated regularly with expired codes list and redeem guide.",
    alternates: { canonical: "https://nteguide.com/en/anime-destiny/codes" },
    openGraph: {
      title: "Anime Destiny Codes - Active & Expired (2026)",
      description: "All active Anime Destiny codes for free Gems, RR, Cubes, and Malice.",
      type: "website",
      url: "https://nteguide.com/en/anime-destiny/codes",
    },
  };
}

export default function ADCodesPage() {
  const data = getADCodes();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I redeem codes in Anime Destiny?",
        acceptedAnswer: { "@type": "Answer", text: "Open the game, click the Codes button on the right side, paste the code, and press Redeem." },
      },
      {
        "@type": "Question",
        name: "What do Anime Destiny codes give?",
        acceptedAnswer: { "@type": "Answer", text: "Active codes give Gems for summoning, RR for trait rerolls, Cubes for upgrades, and Malice." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: "Codes" },
      ]} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Anime Destiny Codes</h1>
        <p className="mb-8 text-gray-400">
          Redeem these codes before summoning so your free Gems and reroll resources go into stronger early progress.
        </p>

        {/* Active Codes */}
        <h2 className="mb-4 text-xl font-semibold text-white">Active Codes</h2>
        <div className="space-y-3">
          {data.active.map((code) => (
            <div key={code.code} className="rounded-lg border border-green-800/50 bg-green-900/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <code className="rounded bg-gray-800 px-2 py-1 font-mono text-sm text-green-400">{code.code}</code>
                  <span className="ml-3 rounded-full bg-green-600/20 px-2 py-0.5 text-xs text-green-400">Active</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-400"><strong className="text-gray-300">Rewards:</strong> {code.rewards}</p>
              <p className="mt-1 text-sm text-gray-500">{code.description}</p>
            </div>
          ))}
        </div>

        {/* Reward Types */}
        <h2 className="mb-4 mt-10 text-xl font-semibold text-white">Reward Types</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.rewardTypes.map((reward) => (
            <div key={reward.name} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
              <h3 className="font-semibold text-purple-400">{reward.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{reward.description}</p>
            </div>
          ))}
        </div>

        {/* How to Redeem */}
        <h2 className="mb-4 mt-10 text-xl font-semibold text-white">How to Redeem</h2>
        <ol className="space-y-3">
          {data.howToRedeem.map((step, i) => (
            <li key={i} className="flex gap-3 text-gray-400">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* Expired Codes */}
        <h2 className="mb-4 mt-10 text-xl font-semibold text-white">Expired Codes</h2>
        <div className="flex flex-wrap gap-2">
          {data.expired.map((code) => (
            <span key={code.code} className="rounded bg-gray-800 px-2 py-1 font-mono text-xs text-gray-500 line-through" title={code.note}>
              {code.code}
            </span>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-sm text-gray-400">
            Looking for more guides? Check out the{" "}
            <Link href="/en/anime-destiny/guides/beginner-guide" className="text-purple-400 hover:underline">Beginner Guide</Link>
            {" "}or{" "}
            <Link href="/en/anime-destiny/tier-list" className="text-purple-400 hover:underline">Tier List</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
