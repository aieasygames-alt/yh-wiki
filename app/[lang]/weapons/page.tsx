import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllWeapons } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { WeaponCard } from "../../../components/WeaponCard";
import { ARC_TYPE_LABELS, ARC_RANK_LABELS } from "../../../lib/attributes";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const weapons = getAllWeapons();
  const typeCount = new Set(weapons.map((weapon) => weapon.type)).size;
  const description = locale === "tw"
    ? `異環歷史弧盤索引彙整 ${weapons.length} 筆資料，涵蓋 ${typeCount} 種類型與 S/A/B 記錄欄位；目前數值、被動、可用性與適配請以客戶端為準。`
    : locale === "zh"
    ? `异环历史弧盘索引，汇总 ${weapons.length} 条资料，覆盖 ${typeCount} 种类型与 S/A/B 记录字段；当前数值、被动、可用性与适配请以客户端为准。`
    : `Browse ${weapons.length} historical NTE Arc records across ${typeCount} types and S/A/B fields. Verify current values, passives, availability, and fit in the client.`;

  return {
    title: t(locale, "weapons.title"),
    description,
    alternates: hreflangAlternates("weapons", lang),
    openGraph: {
      title: t(locale, "weapons.title"),
      description,
      type: "website",
    },
  };
}

const RANK_ORDER = ["S", "A", "B"];
const TYPE_ORDER = ["solid", "liquid", "gas", "plasma", "synthesis"];

export default async function WeaponsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const weapons = getAllWeapons();
  const typeCount = new Set(weapons.map((weapon) => weapon.type)).size;

  const weaponsByRank = RANK_ORDER.map((rank) => ({
    rank,
    rankLabel: ARC_RANK_LABELS[rank]?.[locale] || rank,
    types: TYPE_ORDER.map((type) => ({
      type,
      typeLabel: ARC_TYPE_LABELS[type]?.[locale] || type,
      weapons: weapons.filter((w) => w.rank === rank && w.type === type),
    })).filter((group) => group.weapons.length > 0),
  })).filter((group) => group.types.length > 0);

  return (
    <>
      <ItemListJsonLd
        items={weapons.map((w) => ({
          name: isZhLocale(locale) ? w.name : w.nameEn,
          url: `https://nteguide.com/${lang}/weapons/${w.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.weapons") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">{t(locale, "weapons.title")}</h1>
        <p className="text-gray-400 mb-8">{t(locale, "weapons.description")}</p>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale) ? "这页武器图鉴最适合解决什么问题？" : "What is this weapon index best for?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? "它适合查找历史面板字段和关联标签。当前弧盘、角色机制、被动触发、来源与投入价值必须以目标区服客户端和官方公告复核；站内角色与 Build 页同样只是历史参考。"
              : "Use this index to find historical stat fields and association tags. Verify current Arcs, character mechanics, passive triggers, sources, and investment value with the target server’s client and official notices; character and build pages here are historical references too."}
          </p>
        </section>

        <div className="mb-8">
          <QuickAnswerCard
            locale={locale}
            items={[
              { label: isZhLocale(locale) ? "武器总数" : "Weapons", value: `${weapons.length}` },
              { label: isZhLocale(locale) ? "弧盘类型" : "Arc types", value: `${typeCount}` },
              { label: isZhLocale(locale) ? "当前状态" : "Current status", value: isZhLocale(locale) ? "客户端逐项核对。" : "Verify each field in-client." },
              { label: isZhLocale(locale) ? "页面定位" : "Page scope", value: isZhLocale(locale) ? "历史字段与关联标签。" : "Historical fields and association tags." },
            ]}
          />
        </div>

        {weaponsByRank.map((rankGroup) => (
          <section key={rankGroup.rank} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary-400">{rankGroup.rankLabel}</h2>
            {rankGroup.types.map((typeGroup) => (
              <div key={typeGroup.type} className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">{typeGroup.typeLabel}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {typeGroup.weapons.map((w) => (
                    <WeaponCard
                      key={w.id}
                      id={w.id}
                      name={w.name}
                      nameTw={w.nameTw}
                      nameEn={w.nameEn}
                      rank={w.rank}
                      type={w.type}
                      baseAtk={w.baseAtk}
                      substat={w.substat}
                      substatValue={w.substatValue}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "培养前先看什么" : "Check this before investing"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "客户端中该弧盘是否仍存在，以及当前被动文字与触发条件。" : "Whether the Arc still exists in the client and its current passive text and trigger condition."}</li>
              <li>{isZhLocale(locale) ? "当前来源是否开放、限时，以及真实的卡池或兑换成本。" : "Whether its current source is open or limited, and its actual banner or exchange cost."}</li>
              <li>{isZhLocale(locale) ? "目标角色当前技能与装备是否仍允许该历史搭配。" : "Whether the target character’s current skills and equipment still permit the historical pairing."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "只按 S/A/B 稀有度排序，不看词条和角色适性。" : "Ranking Arcs by rarity alone without checking substats and character fit."}</li>
              <li>{isZhLocale(locale) ? "把同类型弧盘当成完全互换，忽略触发门槛。" : "Treating same-type Arcs as interchangeable and ignoring activation requirements."}</li>
              <li>{isZhLocale(locale) ? "把历史关联标签当成当前最优或抽取建议。" : "Treating historical association tags as current best-in-slot or pull advice."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
