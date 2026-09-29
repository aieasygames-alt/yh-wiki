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
  const description = locale === "tw"
    ? `異環歷史卡帶索引整理 ${diskSets.length} 套資料，包含元素與通用套裝的 2 件套、4 件套和關聯角色欄位；目前效果與可獲取狀態請以客戶端為準。`
    : locale === "zh"
    ? `异环历史卡带索引，整理 ${diskSets.length} 套资料，包含元素与通用套装的 2 件套、4 件套和关联角色字段；当前效果与可获取状态请以客户端为准。`
    : `Historical NTE cassette index with ${diskSets.length} recorded sets, including elemental and general 2-piece, 4-piece, and character-association fields. Verify current effects and availability in the client.`;

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
              ? "异环历史卡带套装资料索引，包含记录中的2件套、4件套字段与角色关联。当前套装文字、数值、掉落和适配请以目标区服客户端和官方公告为准。"
              : "Historical NTE cassette-set reference index with recorded 2-piece, 4-piece, and character-association fields. Verify current set text, values, drops, and fit in the target server’s client and official notices."}
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "这页卡带总表最适合怎么用？" : "How should you use this disk-set hub?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "本页只适合查找和横向比较历史字段。不要依据套装名称、2件套、4件套或关联角色标签直接刷取；先在客户端核对当前效果、触发条件、掉落和角色机制。"
              : "Use this page only to find and compare historical fields. Do not farm from a set name, 2-piece, 4-piece, or association tag alone; verify current effects, triggers, drops, and character mechanics in the client first."}
          </p>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "刷卡带前先判断什么" : "What should you check before farming sets?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "客户端中的2件套、4件套文字、数值和触发条件是否仍与记录一致。" : "Whether the client’s 2-piece and 4-piece text, values, and triggers still match the record."}</li>
              <li>{isZhLocale(locale) ? "当前掉落地点、开放条件、体力成本和活动加成。" : "Current drop location, unlock requirements, stamina cost, and event modifiers."}</li>
              <li>{isZhLocale(locale) ? "目标角色当前技能与元素互动是否仍满足套装条件。" : "Whether the target character’s current kit and element interactions still meet the set condition."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "看到推荐角色就默认毕业，不核对自己当前队伍和词条需求。" : "Assuming a recommended set is automatically best-in-slot without checking your own team and stat needs."}</li>
              <li>{isZhLocale(locale) ? "把记录中的4件套当作当前固定毕业答案。" : "Treating the recorded 4-piece effect as a current fixed best-in-slot answer."}</li>
              <li>{isZhLocale(locale) ? "把元素或关联角色标签当成当前适配结论。" : "Treating element or character-association tags as a current fit verdict."}</li>
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
