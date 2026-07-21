import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getDiskSet, getAllDiskSets, getAvailableCharacters } from "../../../../lib/queries";
import { getAttributeLabel, getAttributeColor } from "../../../../lib/attributes";
import { GameImage } from "../../../../components/GameImage";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { diskSetSeoCopy, localizedName, localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  const sets = getAllDiskSets();
  return sets.flatMap((s) => LOCALES.map((lang) => ({ lang, slug: s.id })));
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const set = getDiskSet(slug);
  if (!set) return {};
  const locale = lang as Locale;
  const categoryLabel = set.category === "elemental"
    ? localizedText(locale, "元素套", "elemental")
    : localizedText(locale, "通用套", "general");
  const elementLabel = set.element ? getAttributeLabel(set.element, locale) : undefined;
  const copy = diskSetSeoCopy({
    locale,
    name: set.name,
    nameTw: set.nameTw,
    nameEn: set.nameEn,
    categoryLabel,
    elementLabel,
    pieces: set.pieces,
    bonus2pc: locale === "en" ? set.setDescription2pcEn : set.setDescription2pc,
    bonus4pc: locale === "en" ? set.setDescription4pcEn : set.setDescription4pc,
    characterCount: set.characters.length,
  });

  return {
    title: copy.title,
    description: copy.description,
    alternates: hreflangAlternates(`disk-sets/${slug}`, lang),
  };
}

export default async function DiskSetDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const set = getDiskSet(slug);
  if (!set) notFound();

  const characters = getAvailableCharacters();
  const setName = localizedName(locale, set.name, set.nameEn, set.nameTw);
  const bonus2pc = localizedText(locale, set.setDescription2pc, set.setDescription2pcEn);
  const bonus4pc = localizedText(locale, set.setDescription4pc, set.setDescription4pcEn);

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.cassettes"), href: `/${lang}/disk-sets` },
          { label: setName },
        ]}
      />
      <ArticleJsonLd
        title={setName}
        description={isZhLocale(locale)
          ? `${setName}（${set.pieces}件套）— ${set.category === "elemental" ? t(locale, "diskSets.elementalLabel") : t(locale, "diskSets.generalLabel")} cassette 详细效果与适配角色`
          : `${set.nameEn} (${set.pieces}-piece set) — ${set.category === "elemental" ? "elemental" : "general"} cassette set effects and best characters`}
        url={`https://nteguide.com/${lang}/disk-sets/${slug}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex items-center gap-4">
            <GameImage
              type="cassette"
              id={set.id}
              name={setName}
              className="w-20 h-20 rounded-lg shrink-0"
              contain
            />
            <div>
              <h1 className="text-2xl font-bold">
                {setName}
              </h1>
              <p className="text-gray-500">{locale === "en" ? set.name : set.nameEn}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-3 py-1 rounded-full border bg-gray-800 text-gray-300">
                  {set.pieces}{isZhLocale(locale) ? "件套" : "-piece set"}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full border ${set.category === "elemental" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
                  {set.category === "elemental"
                    ? t(locale, "diskSets.elementalLabel")
                    : t(locale, "diskSets.generalLabel")}
                </span>
                {set.element && (
                  <span className={`text-xs px-3 py-1 rounded-full border ${getAttributeColor(set.element)}`}>
                    {getAttributeLabel(set.element, locale)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-3">
            {localizedText(locale, "套装概览", "Set Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${setName}」是异环中的${set.pieces}件卡带套装，定位为${set.category === "elemental" ? t(locale, "diskSets.elementalLabel") : t(locale, "diskSets.generalLabel")}配装。页面汇总2件套与4件套效果、适合角色、属性倾向和实战用法，方便在角色Build、DPS计算和配队规划前判断是否值得刷取。`,
              `${setName} is a ${set.pieces}-piece cassette set in Neverness to Everness. This page summarizes its 2-piece and 4-piece bonuses, recommended characters, stat direction, and practical build use cases so you can decide whether to farm it before planning teams or DPS rotations.`
            )}
          </p>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            {localizedText(
              locale,
              `判断这套卡带时，建议把2件套当作过渡收益，把4件套当作最终配装目标来比较。如果角色目前缺少的是面板属性，2件套可能已经够用；如果角色依赖特定循环、元素窗口或队伍增益，才更值得追完整4件套。`,
              `When judging this cassette set, compare the 2-piece bonus as a transitional gain and the 4-piece bonus as the final build target. If the character only needs raw stats, the 2-piece bonus may be enough. If the kit depends on a specific rotation, element window, or team buff, the full 4-piece set is more likely to matter.`,
              `判斷這套卡帶時，建議把2件套當作過渡收益，把4件套當作最終配裝目標來比較。如果角色目前缺少的是面板屬性，2件套可能已經夠用；如果角色依賴特定循環、元素窗口或隊伍增益，才更值得追完整4件套。`
            )}
          </p>
        </section>

        {/* Set Bonuses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "diskSets.setBonuses")}
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="text-primary-400 font-semibold mb-2">2{t(locale, "diskSetDetail.setDescription")}</h3>
              <p className="text-gray-300">{bonus2pc}</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <h3 className="text-primary-400 font-semibold mb-2">4{t(locale, "diskSetDetail.setDescription")}</h3>
              <p className="text-gray-300">{bonus4pc}</p>
            </div>
          </div>
        </section>

        {/* Recommended Characters */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "diskSets.recommendedCharacters")}
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
                    <div className="text-xs text-gray-500">{isZhLocale(locale) ? char.role : char.roleEn} · {char.rank}-Rank</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "刷取优先级", "Farming Priority", "刷取優先級")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  set.characters.length > 0 ? `如果你的主力队包含推荐角色中的核心输出或辅助，可以把「${setName}」列入中高优先级。` : `如果当前没有明确推荐角色，「${setName}」更适合作为备用套装，不建议优先消耗大量体力。`,
                  set.characters.length > 0 ? `If your main team uses one of the recommended damage or support characters, ${setName} can sit in a medium to high farming priority.` : `If no recommended character is listed yet, treat ${setName} as a backup set rather than a heavy stamina priority.`,
                  set.characters.length > 0 ? `如果你的主力隊包含推薦角色中的核心輸出或輔助，可以把「${setName}」列入中高優先級。` : `如果目前沒有明確推薦角色，「${setName}」更適合作為備用套裝，不建議優先消耗大量體力。`
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  set.element ? `元素套装要优先确认角色是否稳定打出${getAttributeLabel(set.element, locale)}相关伤害，否则套装加成会被浪费。` : "通用套装更看重副词条质量，主词条正确但副词条过差时仍然不建议长期使用。",
                  set.element ? `For elemental sets, confirm the character can consistently deal ${getAttributeLabel(set.element, locale)}-related damage or the bonus may be wasted.` : "For general sets, substat quality matters more; correct main stats with weak substats are still poor long-term pieces.",
                  set.element ? `元素套裝要優先確認角色是否穩定打出${getAttributeLabel(set.element, locale)}相關傷害，否則套裝加成會被浪費。` : "通用套裝更看重副詞條品質，主詞條正確但副詞條過差時仍然不建議長期使用。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "搭配下一步", "Next Build Step", "搭配下一步")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `刷到可用部件后，建议先去角色页确认技能机制，再用弧盘页和配队工具检查是否需要补暴击、攻击、能量或生存。这样能把「${setName}」放进完整Build，而不是只追套装名。`,
                `After finding usable pieces, check the character kit first, then use Arc pages and the team builder to see whether the build still needs crit, attack, energy, or sustain. This places ${setName} inside a complete build instead of chasing the set name alone.`,
                `刷到可用部件後，建議先去角色頁確認技能機制，再用弧盤頁和配隊工具檢查是否需要補暴擊、攻擊、能量或生存。這樣能把「${setName}」放進完整Build，而不是只追套裝名。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/characters/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "角色列表", "Character list", "角色列表")}
              </Link>
              <Link href={`/${lang}/weapons/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "弧盘列表", "Arc list", "弧盤列表")}
              </Link>
              <Link href={`/${lang}/team-builder/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "配队模拟器", "Team builder", "配隊模擬器")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
