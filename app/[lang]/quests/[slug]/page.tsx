import Link from "next/link";
import { notFound } from "next/navigation";
import { isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getQuest, getAllQuests, getCharacter } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";
import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("../../../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

function buildQuestMetaDescription(args: {
  locale: Locale;
  name: string;
  typeLabel: string;
  regionName?: string;
  rewardsCount: number;
  stepsCount: number;
}) {
  const { locale, name, typeLabel, regionName, rewardsCount, stepsCount } = args;

  if (locale === "en") {
    return completeMetaDescription(locale, `Complete ${typeLabel.toLowerCase()} for ${name} in Neverness to Everness${regionName ? `, set in ${regionName}` : ""}. Includes ${stepsCount} walkthrough step${stepsCount === 1 ? "" : "s"}, reward overview, and practical completion tips.`);
  }

  if (locale === "tw") {
    return completeMetaDescription(locale, `異環${typeLabel}「${name}」完整攻略${regionName ? `，發生於${regionName}` : ""}，整理 ${stepsCount} 個流程步驟、${rewardsCount} 項任務獎勵與通關提示。`);
  }

  return completeMetaDescription(locale, `异环${typeLabel}「${name}」完整攻略${regionName ? `，发生于${regionName}` : ""}，整理 ${stepsCount} 个流程步骤、${rewardsCount} 项任务奖励与通关提示。`);
}

export function generateStaticParams() {
  const quests = getAllQuests();
  return quests.flatMap((q) => LOCALES.map((lang) => ({ lang, slug: q.id })));
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const quest = getQuest(slug);
  if (!quest) return {};

  const locale = lang as Locale;
  const isZh = isZhLocale(lang);
  const name = localizedText(locale, quest.name, quest.nameEn);
  const typeName = quest.type === "side-quest"
    ? localizedText(locale, "支线任务攻略", "Side Quest Guide")
    : localizedText(locale, "异象委托攻略", "Anomaly Commission Guide");

  return {
    title: isZh ? `${name} — ${typeName} | 异环 Wiki` : `${name} — ${typeName} | NTE Wiki`,
    description: buildQuestMetaDescription({
      locale,
      name,
      typeLabel: localizedText(locale, quest.typeZh, quest.typeZh, quest.typeZh),
      regionName: localizedText(locale, quest.regionZh || "", quest.regionEn || "", quest.regionZh || ""),
      rewardsCount: (isZh ? quest.rewards : quest.rewardsEn)?.length || 0,
      stepsCount: (isZh ? quest.steps : quest.stepsEn)?.length || 0,
    }),
    alternates: hreflangAlternates(`quests/${slug}`, lang),
  };
}

const difficultyStars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

const typeBadgeBg: Record<string, string> = {
  "side-quest": "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  "anomaly-commission": "bg-purple-500/10 border-purple-500/30 text-purple-400",
};

export default async function QuestDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const quest = getQuest(slug);
  if (!quest) notFound();

  const name = localizedText(locale, quest.name, quest.nameEn);
  const description = localizedText(locale, quest.description || "", quest.descriptionEn || "");
  const steps = isZh ? quest.steps?.map((step) => localizedText(locale, step, step)) : quest.stepsEn;
  const rewards = isZh ? quest.rewards?.map((reward) => localizedText(locale, reward, reward)) : quest.rewardsEn;
  const regionName = localizedText(locale, quest.regionZh || "", quest.regionEn || "");
  const typeLabel = localizedText(locale, quest.typeZh, quest.type);

  const relatedChars = (quest.relatedCharacters || [])
    .map((id) => getCharacter(id))
    .filter(Boolean);

  return (
    <>
      <ArticleJsonLd
        title={`${name} — ${isZh ? typeLabel : quest.type}`}
        description={description || ""}
        url={`https://nteguide.com/${lang}/quests/${slug}`}
        datePublished="2026-06-04"
        dateModified="2026-06-04"
      />
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: isZh ? "首页" : "Home", href: `/${lang}` },
          { label: isZh ? "任务攻略" : "Quests", href: `/${lang}/quests` },
          { label: name },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-500">{isZh ? quest.nameEn : quest.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${typeBadgeBg[quest.type] || ""}`}>
                {typeLabel}
              </span>
              {quest.difficulty && (
                <span className="text-xs text-yellow-400">{difficultyStars(quest.difficulty)}</span>
              )}
            </div>
          </div>
          {description && (
            <p className="mt-4 text-gray-300 leading-relaxed">{description}</p>
          )}
          {regionName && (
            <p className="mt-2 text-sm text-gray-500">
              📍 {regionName}
            </p>
          )}
        </div>

        {/* Steps */}
        {steps && steps.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {isZh ? "完成步骤" : "Walkthrough"}
            </h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start rounded-lg border border-gray-800 bg-gray-900/30 p-4"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </span>
                  <p className="text-gray-300 text-sm pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rewards */}
        {rewards && rewards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {isZh ? "任务奖励" : "Quest Rewards"}
            </h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
              <ul className="space-y-2">
                {rewards.map((reward, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400">🎁</span>
                    {reward}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {isZh ? "关联角色" : "Related Characters"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedChars.map((char) => char && (
                <Link
                  key={char.id}
                  href={`/${lang}/characters/${char.id}`}
                  className="px-4 py-2 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-primary-500/50 transition-colors text-sm text-gray-300"
                >
                  {isZh ? char.name : char.nameEn}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "开任务前先确认", "Before You Start", "開任務前先確認")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  regionName ? `先在地图中确认「${regionName}」的传送点和任务入口，避免流程中反复绕路。` : "先确认任务入口和最近传送点，尤其是需要多次往返的支线任务。",
                  regionName ? `Check the nearest teleport and quest entrance in ${regionName} before starting so the route does not waste time.` : "Check the quest entrance and nearest teleport first, especially for side quests that send you back and forth.",
                  regionName ? `先在地圖中確認「${regionName}」的傳送點和任務入口，避免流程中反覆繞路。` : "先確認任務入口和最近傳送點，尤其是需要多次往返的支線任務。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  quest.difficulty && quest.difficulty >= 4 ? "难度偏高的任务建议带上治疗或护盾角色，先保证容错再追求速度。" : "低到中等难度任务更适合顺路完成，可以和材料收集、地图补漏一起安排。",
                  quest.difficulty && quest.difficulty >= 4 ? "For higher-difficulty quests, bring healing or shielding first and optimize speed only after the route feels stable." : "Low and mid-difficulty quests are best bundled with material farming, map cleanup, or nearby exploration.",
                  quest.difficulty && quest.difficulty >= 4 ? "難度偏高的任務建議帶上治療或護盾角色，先保證容錯再追求速度。" : "低到中等難度任務更適合順路完成，可以和素材收集、地圖補漏一起安排。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  rewards && rewards.length > 0 ? "如果奖励包含养成素材，建议完成后立刻回到角色或弧盘规划页检查下一步消耗。" : "如果奖励信息仍在补充，以正式服任务结算界面为准，并优先记录可重复获取的资源。",
                  rewards && rewards.length > 0 ? "If rewards include progression materials, return to character or Arc planning after clearing to check the next spend." : "If reward data is still being verified, rely on the live quest result screen and record any repeatable resources first.",
                  rewards && rewards.length > 0 ? "如果獎勵包含養成素材，建議完成後立刻回到角色或弧盤規劃頁檢查下一步消耗。" : "如果獎勵資訊仍在補充，以正式服任務結算畫面為準，並優先記錄可重複取得的資源。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "完成后的下一步", "What To Do After Clearing", "完成後的下一步")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `完成「${name}」后，建议把任务获得的资源和当前位置一起记录下来。如果这条任务解锁了新的区域、异象或收集点，可以继续用地图和探索伴侣补齐同区域内容，减少后续跑图成本。`,
                `After clearing ${name}, record both the rewards and the location you ended in. If the quest unlocks a new area, anomaly, or collectible cluster, use the map and explorer companion to clean up the same region while you are already there.`,
                `完成「${name}」後，建議把任務取得的資源和目前位置一起記錄下來。如果這條任務解鎖了新的區域、異象或收集點，可以繼續用地圖和探索伴侶補齊同區域內容，減少後續跑圖成本。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/map/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "查看互动地图", "Open interactive map", "查看互動地圖")}
              </Link>
              <Link href={`/${lang}/explorer/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "使用探索伴侣", "Use explorer companion", "使用探索伴侶")}
              </Link>
              <Link href={`/${lang}/calculator/leveling/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "计算养成素材", "Calculate upgrade materials", "計算養成素材")}
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <GiscusComments locale={locale} term={`quest-${slug}`} />
        </div>
      </div>
    </>
  );
}
