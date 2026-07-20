import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllDiskSets, getAvailableCharacters } from "../../../lib/queries";
import { getAttributeLabel, getAttributeColor } from "../../../lib/attributes";
import { GameImage } from "../../../components/GameImage";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../components/DataStatusBanner";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const diskSets = getAllDiskSets();
  const elementalCount = diskSets.filter((set) => set.category === "elemental").length;
  const generalCount = diskSets.filter((set) => set.category === "general").length;
  const description = locale === "tw"
    ? `異環卡帶套裝資料庫整理 ${diskSets.length} 套效果，包含 ${elementalCount} 套元素專屬與 ${generalCount} 套通用套裝，彙整 2 件套、4 件套、適用角色與配裝方向。`
    : locale === "zh"
    ? `异环卡带套装大全，整理 ${diskSets.length} 套卡带效果，包含 ${elementalCount} 套元素专属与 ${generalCount} 套通用套装，汇总 2 件套、4 件套与推荐角色。`
    : `Complete Neverness to Everness disk set database with ${diskSets.length} sets, including ${elementalCount} elemental sets and ${generalCount} general sets with 2-piece, 4-piece, and recommended character references.`;

  return {
    title: t(locale, "diskSets.seoTitle"),
    description,
    alternates: hreflangAlternates("disk-sets", lang),
    openGraph: {
      title: t(locale, "diskSets.seoTitle"),
      description,
      type: "website",
    },
  };
}

export default async function DiskSetsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const diskSets = getAllDiskSets();
  const characters = getAvailableCharacters();

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

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "这页卡带总表最适合怎么用？" : "How should you use this disk-set hub?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "先按元素专属或通用套装判断方向，再看 2 件套和 4 件套究竟是补面板、补循环，还是只适合特定角色。总表适合横向比较，不建议只看推荐角色标签就直接开刷。"
              : "Start by separating elemental sets from general-purpose sets, then check whether the 2-piece and 4-piece effects improve stats, rotation uptime, or only a narrow character archetype. This hub is best for comparison, not blind farming based only on recommended tags."}
          </p>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "刷卡带前先判断什么" : "What should you check before farming sets?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "先确认角色更需要 2+2 过渡，还是必须凑齐 4 件套核心效果。" : "Decide whether your unit only needs a 2+2 transition setup or truly depends on a full 4-piece effect."}</li>
              <li>{isZhLocale(locale) ? "别只看属性名字，要看触发条件和覆盖率能不能在实战里稳定吃满。" : "Do not stop at the element label; check whether the trigger condition and uptime are realistic in combat."}</li>
              <li>{isZhLocale(locale) ? "优先刷能被多个主力共享的副本，通常比为单角色单套件硬冲更划算。" : "Prioritize dungeons whose drops can be shared across several core units before hard-targeting one niche set."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "看到推荐角色就默认毕业，不核对自己当前队伍和词条需求。" : "Assuming a recommended set is automatically best-in-slot without checking your own team and stat needs."}</li>
              <li>{isZhLocale(locale) ? "为了 4 件套效果放弃更好的主词条和副词条，导致整体输出反而变差。" : "Forcing a 4-piece bonus while sacrificing much stronger main stats or substats."}</li>
              <li>{isZhLocale(locale) ? "把元素专属套装当成同属性角色通用答案，忽略角色机制差异。" : "Treating elemental sets as universal answers for every unit of the same attribute."}</li>
            </ul>
          </div>
        </section>

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
