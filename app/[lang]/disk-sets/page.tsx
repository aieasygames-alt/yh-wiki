import Link from "next/link";
import { isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllDiskSets, getAllCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../components/DataStatusBanner";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  return {
    title: isZhLocale(lang) ? "磁盘套装图鉴 | 异环游戏 Wiki" : "Disk Sets Guide | Neverness to Everness Wiki",
    description: isZhLocale(lang)
      ? "异环全磁盘套装图鉴，包含2件套和4件套效果、适用角色推荐及获取方式。"
      : "Complete disk set guide for Neverness to Everness. All 2-piece and 4-piece set bonuses, recommended characters, and how to get them.",
    alternates: hreflangAlternates("disk-sets", lang),
  };
}

export default async function DiskSetsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const diskSets = getAllDiskSets();
  const characters = getAllCharacters();

  function getCharName(id: string) {
    const c = characters.find(ch => ch.id === id);
    return c ? (isZhLocale(locale) ? c.name : c.nameEn) : id;
  }

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? "首页" : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? "磁盘套装" : "Disk Sets" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {isZhLocale(locale) ? "磁盘套装图鉴" : "Disk Sets Guide"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZhLocale(locale)
              ? "异环全磁盘套装效果一览，包含2件套和4件套加成、适用角色推荐。"
              : "All disk set bonuses in Neverness to Everness, including 2-piece and 4-piece effects and recommended characters."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diskSets.map((set) => (
            <Link
              key={set.id}
              href={`/${lang}/disk-sets/${set.id}`}
              className="block rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/50 transition-colors"
            >
              <h2 className="text-lg font-bold mb-1">
                {isZhLocale(locale) ? set.name : set.nameEn}
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                {isZhLocale(locale) ? set.nameEn : set.name} · {set.characters.length} {isZhLocale(locale) ? "角色" : "characters"}
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-primary-400 font-medium">2{isZhLocale(locale) ? "件套" : "-pc"}: </span>
                  <span className="text-gray-300">{isZhLocale(locale) ? set.setDescription2pc : set.setDescription2pcEn}</span>
                </div>
                <div>
                  <span className="text-primary-400 font-medium">4{isZhLocale(locale) ? "件套" : "-pc"}: </span>
                  <span className="text-gray-300 line-clamp-2">{isZhLocale(locale) ? set.setDescription4pc : set.setDescription4pcEn}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {set.characters.slice(0, 4).map((cid) => (
                  <span key={cid} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                    {getCharName(cid)}
                  </span>
                ))}
                {set.characters.length > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                    +{set.characters.length - 4}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
