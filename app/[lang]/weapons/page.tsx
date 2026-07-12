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
  const description = isZhLocale(locale)
    ? `异环武器图鉴，汇总 ${weapons.length} 把武器，覆盖 ${typeCount} 种弧盘类型与 S/A/B 全稀有度，并附基础攻击、词条与适用方向，方便配装查询。`
    : `Browse ${weapons.length} Neverness to Everness weapons across ${typeCount} arc types and S/A/B rarities, with base attack, substats, and build-oriented lookup support.`;

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
              ? "它适合你在抽到新弧盘、切换角色 Build 或比较同类型武器时快速确认面板和适配方向。真正决定要不要投入培养时，最好再回到对应角色攻略和 Build 页交叉判断。"
              : "Use this index when you pull a new Arc, swap a character build, or compare same-type options side by side. Before committing upgrades, cross-check the matching character guide and build page for role context."}
          </p>
        </section>

        <div className="mb-8">
          <QuickAnswerCard
            locale={locale}
            items={[
              { label: isZhLocale(locale) ? "武器总数" : "Weapons", value: `${weapons.length}` },
              { label: isZhLocale(locale) ? "弧盘类型" : "Arc types", value: `${typeCount}` },
              { label: isZhLocale(locale) ? "优先判断" : "First check", value: isZhLocale(locale) ? "先看词条和触发条件，再看稀有度。" : "Check substat and trigger condition before rarity." },
              { label: isZhLocale(locale) ? "搭配方式" : "Best use", value: isZhLocale(locale) ? "配合角色 Build 页一起看。" : "Use together with the build index." },
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
              <li>{isZhLocale(locale) ? "角色是否真的能稳定触发该弧盘被动。" : "Whether your character can trigger the Arc passive consistently."}</li>
              <li>{isZhLocale(locale) ? "这把弧盘是不是会和下期卡池、替补角色共用。" : "Whether the Arc can be shared across future carries or backup units."}</li>
              <li>{isZhLocale(locale) ? "当前副本、Boss 或 999 Nights 更需要面板还是功能。" : "Whether your current target values raw stats or utility more."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? "只按 S/A/B 稀有度排序，不看词条和角色适性。" : "Ranking Arcs by rarity alone without checking substats and character fit."}</li>
              <li>{isZhLocale(locale) ? "把同类型弧盘当成完全互换，忽略触发门槛。" : "Treating same-type Arcs as interchangeable and ignoring activation requirements."}</li>
              <li>{isZhLocale(locale) ? "为了追求毕业专武，拖慢多个主力角色的整体成型。" : "Over-chasing signature weapons and slowing down the rest of the roster."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
