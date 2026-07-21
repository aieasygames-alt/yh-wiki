import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getWeapon, getAllWeapons, getCharactersUsingWeapon } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { WeaponSummary } from "../../../../components/WeaponSummary";
import { GameImage } from "../../../../components/GameImage";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { ARC_TYPE_LABELS, ARC_RANK_LABELS, SUBSTAT_LABELS, OBTAIN_METHOD_LABELS } from "../../../../lib/attributes";
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  const weapons = getAllWeapons();
  return weapons.flatMap((w: { id: string }) => LOCALES.map((lang) => ({ lang, slug: w.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const weapon = getWeapon(slug);
  if (!weapon) return {};
  const locale = lang as Locale;
  const displayName = locale === "zh" ? weapon.name : (locale === "tw" ? (weapon.nameTw || weapon.name) : weapon.nameEn);
  const substatLabel = SUBSTAT_LABELS[weapon.substat]?.[locale] || weapon.substat;
  const typeLabel = ARC_TYPE_LABELS[weapon.type]?.[locale] || weapon.type;
  const mappedObtainLabel = OBTAIN_METHOD_LABELS[weapon.howToObtain]?.[locale];
  const obtainDesc = locale === "tw"
    ? (weapon.howToObtainTw || mappedObtainLabel || "詳見頁內獲取方式、委託條件與適配角色整理")
    : isZhLocale(locale)
    ? weapon.howToObtainZh
    : weapon.howToObtainEn;
  const relatedCharacters = getCharactersUsingWeapon(slug);
  const topCharacters = relatedCharacters
    .slice(0, 3)
    .map((character) =>
      locale === "zh"
        ? character.name
        : locale === "tw"
        ? (character.nameTw || character.name)
        : character.nameEn
    );
  const characterText = topCharacters.length
    ? (
        locale === "tw"
          ? `適合 ${topCharacters.join("、")} 等角色配置`
          : isZhLocale(locale)
          ? `适合 ${topCharacters.join("、")} 等角色配置`
          : `Recommended for ${topCharacters.join(", ")} and similar builds`
      )
    : (
        locale === "tw"
          ? "可用來對照不同角色的弧盤搭配方向"
          : isZhLocale(locale)
          ? "可用于对照不同角色的弧盘搭配方向"
          : "Useful for comparing Arc choices across different characters"
      );
  const description = completeMetaDescription(locale,
    locale === "tw"
      ? `異環弧盤「${displayName}」${weapon.rank}級${typeLabel}屬性，基礎 ATK ${weapon.baseAtk}、副詞條 ${substatLabel} ${weapon.substatValue}，${characterText}，並整理被動效果與獲取方式：${obtainDesc}`
      : isZhLocale(locale)
      ? `异环弧盘「${displayName}」${weapon.rank}级${typeLabel}属性，基础 ATK ${weapon.baseAtk}、副词条 ${substatLabel} ${weapon.substatValue}，${characterText}，并整理被动效果与获取方式：${obtainDesc}`
      : `${weapon.nameEn} is a ${weapon.rank}-rank ${ARC_TYPE_LABELS[weapon.type]?.en || weapon.type} Arc in NTE with base ATK ${weapon.baseAtk} and ${SUBSTAT_LABELS[weapon.substat]?.en || weapon.substat} ${weapon.substatValue}. ${characterText}. Includes passive effect details and how to obtain it: ${obtainDesc}`);
  return {
    title:
      locale === "tw"
        ? `${displayName} 屬性與獲取方式 | 異環弧盤 Wiki`
        : isZhLocale(locale)
        ? `${displayName} 属性、精炼与获取方式 | 异环弧盘 Wiki`
        : `${weapon.nameEn} (${weapon.rank}-Rank ${ARC_TYPE_LABELS[weapon.type]?.en || weapon.type}) — Stats, Best Characters & How to Get`,
    description,
    alternates: hreflangAlternates(`weapons/${slug}`, lang),
    openGraph: {
      title: isZhLocale(locale) ? `${displayName} | 异环弧盘 Wiki` : `${weapon.nameEn} Stats & Best Characters`,
      description,
      type: "article",
      images: weapon.image ? [`https://nteguide.com${weapon.image}`] : undefined,
    },
  };
}

export default async function WeaponDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const weapon = getWeapon(slug);
  if (!weapon) notFound();

  const characters = getCharactersUsingWeapon(slug);
  const displayName = locale === "zh" ? weapon.name : (locale === "tw" ? (weapon.nameTw || weapon.name) : weapon.nameEn);
  const altName = locale === "en" ? weapon.name : weapon.nameEn;
  const typeLabel = ARC_TYPE_LABELS[weapon.type]?.[locale] || weapon.type;
  const rankLabel = ARC_RANK_LABELS[weapon.rank]?.[locale] || weapon.rank;
  const substatLabel = SUBSTAT_LABELS[weapon.substat]?.[locale] || weapon.substat;
  const obtainLabel = OBTAIN_METHOD_LABELS[weapon.howToObtain]?.[locale] || weapon.howToObtain;
  const effectName = locale === "zh" ? weapon.effectName : (locale === "tw" ? (weapon.effectNameTw || weapon.effectName) : weapon.effectNameEn);
  const effectDesc = locale === "zh" ? weapon.effectDescription : (locale === "tw" ? (weapon.effectDescriptionTw || weapon.effectDescription) : weapon.effectDescriptionEn);
  const obtainPageDesc = isZhLocale(locale) ? weapon.howToObtainZh : weapon.howToObtainEn;

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.weapons"), href: `/${lang}/weapons` },
          { label: displayName },
        ]}
      />
      <ArticleJsonLd
        title={`${displayName} | ${t(locale, "site.nav.weapons")}`}
        description={isZhLocale(locale)
          ? `异环弧盘「${displayName}」${rankLabel}${typeLabel}，基础攻击 ${weapon.baseAtk}，${substatLabel} ${weapon.substatValue}。${obtainPageDesc}`
          : `${weapon.nameEn} is a ${weapon.rank}-rank ${typeLabel} Arc in Neverness to Everness. Base ATK ${weapon.baseAtk}, ${substatLabel} ${weapon.substatValue}. ${obtainPageDesc}`}
        url={`https://nteguide.com/${lang}/weapons/${weapon.id}/`}
        image={weapon.image ? `https://nteguide.com${weapon.image}` : undefined}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Weapon Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage
              type="weapon"
              id={weapon.id}
              name={weapon.name}
              className="w-24 h-24 rounded-lg shrink-0"
              priority
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-sm font-bold ${weapon.rank === "S" ? "text-yellow-400" : weapon.rank === "A" ? "text-purple-400" : "text-blue-400"}`}>
                  {rankLabel}
                </span>
                <span className="text-xs px-2 py-0.5 rounded border bg-gray-800 text-gray-300">
                  {typeLabel}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-gray-500 text-sm">{altName}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">ATK</p>
              <p className="text-lg font-bold text-primary-400">{weapon.baseAtk}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">{substatLabel}</p>
              <p className="text-lg font-bold text-primary-400">{weapon.substatValue}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">{isZhLocale(locale) ? (locale === "tw" ? "來源" : "来源") : "Source"}</p>
              <p className="text-sm font-medium text-gray-300">{obtainLabel}</p>
            </div>
          </div>
        </div>

        <WeaponSummary
          name={weapon.name} nameTw={weapon.nameTw} nameEn={weapon.nameEn}
          rank={weapon.rank} type={weapon.type}
          baseAtk={weapon.baseAtk} substat={weapon.substat} substatValue={weapon.substatValue}
          howToObtain={weapon.howToObtain} howToObtainZh={weapon.howToObtainZh} howToObtainEn={weapon.howToObtainEn}
          relatedCharacters={characters.map(c => ({ name: c.name, nameTw: c.nameTw || "", nameEn: c.nameEn }))}
          locale={locale}
        />

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-3">
            {localizedText(locale, "弧盘定位速览", "Arc Role Overview", "弧盤定位速覽")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${displayName}」适合优先检查三个维度：${typeLabel}属性是否契合角色机制，副词条 ${substatLabel} ${weapon.substatValue} 是否补到Build短板，以及获取方式是否适合当前版本投入。不要只看基础 ATK，弧盘被动、角色技能循环和队伍增益覆盖通常会决定最终收益。`,
              `${displayName} should be evaluated across three points: whether its ${typeLabel} type fits the character kit, whether ${substatLabel} ${weapon.substatValue} solves a build gap, and whether its acquisition method is worth the current patch investment. Do not judge by base ATK alone; passive uptime, rotation flow, and team buffs usually decide the final value.`,
              `「${displayName}」適合優先檢查三個維度：${typeLabel}屬性是否契合角色機制，副詞條 ${substatLabel} ${weapon.substatValue} 是否補到Build短板，以及獲取方式是否適合目前版本投入。不要只看基礎 ATK，弧盤被動、角色技能循環和隊伍增益覆蓋通常會決定最終收益。`
            )}
          </p>
        </section>

        {/* Passive Effect */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-xl font-bold mb-3">
            {isZhLocale(locale) ? (locale === "tw" ? "弧盤效果" : "弧盘效果") : "Arc Effect"}
            {effectName !== weapon.effectNameEn && effectName !== weapon.effectName && (
              <span className="text-gray-500 font-normal text-sm ml-2">
                {locale === "en" ? weapon.effectName : weapon.effectNameEn}
              </span>
            )}
          </h2>
          <h3 className="text-primary-400 font-semibold mb-2">
            {locale === "zh" ? weapon.effectName : (locale === "tw" ? (weapon.effectNameTw || weapon.effectName) : weapon.effectNameEn)}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{effectDesc}</p>
        </section>

        {/* How to Obtain */}
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-xl font-bold mb-3">
            {isZhLocale(locale) ? (locale === "tw" ? "獲取方式" : "获取方式") : "How to Obtain"}
          </h2>
          <div className="flex items-start gap-3">
            <span className="text-xs px-2 py-1 rounded border bg-primary-500/20 text-primary-400 border-primary-500/30 whitespace-nowrap">
              {obtainLabel}
            </span>
            <p className="text-sm text-gray-300">{obtainPageDesc}</p>
          </div>
        </section>

        {/* Related Characters */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, "weapons.relatedCharacters")}</h2>
          {characters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {characters.map((c) => {
                const charName = locale === "zh" ? c.name : (locale === "tw" ? (c.nameTw || c.name) : c.nameEn);
                return (
                  <Link
                    key={c.id}
                    href={`/${lang}/characters/${c.id}`}
                    className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
                  >
                    <h3 className="font-medium text-sm truncate">{charName}</h3>
                    <p className="text-xs text-gray-500 truncate">{locale === "en" ? c.name : c.nameEn}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-bold ${c.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
                        {c.rank}
                      </span>
                      <span className="text-xs text-gray-500">{isZhLocale(locale) ? c.role : c.roleEn}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "适配判断", "Fit Checklist", "適配判斷")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  characters.length > 0 ? `如果你正在培养 ${characters.slice(0, 2).map((c) => locale === "zh" ? c.name : locale === "tw" ? (c.nameTw || c.name) : c.nameEn).join("、")}，优先比较这张弧盘和角色专属Build的契合度。` : "如果暂无明确适配角色，把它作为同属性或同副词条弧盘的备选，不建议优先投入稀缺资源。",
                  characters.length > 0 ? `If you are building ${characters.slice(0, 2).map((c) => c.nameEn).join(", ")}, compare this Arc against their dedicated build before spending scarce upgrade resources.` : "If no direct character fit is listed yet, treat it as a backup for matching type or substat builds instead of a top upgrade priority.",
                  characters.length > 0 ? `如果你正在培養 ${characters.slice(0, 2).map((c) => c.nameTw || c.name).join("、")}，優先比較這張弧盤和角色專屬Build的契合度。` : "如果暫無明確適配角色，把它作為同屬性或同副詞條弧盤的備選，不建議優先投入稀缺資源。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  `副词条 ${substatLabel} 更适合补齐面板缺口；如果角色已经溢出同类属性，就要看被动效果是否能提供新的增益类型。`,
                  `${substatLabel} is most useful when it fills a missing stat. If the character already overcaps the same stat, judge whether the passive adds a different kind of value.`,
                  `副詞條 ${substatLabel} 更適合補齊面板缺口；如果角色已經溢出同類屬性，就要看被動效果是否能提供新的增益類型。`
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  `获取来源为「${obtainLabel}」时，建议先确认是否有限时、卡池或兑换成本，再决定是否围绕它调整配队。`,
                  `Because the source is ${obtainLabel}, check limited availability, banner cost, or exchange cost before reshaping a team around it.`,
                  `獲取來源為「${obtainLabel}」時，建議先確認是否有限時、卡池或兌換成本，再決定是否圍繞它調整配隊。`
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "延伸规划", "Build Planning Links", "延伸規劃")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `决定是否升级「${displayName}」前，建议先把角色等级、队伍定位和卡带套装一起核对。这样可以避免弧盘、卡带和角色技能各自强化，却没有形成同一个输出或辅助目标。`,
                `Before upgrading ${displayName}, check character level, team role, and cassette set choice together. This prevents investing in an Arc, cassette, and skills that do not point toward the same damage or support goal.`,
                `決定是否升級「${displayName}」前，建議先把角色等級、隊伍定位和卡帶套裝一起核對。這樣可以避免弧盤、卡帶和角色技能各自強化，卻沒有形成同一個輸出或輔助目標。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/disk-sets/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "查看卡带套装", "View cassette sets", "查看卡帶套裝")}
              </Link>
              <Link href={`/${lang}/team-builder/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "配队模拟器", "Team builder", "配隊模擬器")}
              </Link>
              <Link href={`/${lang}/calculator/build/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "Build 计算器", "Build calculator", "Build 計算器")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
