import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getAnomaly, getAllAnomalies } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { anomalySeoCopy, completeMetaDescription, localizedName, localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  const anomalies = getAllAnomalies();
  return anomalies.flatMap((a) => LOCALES.map((lang) => ({ lang, slug: a.id })));
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const anomaly = getAnomaly(slug);
  if (!anomaly) return {};
  const locale = lang as Locale;
  const typeLabel = anomaly.type === "boss"
    ? "Boss"
    : anomaly.type === "elite"
    ? localizedText(locale, "精英", "Elite")
    : localizedText(locale, "普通", "Normal");
  const copy = anomalySeoCopy({
    locale,
    name: anomaly.name,
    nameEn: anomaly.nameEn,
    typeLabel,
    location: anomaly.location,
    locationEn: anomaly.locationEn,
    weakness: anomaly.weakness,
    weaknessEn: anomaly.weaknessEn,
    drops: anomaly.drops,
    dropsEn: anomaly.dropsEn,
  });
  const extraContext = locale === "en"
    ? `${anomaly.locationEn ? ` Found around ${anomaly.locationEn}.` : ""}${anomaly.dropsEn?.length ? ` Common drops include ${anomaly.dropsEn.slice(0, 2).join(", ")}.` : ""}`
    : locale === "tw"
      ? `${anomaly.location ? ` 出現區域：${anomaly.location}。` : ""}${anomaly.drops?.length ? ` 常見掉落包含 ${anomaly.drops.slice(0, 2).join("、")}。` : ""}`
      : `${anomaly.location ? ` 出现区域：${anomaly.location}。` : ""}${anomaly.drops?.length ? ` 常见掉落包含 ${anomaly.drops.slice(0, 2).join("、")}。` : ""}`;
  const fallbackContext = locale === "en"
    ? ` This page helps you check weakness cues, combat mechanics, and preparation priorities before fighting.`
    : locale === "tw"
      ? ` 本頁也會幫你快速確認弱點提示、戰鬥機制與開打前的準備重點。`
      : ` 本页也会帮你快速确认弱点提示、战斗机制与开打前的准备重点。`;

  return {
    title: copy.title,
    description: completeMetaDescription(locale, `${copy.description}${extraContext}${fallbackContext}`),
    alternates: hreflangAlternates(`anomalies/${slug}`, lang),
  };
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <tr className="border-b border-gray-800/50 last:border-0">
      <td className="py-2 pr-4 text-gray-500 whitespace-nowrap text-sm">{label}</td>
      <td className="py-2 text-gray-300 text-sm">{value}</td>
    </tr>
  );
}

const typeColors: Record<string, string> = {
  boss: "bg-red-500/10 border-red-500/30 text-red-400",
  elite: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  normal: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

export default async function AnomalyDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const anomaly = getAnomaly(slug);
  if (!anomaly) notFound();

  const anomalyName = localizedName(locale, anomaly.name, anomaly.nameEn);
  const typeLabel = anomaly.type === "boss" ? "Boss" : anomaly.type === "elite" ? localizedText(locale, "精英", "Elite") : localizedText(locale, "普通", "Normal");
  const category = localizedText(locale, anomaly.categoryZh || anomaly.category || "", anomaly.category || "");
  const attribute = localizedText(locale, anomaly.attribute || "", anomaly.attributeEn || anomaly.attribute || "");
  const location = localizedText(locale, anomaly.location || "", anomaly.locationEn || anomaly.location || "");
  const weakness = localizedText(locale, anomaly.weakness || "", anomaly.weaknessEn || anomaly.weakness || "");
  const mechanics = localizedText(locale, anomaly.mechanics || "", anomaly.mechanicsEn || anomaly.mechanics || "");
  const strategy = localizedText(locale, anomaly.strategy || "", anomaly.strategyEn || anomaly.strategy || "");
  const drops = locale === "en" ? anomaly.dropsEn || anomaly.drops : anomaly.drops?.map((drop) => localizedText(locale, drop, drop));

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: t(locale, "anomalies.title"), href: `/${lang}/anomalies` },
          { label: anomalyName },
        ]}
      />
      <ArticleJsonLd
        title={anomalyName}
        description={isZhLocale(locale)
          ? `${anomalyName}（${typeLabel}）— 出现位置、机制与应对策略`
          : `${anomaly.nameEn} (${typeLabel}) — spawn locations, mechanics, and counter strategies`}
        url={`https://nteguide.com/${lang}/anomalies/${slug}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {anomalyName}
              </h1>
              <p className="text-gray-500">{locale === "en" ? anomaly.name : anomaly.nameEn}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full border ${typeColors[anomaly.type] || ""}`}>
              {typeLabel}
            </span>
          </div>
          {anomaly.appearance && (
            <p className="mt-3 text-sm text-gray-400">{anomaly.appearance}</p>
          )}
        </div>

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-3">
            {localizedText(locale, "攻略概览", "Guide Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${anomalyName}」属于${typeLabel}级异象。本页汇总它的出现位置、属性信息、弱点提示、战斗机制、掉落物和应对思路，适合在挑战前快速确认规避点与输出窗口。若页面中的位置或掉落仍显示为预发布资料，请以正式服更新后的数据状态提示为准。`,
              `${anomalyName} is a ${typeLabel} anomaly. This guide summarizes its spawn location, attribute information, weakness cues, combat mechanics, drops, and counter strategy so you can review dodge timing and damage windows before the fight. If any field is marked as pre-release data, treat the live game update as the final source.`
            )}
          </p>
        </section>

        {/* Quick Stats */}
        <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8">
          <h2 className="text-lg font-bold mb-3">{t(locale, "anomalies.quickStats")}</h2>
          <table className="w-full text-sm">
            <tbody>
              <InfoRow label={t(locale, "common.type")} value={typeLabel} />
              <InfoRow label={t(locale, "anomalies.category")} value={category} />
              <InfoRow label={t(locale, "common.element")} value={attribute} />
              {anomaly.hp && <InfoRow label="HP" value={anomaly.hp} />}
              <InfoRow label={t(locale, "anomalies.location")} value={location} />
            </tbody>
          </table>
        </aside>

        {/* Weakness */}
        {anomaly.weakness && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.weakness")}</h2>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-5">
              <p className="text-gray-300">{weakness}</p>
            </div>
          </section>
        )}

        {/* Mechanics */}
        {anomaly.mechanics && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.mechanics")}</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <p className="text-gray-300">{mechanics}</p>
            </div>
          </section>
        )}

        {/* Strategy */}
        {anomaly.strategy && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.strategy")}</h2>
            <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-5">
              <p className="text-gray-300">{strategy}</p>
            </div>
          </section>
        )}

        {/* Drops */}
        {drops && drops.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.drops")}</h2>
            <div className="flex flex-wrap gap-2">
              {drops.map((drop, i) => (
                <span key={i} className="text-sm px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50 text-gray-300">
                  {drop}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "挑战前准备", "Preparation Checklist", "挑戰前準備")}
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-gray-300">
              <li>
                {localizedText(
                  locale,
                  weakness ? `优先带能利用「${weakness}」弱点的输出或破盾角色，避免用被克制属性硬打。` : "如果弱点资料仍未公布，先带泛用输出、治疗和护盾位，观察正式服机制后再调整。",
                  weakness ? `Prioritize damage or shield-break options that can exploit ${weakness}; avoid forcing resisted attributes.` : "If weakness data is not confirmed yet, start with universal damage, healing, and shielding, then adjust after live mechanics are verified.",
                  weakness ? `優先帶能利用「${weakness}」弱點的輸出或破盾角色，避免用被克制屬性硬打。` : "如果弱點資料仍未公布，先帶泛用輸出、治療和護盾位，觀察正式服機制後再調整。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  location ? `前往「${location}」前先开附近传送点，并把同区域材料、任务和收集物一起清掉。` : "如果位置还在校对，建议通过任务追踪或地图标点确认入口，避免误把预发布坐标当成正式路线。",
                  location ? `Before heading to ${location}, unlock the nearby teleport and bundle same-region materials, quests, and collectibles into the route.` : "If the location is still being checked, verify the entrance through quest tracking or map markers instead of trusting pre-release coordinates.",
                  location ? `前往「${location}」前先開附近傳送點，並把同區域素材、任務和收集物一起清掉。` : "如果位置還在校對，建議透過任務追蹤或地圖標點確認入口，避免誤把預發布座標當成正式路線。"
                )}
              </li>
              <li>
                {localizedText(
                  locale,
                  drops && drops.length > 0 ? "如果目标是刷掉落，先确认掉落是否有每日、周常或体力限制，再决定是否重复挑战。" : "如果掉落列表还未完整，先把首通奖励和可重复奖励分开记录，方便后续补齐。",
                  drops && drops.length > 0 ? "If you are farming drops, check whether the reward is gated by daily, weekly, or stamina limits before repeating the fight." : "If the drop list is incomplete, separate first-clear rewards from repeatable rewards so later updates are easier to reconcile.",
                  drops && drops.length > 0 ? "如果目標是刷掉落，先確認掉落是否有每日、週常或體力限制，再決定是否重複挑戰。" : "如果掉落列表還未完整，先把首通獎勵和可重複獎勵分開記錄，方便後續補齊。"
                )}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "推荐后续页面", "Recommended Next Pages", "推薦後續頁面")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `如果「${anomalyName}」会影响你的养成路线，建议把打法、掉落和队伍配置一起看。先确认地图位置，再用配队工具补齐输出、生存和破盾位，最后回到素材页核对是否值得持续刷。`,
                `If ${anomalyName} affects your progression plan, review the fight, drops, and team setup together. Confirm the map location, use the team builder to cover damage, sustain, and shield break, then check material pages before farming repeatedly.`,
                `如果「${anomalyName}」會影響你的養成路線，建議把打法、掉落和隊伍配置一起看。先確認地圖位置，再用配隊工具補齊輸出、生存和破盾位，最後回到素材頁核對是否值得持續刷。`
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/team-builder/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "配队模拟器", "Team builder", "配隊模擬器")}
              </Link>
              <Link href={`/${lang}/materials/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "素材列表", "Material list", "素材列表")}
              </Link>
              <Link href={`/${lang}/map/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "互动地图", "Interactive map", "互動地圖")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
