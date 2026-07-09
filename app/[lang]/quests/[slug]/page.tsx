import Link from "next/link";
import { notFound } from "next/navigation";
import { isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getQuest, getAllQuests, getCharacter } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { localizedText } from "../../../../lib/seo-copy";
import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("../../../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

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
    description: isZh
      ? localizedText(locale, `异环${quest.typeZh}「${quest.name}」详细攻略，包含完成步骤、奖励和攻略提示。`, "")
      : `Complete guide for ${quest.nameEn} in Neverness to Everness. Step-by-step walkthrough, rewards, and tips.`,
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

        <div className="mt-8">
          <GiscusComments locale={locale} term={`quest-${slug}`} />
        </div>
      </div>
    </>
  );
}
