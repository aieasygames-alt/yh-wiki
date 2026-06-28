import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "../../../../../components/Breadcrumb";
import { getAllADGuides, getADGuide, type ADGuide } from "../../../../../lib/ad-queries";

export function generateStaticParams() {
  return getAllADGuides().map((g) => ({ lang: "en", slug: g.id }));
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getADGuide(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | Anime Destiny Wiki`,
    description: guide.description,
    alternates: { canonical: `https://nteguide.com/en/anime-destiny/guides/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `https://nteguide.com/en/anime-destiny/guides/${slug}`,
    },
  };
}

export default async function ADGuidePage({ params }: { params: { lang: string; slug: string } }) {
  const { slug } = await params;
  const guide = getADGuide(slug);
  if (!guide) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    articleSection: guide.category,
    isPartOf: { "@type": "WebSite", name: "Anime Destiny Wiki", url: "https://nteguide.com/en/anime-destiny" },
  };

  const allGuides = getAllADGuides().filter((g) => g.id !== guide.id);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <Breadcrumb items={[
        { label: "Anime Destiny", href: "/en/anime-destiny" },
        { label: guide.title },
      ]} />

      <div className="mx-auto max-w-3xl px-4 py-12">

        <span className="mb-2 inline-block rounded-full bg-purple-600/20 px-2 py-0.5 text-xs text-purple-400">{guide.category}</span>
        <h1 className="mb-2 text-3xl font-bold text-white">{guide.title}</h1>
        <p className="mb-8 text-gray-400">{guide.description}</p>

        {/* Steps */}
        {guide.steps && (
          <div className="space-y-6">
            {guide.steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{step.title}</h2>
                    <p className="mt-1 text-gray-400">{step.content}</p>
                    {step.tip && (
                      <div className="mt-3 rounded-lg border-l-2 border-purple-600 bg-purple-900/10 px-4 py-2">
                        <p className="text-sm text-purple-300">
                          <strong>Tip:</strong> {step.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Materials Table */}
        {guide.materials && (
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Resource</th>
                  <th className="px-4 py-3 font-medium">Used For</th>
                  <th className="px-4 py-3 font-medium">Where to Check</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Best Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {guide.materials.map((mat) => (
                  <tr key={mat.name} className="hover:bg-gray-900/50">
                    <td className="px-4 py-3 font-medium text-purple-400">{mat.name}</td>
                    <td className="px-4 py-3 text-gray-300">{mat.usedFor}</td>
                    <td className="px-4 py-3 text-gray-500">{mat.whereToCheck}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-xs ${
                        mat.priority === "High" ? "bg-red-600/20 text-red-400" : "bg-yellow-600/20 text-yellow-400"
                      }`}>{mat.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{mat.bestUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tips */}
        {guide.tips && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Smart Spending Tips</h2>
            <ul className="space-y-2">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-gray-400">
                  <span className="text-purple-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Other Guides */}
        {allGuides.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-white">More Guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {allGuides.map((g) => (
                <GuideLink key={g.id} guide={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function GuideLink({ guide }: { guide: ADGuide }) {
  return (
    <Link
      href={`/en/anime-destiny/guides/${guide.id}`}
      className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-purple-600/50"
    >
      <span className="text-sm font-medium text-white">{guide.title}</span>
      <p className="mt-1 text-xs text-gray-500">{guide.description}</p>
    </Link>
  );
}
