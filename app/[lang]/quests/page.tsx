import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllQuests, getQuestsByType } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { localizedText } from "../../../lib/seo-copy";

const typeBadgeBg: Record<string, string> = {
  "side-quest": "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  "anomaly-commission": "bg-purple-500/10 border-purple-500/30 text-purple-400",
};

const difficultyStars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环任务历史资料 — 支线任务与异象委托记录", "NTE Quest History - Side Quest and Anomaly Commission Records");
  const description = localizedText(locale, "异环(NTE)历史任务资料，记录支线任务与异象委托的路线、奖励、区域和难度字段。当前入口、前置条件、步骤与奖励请以目标区服客户端为准。", "Historical NTE quest references with recorded side-quest and anomaly-commission routes, rewards, regions, and difficulty fields. Verify current access, prerequisites, steps, and rewards in your target client.");
  return {
    title,
    description,
    alternates: hreflangAlternates("quests", lang),
  };
}

export default async function QuestsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const quests = getAllQuests();

  const sideQuests = getQuestsByType("side-quest");
  const anomalyCommissions = getQuestsByType("anomaly-commission");

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: isZh ? "任务攻略" : "Quests" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {isZh ? "异环任务历史资料" : "NTE Quest History"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZh
              ? `收录 ${quests.length} 条任务历史记录，包含支线任务与异象委托的路线、奖励、区域和难度字段。`
              : `${quests.length} recorded quest references with route, reward, region, and difficulty fields for side quests and anomaly commissions.`}
          </p>
        </div>

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-lg font-bold mb-3">
            {localizedText(locale, "任务数据库说明", "Quest Database Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
            `任务列表按支线任务和异象委托分类，记录触发区域、难度、奖励、完成步骤与关联角色。它不验证当前任务入口、前置条件、路线、难度、奖励或解锁状态；开始前请在目标区服客户端逐项核对。`,
              `The list groups recorded side quests and anomaly commissions by trigger region, difficulty, rewards, steps, and related characters. It does not verify current access, prerequisites, routes, difficulty, rewards, or unlock status; confirm every item in your target client before starting.`
            )}
          </p>
        </section>

        {/* Side Quests */}
        {sideQuests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded bg-emerald-500"></span>
              {isZh ? "支线任务" : "Side Quests"}
              <span className="text-sm text-gray-500 font-normal">({sideQuests.length})</span>
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {sideQuests.map((quest) => (
                <Link
                  key={quest.id}
                  href={`/${lang}/quests/${quest.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/50 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded border ${typeBadgeBg["side-quest"]}`}>
                        {isZh ? quest.categoryZh || quest.category : quest.categoryEn || quest.category}
                      </span>
                      {quest.difficulty && (
                        <span className="text-xs text-yellow-400">{difficultyStars(quest.difficulty)}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-white mb-1">
                      {isZh ? quest.name : quest.nameEn}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {isZh ? quest.description : quest.descriptionEn}
                    </p>
                    {quest.regionZh && (
                      <p className="text-xs text-gray-500 mt-2">
                        📍 {isZh ? quest.regionZh : quest.regionEn}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Anomaly Commissions */}
        {anomalyCommissions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded bg-purple-500"></span>
              {isZh ? "异象委托" : "Anomaly Commissions"}
              <span className="text-sm text-gray-500 font-normal">({anomalyCommissions.length})</span>
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {anomalyCommissions.map((quest) => (
                <Link
                  key={quest.id}
                  href={`/${lang}/quests/${quest.id}`}
                  className="block rounded-lg border border-gray-800 bg-gray-900/50 hover:border-purple-500/50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded border bg-purple-500/10 border-purple-500/30 text-purple-400">
                        {isZh ? quest.categoryZh || quest.category : quest.categoryEn || quest.category}
                      </span>
                      {quest.difficulty && (
                        <span className="text-xs text-yellow-400">{difficultyStars(quest.difficulty)}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-white mb-1">
                      {isZh ? quest.name : quest.nameEn}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {isZh ? quest.description : quest.descriptionEn}
                    </p>
                    {quest.regionZh && (
                      <p className="text-xs text-gray-500 mt-2">
                        📍 {isZh ? quest.regionZh : quest.regionEn}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
