import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllDiskSets, getAllCharacters } from "../../../lib/queries";
import { getAttributeLabel, getAttributeColor } from "../../../lib/attributes";
import { GameImage } from "../../../components/GameImage";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../components/DataStatusBanner";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  return {
    title: isZhLocale(lang) ? "卡带图鉴 & 套装效果 | 异环游戏 Wiki" : "Cartridge Sets & Bonuses | Neverness to Everness Wiki",
    description: isZhLocale(lang)
      ? "异环全卡带套装图鉴，包含6种元素专属和6种通用卡带的2件套和4件套效果、适用角色推荐。"
      : "Complete cartridge set guide for Neverness to Everness. All 6 elemental and 6 general cartridge sets with 2-piece and 4-piece bonuses and recommended characters.",
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

  const elementalSets = diskSets.filter(s => s.category === "elemental");
  const generalSets = diskSets.filter(s => s.category === "general");

  const sections = [
    { title: t(locale, "diskSets.elemental"), sets: elementalSets },
    { title: t(locale, "diskSets.general"), sets: generalSets },
  ];

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.cassettes") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {t(locale, "diskSets.title")}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZhLocale(locale)
              ? "异环全卡带套装效果一览，包含6种元素专属和6种通用卡带的2件套和4件套加成、适用角色推荐。"
              : "All 12 cartridge sets in Neverness to Everness, including 2-piece and 4-piece set bonuses and recommended characters."}
          </p>
        </div>

        {sections.map((section) => (
          <section key={section.title} className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded"></span>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.sets.map((set) => (
                <Link
                  key={set.id}
                  href={`/${lang}/disk-sets/${set.id}`}
                  className="block rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <GameImage
                      type="cassette"
                      id={set.id}
                      name={isZhLocale(locale) ? set.name : set.nameEn}
                      className="w-14 h-14 rounded-lg shrink-0"
                      contain
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate">
                        {isZhLocale(locale) ? set.name : set.nameEn}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {isZhLocale(locale) ? set.nameEn : set.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded border bg-gray-800 text-gray-300">
                          {set.pieces}{t(locale, "diskSets.pcSet")}
                        </span>
                        {set.element && (
                          <span className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(set.element)}`}>
                            {getAttributeLabel(set.element, locale)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-primary-400 font-medium">2{t(locale, "diskSets.pcSet")}: </span>
                      <span className="text-gray-300">{isZhLocale(locale) ? set.setDescription2pc : set.setDescription2pcEn}</span>
                    </div>
                    <div>
                      <span className="text-primary-400 font-medium">4{t(locale, "diskSets.pcSet")}: </span>
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
          </section>
        ))}
      </div>
    </>
  );
}
