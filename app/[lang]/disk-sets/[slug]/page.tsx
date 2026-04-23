import Link from "next/link";
import { notFound } from "next/navigation";
import { isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getDiskSet, getAllDiskSets, getAllCharacters } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const sets = getAllDiskSets();
  return sets.flatMap((s) => [
    { lang: "zh", slug: s.id },
    { lang: "tw", slug: s.id },
    { lang: "en", slug: s.id },
  ]);
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const set = getDiskSet(slug);
  if (!set) return {};

  return {
    title: isZhLocale(lang)
      ? `${set.name}套装效果 & 适用角色 | 异环游戏 Wiki`
      : `${set.nameEn} Set Bonus & Best Characters - NTE Guide`,
    description: isZhLocale(lang)
      ? `异环磁盘套装「${set.name}」2件套和4件套效果详解，适用角色推荐。`
      : `${set.nameEn} disk set guide: 2-piece and 4-piece bonuses, best characters, and how to use it in Neverness to Everness.`,
    alternates: hreflangAlternates(`disk-sets/${slug}`, lang),
  };
}

export default async function DiskSetDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const set = getDiskSet(slug);
  if (!set) notFound();

  const characters = getAllCharacters();

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? "首页" : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? "磁盘套装" : "Disk Sets", href: `/${lang}/disk-sets` },
          { label: isZhLocale(locale) ? set.name : set.nameEn },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <h1 className="text-2xl font-bold">
            {isZhLocale(locale) ? set.name : set.nameEn}
          </h1>
          <p className="text-gray-500">{isZhLocale(locale) ? set.nameEn : set.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-3 py-1 rounded-full border bg-gray-800 text-gray-300">
              {set.pieces}{isZhLocale(locale) ? "件套" : "-piece set"}
            </span>
            {set.bestFor.filter(b => isZhLocale(locale) ? !/^[A-Z]/.test(b) : /^[A-Z]/.test(b)).map((b, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full border border-primary-500/30 text-primary-400">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Set Bonuses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "套装效果" : "Set Bonuses"}
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="text-primary-400 font-semibold mb-2">2{isZhLocale(locale) ? "件套效果" : "-Piece Bonus"}</h3>
              <p className="text-gray-300">{isZhLocale(locale) ? set.setDescription2pc : set.setDescription2pcEn}</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="text-primary-400 font-semibold mb-2">4{isZhLocale(locale) ? "件套效果" : "-Piece Bonus"}</h3>
              <p className="text-gray-300">{isZhLocale(locale) ? set.setDescription4pc : set.setDescription4pcEn}</p>
            </div>
          </div>
        </section>

        {/* Recommended Characters */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "推荐角色" : "Recommended Characters"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {set.characters.map((cid) => {
              const char = characters.find(c => c.id === cid);
              if (!char) return null;
              return (
                <Link
                  key={cid}
                  href={`/${lang}/characters/${cid}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-primary-400">
                    {char.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{isZhLocale(locale) ? char.name : char.nameEn}</div>
                    <div className="text-xs text-gray-500">{char.role} · {char.rank}-Rank</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
