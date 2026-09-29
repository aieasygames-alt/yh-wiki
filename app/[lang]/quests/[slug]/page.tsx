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
    return completeMetaDescription(locale, `Historical ${typeLabel.toLowerCase()} reference for ${name} in Neverness to Everness${regionName ? `, recorded in ${regionName}` : ""}. Includes ${stepsCount} recorded step${stepsCount === 1 ? "" : "s"} and ${rewardsCount} reward field${rewardsCount === 1 ? "" : "s"}; verify current requirements and rewards in the client.`);
  }

  if (locale === "tw") {
    return completeMetaDescription(locale, `異環${typeLabel}「${name}」歷史任務資料${regionName ? `，記錄於${regionName}` : ""}，整理 ${stepsCount} 個流程步驟與 ${rewardsCount} 項獎勵欄位；目前條件和獎勵請以客戶端為準。`);
  }

  return completeMetaDescription(locale, `异环${typeLabel}「${name}」历史任务资料${regionName ? `，记录于${regionName}` : ""}，整理 ${stepsCount} 个流程步骤与 ${rewardsCount} 项奖励字段；当前条件和奖励请以客户端为准。`);
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
    ? localizedText(locale, "支线任务历史资料", "Side Quest History")
    : localizedText(locale, "异象委托历史资料", "Anomaly Commission History");

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
          { label: isZh ? "任务历史资料" : "Quest History", href: `/${lang}/quests` },
          { label: name },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          {isZh
            ? "历史任务资料复核：本页的入口、前置条件、区域、难度、步骤、奖励、关联角色与解锁结果均不验证当前版本。开始任务、安排路线或按奖励投入资源前，请以目标区服客户端和官方公告为准。"
            : "Historical quest reference: access, prerequisites, region, difficulty, steps, rewards, related characters, and unlock results on this page do not verify the current version. Before starting, routing, or spending around a reward, confirm them in your target client and official notices."}
        </section>
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
              {isZh ? "历史流程记录" : "Historical Steps"}
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
              {isZh ? "历史奖励字段" : "Historical Reward Fields"}
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
              {isZh ? "历史关联角色" : "Historical Related Characters"}
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
              {localizedText(locale, "开始前的客户端核对", "Verify in Your Client Before Starting", "開始前的客戶端核對")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  regionName ? `在客户端确认「${regionName}」是否仍有该任务、入口和传送点是否可用。` : "在客户端确认任务是否仍存在、入口在哪里，以及最近传送点是否可用。",
                  regionName ? `Confirm in the client that this quest still exists in ${regionName} and that its entrance and teleport are available.` : "Confirm in the client that the quest still exists, where its entrance is, and whether the nearest teleport is available.",
                  regionName ? `在客戶端確認「${regionName}」是否仍有該任務、入口和傳送點是否可用。` : "在客戶端確認任務是否仍存在、入口在哪裡，以及最近傳送點是否可用。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  "在客户端确认当前前置条件、敌人、难度、队伍限制和失败代价，不使用历史星级或路线替代。",
                  "Confirm current prerequisites, enemies, difficulty, team limits, and failure costs in the client; do not substitute historical stars or routes.",
                  "在客戶端確認目前前置條件、敵人、難度、隊伍限制和失敗代價，不使用歷史星級或路線替代。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  "在任务结算前后核对实际奖励、可重复性、解锁内容和库存变化；站内奖励字段不能作为消费依据。",
                  "Before and after settlement, verify actual rewards, repeatability, unlocked content, and inventory changes; site reward fields are not a spending basis.",
                  "在任務結算前後核對實際獎勵、可重複性、解鎖內容和庫存變化；站內獎勵欄位不能作為消費依據。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "完成后的复核", "Verify After Completion", "完成後的複核")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `完成「${name}」后，以客户端结算、任务日志和地图状态为准，记录实际奖励、解锁内容和当前位置。若要继续探索或养成，请先重新核对当前地图、材料和角色需求，而不要沿用本站的历史字段。`,
                `After ${name}, use the client settlement, quest log, and map state to record actual rewards, unlocked content, and location. Before exploring or upgrading further, re-check the current map, materials, and character requirements instead of reusing this site's historical fields.`,
                `完成「${name}」後，以客戶端結算、任務日誌和地圖狀態為準，記錄實際獎勵、解鎖內容和目前位置。若要繼續探索或養成，請先重新核對目前地圖、素材和角色需求，不要沿用本站的歷史欄位。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/map/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "查看地图历史资料", "Open historical map references", "查看地圖歷史資料")}
              </Link>
              <Link href={`/${lang}/explorer/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "查看探索历史资料", "Open historical explorer references", "查看探索歷史資料")}
              </Link>
              <Link href={`/${lang}/calculator/leveling/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "查看本地材料估算", "Open local material estimate", "查看本地素材估算")}
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
