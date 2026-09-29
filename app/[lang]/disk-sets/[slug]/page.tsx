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
          : `Historical ${set.nameEn} (${set.pieces}-piece) cassette reference — recorded set fields and character associations`}
        url={`https://nteguide.com/${lang}/disk-sets/${slug}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          {localizedText(
            locale,
            "历史卡带资料复核：2026-09-29。本页不验证当前2件套与4件套效果、触发条件、数值、掉落地点、角色适配或刷取优先级；开始刷取、装配或升级前，请以目标区服客户端和官方公告为准。",
            "Historical cassette reference reviewed September 29, 2026. This page does not verify current 2-piece or 4-piece effects, triggers, values, drop locations, character fit, or farming priority. Before farming, equipping, or upgrading, use the target server's client and official notices as the source of truth.",
            "歷史卡帶資料復核：2026-09-29。本頁不驗證目前2件套與4件套效果、觸發條件、數值、掉落地點、角色適配或刷取優先級；開始刷取、裝配或升級前，請以目標區服客戶端和官方公告為準。"
          )}
        </section>
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
              `「${setName}」是站内记录的${set.pieces}件卡带资料，包含历史2件套与4件套字段、关联角色和属性倾向。它不验证当前效果、触发条件、掉落地点或角色适配，不能作为刷取或养成决定。`,
              `${setName} is a recorded ${set.pieces}-piece cassette reference with historical 2-piece and 4-piece fields, character associations, and stat direction. It does not verify current effects, triggers, drop locations, or character fit and cannot determine farming or upgrade decisions.`
            )}
          </p>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            {localizedText(
              locale,
              `开始刷取、装配或升级前，请在目标区服客户端核对2件套与4件套的当前文字、触发条件、覆盖时间、可获取状态和角色机制。`,
              `Before farming, equipping, or upgrading, verify the current 2-piece and 4-piece text, trigger conditions, uptime, availability, and character mechanics in the target server's client.`,
              `開始刷取、裝配或升級前，請在目標區服客戶端核對2件套與4件套的目前文字、觸發條件、覆蓋時間、可獲取狀態和角色機制。`
            )}
          </p>
        </section>

        {/* Set Bonuses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {localizedText(locale, "历史套装字段", "Historical Set Fields", "歷史套裝欄位")}
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
            {localizedText(locale, "历史关联角色", "Historical Character Associations", "歷史關聯角色")}
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
              {localizedText(locale, "客户端核对步骤", "Client Verification Steps", "客戶端核對步驟")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  set.characters.length > 0 ? "本站历史资料关联了若干角色；这不等于当前适配或刷取优先级，请先核对目标角色和套装的当前效果。" : "暂无历史关联角色不代表当前无法使用，也不能据此判断体力投入。",
                  set.characters.length > 0 ? "The site has historical character associations; these do not establish current fit or farming priority. Confirm the target character and set's current effects first." : "No historical association does not establish current incompatibility or stamina priority.",
                  set.characters.length > 0 ? "本站歷史資料關聯了若干角色；這不等於目前適配或刷取優先級，請先核對目標角色和套裝的目前效果。" : "暫無歷史關聯角色不代表目前無法使用，也不能據此判斷體力投入。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  set.element ? `核对当前角色是否仍能稳定触发记录中的${getAttributeLabel(set.element, locale)}相关条件，以及当前套装是否仍有相同加成。` : "核对当前套装的主词条、副词条、触发条件和数值，不要用历史字段推断长期价值。",
                  set.element ? `Verify whether the current character can still trigger the recorded ${getAttributeLabel(set.element, locale)}-related condition and whether the current set retains that bonus.` : "Verify current main stats, substats, triggers, and values; do not infer long-term value from historical fields.",
                  set.element ? `核對目前角色是否仍能穩定觸發記錄中的${getAttributeLabel(set.element, locale)}相關條件，以及目前套裝是否仍有相同加成。` : "核對目前套裝的主詞條、副詞條、觸發條件和數值，不要用歷史欄位推斷長期價值。"
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
                "本站角色页、弧盘页和配队工具均为历史参考。开始刷取或升级前，请把它们与客户端中的当前技能、装备效果和资源成本逐项对照。",
                "Character pages, Arc pages, and the team tool are historical references too. Before farming or upgrading, compare them item by item with the client’s current skills, equipment effects, and resource costs.",
                "本站角色頁、弧盤頁和配隊工具均為歷史參考。開始刷取或升級前，請把它們與客戶端中的目前技能、裝備效果和資源成本逐項對照。"
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
