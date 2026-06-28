import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { getAllADGuides } from "../../../../lib/ad-queries";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Anime Destiny Guides — All Walkthroughs & Strategy | nteguide.com",
    description: "Browse all Anime Destiny guides: beginner, story mode, boss strategies, endless mode, raid mode, team compositions, summon rates, and evolution materials.",
    alternates: { canonical: "https://nteguide.com/en/anime-destiny/guides" },
    openGraph: {
      title: "Anime Destiny Guides — All Walkthroughs & Strategy",
      description: "Browse all Anime Destiny guides: beginner, story, bosses, endless, raids, team comps, summon rates, and more.",
      type: "website",
      url: "https://nteguide.com/en/anime-destiny/guides",
    },
  };
}

const categoryColor: Record<string, string> = {
  Beginner: "bg-green-600/20 text-green-400",
  Intermediate: "bg-blue-600/20 text-blue-400",
  Advanced: "bg-purple-600/20 text-purple-400",
};

export default function ADGuidesIndexPage() {
  const guides = getAllADGuides();
  const grouped: Record<string, typeof guides> = {};
  for (const g of guides) {
    if (!grouped[g.category]) grouped[g.category] = [];
    grouped[g.category].push(g);
  }
  const categoryOrder = ["Beginner", "Intermediate", "Advanced"];

  return (
    <>
      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: "Guides" },
      ]} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Anime Destiny Guides</h1>
        <p className="mb-8 text-gray-400">
          Complete strategy guides for every game mode. Start with the Beginner Guide if you&apos;re new,
          then work through Story, Boss, and Raid guides as you progress.
        </p>

        {categoryOrder.map((cat) => (
          grouped[cat]?.length > 0 && (
            <div key={cat} className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor[cat] || "bg-gray-800 text-gray-400"}`}>
                  {cat}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {grouped[cat].map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/en/anime-destiny/guides/${guide.id}`}
                    className="group rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-purple-600/50 hover:bg-gray-900"
                  >
                    <h3 className="mb-1 font-semibold text-white group-hover:text-purple-400">{guide.title.replace("Anime Destiny ", "")}</h3>
                    <p className="text-sm text-gray-500">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}

        <div className="mt-6 flex gap-4">
          <Link href="/en/anime-destiny/units" className="text-sm text-purple-400 hover:underline">Browse Units →</Link>
          <Link href="/en/anime-destiny/tier-list" className="text-sm text-purple-400 hover:underline">View Tier List →</Link>
          <Link href="/en/anime-destiny/artifacts" className="text-sm text-purple-400 hover:underline">Artifacts →</Link>
        </div>
      </div>
    </>
  );
}
