import type { Metadata } from "next";
import Link from "next/link";
import { getADGameInfo, getADCodes, getAllADUnits, getAllADArtifacts } from "../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  const info = getADGameInfo();
  return {
    title: "Anime Destiny Wiki - Codes, Tier List & Units | nteguide.com",
    description: info.description,
    alternates: {
      canonical: "https://nteguide.com/en/anime-destiny",
    },
    openGraph: {
      title: "Anime Destiny Wiki - Codes, Tier List & Units",
      description: info.description,
      type: "website",
      url: "https://nteguide.com/en/anime-destiny",
    },
  };
}

export default function AnimeDestinyHome() {
  const info = getADGameInfo();
  const codes = getADCodes();
  const units = getAllADUnits();
  const artifacts = getAllADArtifacts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Anime Destiny Wiki",
    description: info.description,
    url: "https://nteguide.com/en/anime-destiny",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-950 to-pink-900/20" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Anime Destiny
            </span>{" "}
            Wiki
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            {info.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/en/anime-destiny/codes" className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700">
              Get Free Codes
            </Link>
            <Link href="/en/anime-destiny/tier-list" className="rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700">
              View Tier List
            </Link>
            <Link href="/en/anime-destiny/guides/beginner-guide" className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white">
              Beginner Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Game Stats */}
      <section className="border-b border-gray-800">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{info.stats.totalVisits}</div>
            <div className="text-sm text-gray-500">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{info.stats.playersOnline}</div>
            <div className="text-sm text-gray-500">Players Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{info.stats.userRating}</div>
            <div className="text-sm text-gray-500">User Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{info.stats.discordMembers}</div>
            <div className="text-sm text-gray-500">Discord Members</div>
          </div>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-white">Resources</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ResourceCard
            href="/en/anime-destiny/codes"
            title="Codes"
            description={`${codes.active.length} active codes for free Gems, RR, and more`}
            icon="gift"
          />
          <ResourceCard
            href="/en/anime-destiny/tier-list"
            title="Tier List"
            description="Best units ranked for story, bosses, and late game"
            icon="trophy"
          />
          <ResourceCard
            href="/en/anime-destiny/units"
            title="Units"
            description={`${units.length} units with roles, rarity, and synergy info`}
            icon="users"
          />
          <ResourceCard
            href="/en/anime-destiny/traits"
            title="Traits & Reroll"
            description="Trait effects, reroll priority, and save advice"
            icon="star"
          />
          <ResourceCard
            href="/en/anime-destiny/artifacts"
            title="Artifacts"
            description={`${artifacts.length} artifacts ranked by tier with effects and sources`}
            icon="shield"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/summon-gems-guide"
            title="Summon & Gems"
            description="Summon system, gem budgeting, and Auto Roll tips"
            icon="gem"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/evolution-materials-guide"
            title="Evolution Materials"
            description="Upgrade paths, evolution recipes, and farm priority"
            icon="arrow-up"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/story-mode-guide"
            title="Story Mode Guide"
            description="Act-by-act walkthrough with progression tips for all difficulty levels"
            icon="book"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/boss-guide"
            title="Boss Guide"
            description="Boss mechanics, shield breaking, and counter strategies"
            icon="sword"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/endless-mode-guide"
            title="Endless Mode"
            description="Wave strategy, survival builds, and leaderboard tips"
            icon="infinity"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/raid-mode-guide"
            title="Raid Mode"
            description="Raid bosses, team setup, artifact farming routes"
            icon="shield"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/team-composition-guide"
            title="Team Compositions"
            description="Optimal builds for story, bosses, endless, and raids"
            icon="users"
          />
          <ResourceCard
            href="/en/anime-destiny/guides/summon-rates-guide"
            title="Summon Rates"
            description="Pull probabilities, pity system, and banner strategy"
            icon="gem"
          />
          <ResourceCard
            href="/en/anime-destiny/guides"
            title="All Guides"
            description="Browse all 9 strategy guides in one place"
            icon="book"
          />
        </div>
      </section>

      {/* Quick Start */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Quick Start</h2>
          <ol className="space-y-3 text-gray-400">
            <li className="flex gap-3"><span className="font-bold text-purple-400">1</span> Redeem active codes for free Gems before summoning</li>
            <li className="flex gap-3"><span className="font-bold text-purple-400">2</span> Summon a starter squad and equip your best units</li>
            <li className="flex gap-3"><span className="font-bold text-purple-400">3</span> Clear Story stages to unlock progression</li>
            <li className="flex gap-3"><span className="font-bold text-purple-400">4</span> Save RR for Mythic and Secret units</li>
          </ol>
        </div>
      </section>

      {/* Community */}
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h2 className="mb-4 text-xl font-bold text-white">Join the Community</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://discord.gg/animedestiny" target="_blank" rel="noopener" className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700">
              Discord
            </a>
            <a href="https://www.roblox.com/games/" target="_blank" rel="noopener" className="rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700">
              Play on Roblox
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const icons: Record<string, string> = {
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z",
  users: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H5v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  star: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  gem: "M6 3h12l4 6-10 13L2 9l4-6Z M11 3 8 9l4 13 4-13-3-6 M2 9h20",
  "arrow-up": "M12 19V5M5 12l7-7 7 7",
  shield: "M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z",
  book: "M3 5a2 2 0 0 1 2-2h6v18H5a2 2 0 0 1-2-2V5Z M21 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2V5Z",
  sword: "M14.5 4l5.5 5.5L9 20.5 3.5 15 14.5 4Z M3 21l3-3 M18 3l3 3-2 2-3-3 2-2Z",
  infinity: "M6 12a4 4 0 1 1 4 4 4 4 0 0 1-4-4Z M14 12a4 4 0 1 1 4 4 4 4 0 0 1-4-4Z M10 12c0-2 2-2 2 0s-2 2-2 0Z",
};

function ResourceCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-purple-600/50 hover:bg-gray-900"
    >
      <div className="mb-3 inline-flex rounded-lg bg-purple-600/10 p-2 text-purple-400 group-hover:bg-purple-600/20">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} />
        </svg>
      </div>
      <h3 className="mb-1 font-semibold text-white group-hover:text-purple-400">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
