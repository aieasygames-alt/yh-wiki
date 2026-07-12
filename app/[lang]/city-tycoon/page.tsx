import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getAllCharacters, getAllWeapons } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { GameImage } from "../../../components/GameImage";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import { CityTycoonTracker } from "../../../components/CityTycoonTracker";
import { localizedText } from "../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const allChars = getAllCharacters();
  const allWeapons = getAllWeapons();
  const xiaozhi = allChars.find((character) => character.id === "xiaozhi");
  const catWeapon = allWeapons.find((weapon) => weapon.id === "contemplative-cat");
  const title = localizedText(
    locale,
    t(locale, "cityTycoon.seoTitle"),
    t(locale, "cityTycoon.seoTitle"),
    "異環都市大亨繁中攻略 - 免費S級小吱與經營獎勵"
  );
  const description = localizedText(
    locale,
    `异环都市大亨攻略：整理经营升级、等级奖励、资源投入顺序与每日收益技巧，并说明 Lv.30 免费获取 ${xiaozhi?.name ?? "赤子（小智）"} 与 Lv.21 奖励 ${catWeapon?.name ?? "沉思之猫"} 的领取路线。`,
    `NTE City Tycoon guide covering management progression, level rewards, upgrade priorities, and daily profit tips, including how to claim ${xiaozhi?.nameEn ?? "Xiaozhi"} at Lv.30 and ${catWeapon?.nameEn ?? "Contemplative Cat"} at Lv.21.`,
    "異環都市大亨繁中攻略：Lv.30 免費取得S級小吱與專屬武器，整理經營升級、全等級獎勵、資源投入順序與每日收益技巧。"
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("city-tycoon", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CityTycoonPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const allChars = getAllCharacters();
  const allWeapons = getAllWeapons();
  const xiaozhi = allChars.find((c) => c.id === "xiaozhi");
  const catWeapon = allWeapons.find((w) => w.id === "contemplative-cat");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: isZh ? "异环都市大亨攻略" : "NTE City Tycoon Guide",
            description: isZh
              ? "都市大亨完整攻略：等级奖励、经营技巧、免费角色和武器获取"
              : "Complete City Tycoon guide: level rewards, management tips, free character and weapon",
            url: `https://nteguide.com/${lang}/city-tycoon`,
            applicationCategory: "GameApplication",
            operatingSystem: "All",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "cityTycoon.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          {t(locale, "cityTycoon.title")}
        </h1>
        <p className="text-gray-400 mb-8">
          {t(locale, "cityTycoon.subtitle")}
        </p>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {localizedText(locale, "这页都市大亨最适合怎么用？", "How should you use this City Tycoon guide?", "這頁都市大亨最適合怎麼看？")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {localizedText(
              locale,
              "先用这页确认都市大亨最关键的奖励门槛、升级顺序和值不值得投入，再结合角色页、武器页和探索工具补细节。这页最适合做经营系统路线规划，不适合替代单独的角色养成或地图收集页。",
              "Use this page to confirm the most important reward breakpoints, upgrade order, and whether City Tycoon is worth your time before you branch into character, weapon, or exploration pages. It is best for planning the management route, not for replacing dedicated build or map guides.",
              "先用這頁確認都市大亨最關鍵的獎勵門檻、升級順序和值不值得投入，再結合角色頁、武器頁和探索工具補細節。這頁最適合做經營系統路線規劃，不適合替代單獨的角色養成或地圖收集頁。"
            )}
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "开始前先看什么", "What should you check before starting?", "開始前先看什麼")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "先确认你最想拿的是 Lv.30 免费小吱，还是 Lv.21 专武等奖励。", "Decide whether your main target is the free Lv.30 Xiaozhi or earlier milestones like the Lv.21 weapon.", "先確認你最想拿的是 Lv.30 免費小吱，還是 Lv.21 專武等獎勵。")}</li>
              <li>{localizedText(locale, "把每日任务、建筑收益和资源回流速度一起看，不要只盯单次奖励。", "Look at daily tasks, building yield, and resource return speed together instead of staring at one reward checkpoint.", "把每日任務、建築收益和資源回流速度一起看，不要只盯單次獎勵。")}</li>
              <li>{localizedText(locale, "如果你时间有限，优先规划最短拿到关键奖励的升级路径。", "If your time is limited, plan the shortest route to the reward breakpoint that matters most.", "如果你時間有限，優先規劃最短拿到關鍵獎勵的升級路徑。")}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "常见误区", "Common mistakes", "常見誤區")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "只因为奖励强，就忽略了每日投入和资源节奏是否适合自己。", "Chasing the headline reward without checking whether the daily time and resource pace fit you.", "只因為獎勵強，就忽略了每日投入和資源節奏是否適合自己。")}</li>
              <li>{localizedText(locale, "平均升级所有建筑，导致关键收益点来得太慢。", "Leveling every building evenly and delaying the most important profit spikes.", "平均升級所有建築，導致關鍵收益點來得太慢。")}</li>
              <li>{localizedText(locale, "把都市大亨当成孤立系统，不和角色、武器、探索节奏一起规划。", "Treating City Tycoon as isolated instead of syncing it with character, weapon, and exploration goals.", "把都市大亨當成孤立系統，不和角色、武器、探索節奏一起規劃。")}</li>
            </ul>
          </div>
        </section>

        {/* Overview */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "cityTycoon.overviewTitle")}
          </h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>
              {isZh
                ? "都市大亨是异环中的模拟经营系统。玩家可以在海特劳市经营自己的商业帝国，通过升级建筑、管理店铺和完成任务来赚取异环币和丰厚奖励。"
                : "City Tycoon is a simulation management system in Neverness to Everness. Players can build their own business empire in Hethereau, earning Hethereau Coins and generous rewards by upgrading buildings, managing shops, and completing tasks."}
            </p>
            <p>
              {isZh
                ? "最核心的奖励是免费满配的S级角色赤子（小智），在都市大亨等级达到30级时获得，包含满觉醒6+5配置，强度超过所有主C。"
                : "The core reward is the free maxed S-rank character Chiz (Xiaozhi), obtained at City Tycoon level 30 with full awakening 6+5, outperforming all other DPS characters."}
            </p>
          </div>
        </section>

        {/* Key Reward Highlight: Xiaozhi */}
        {xiaozhi && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {t(locale, "cityTycoon.keyReward")}
            </h2>
            <div className="rounded-xl border-2 border-primary-500/30 bg-primary-500/5 p-6">
              <div className="flex items-center gap-4 mb-4">
                <GameImage
                  type="character"
                  id={xiaozhi.id}
                  name={xiaozhi.name}
                  className="w-20 h-20 rounded-xl shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {isZh ? xiaozhi.name : xiaozhi.nameEn}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(xiaozhi.attribute)}`}>
                      {getAttributeLabel(xiaozhi.attribute, locale)}
                    </span>
                    <span className="text-xs font-bold text-yellow-400">S</span>
                    <span className="text-xs text-gray-500">
                      {isZh ? xiaozhi.role : xiaozhi.roleEn}
                    </span>
                  </div>
                  <p className="text-xs text-primary-400 mt-2">
                    {isZh ? "都市大亨 Lv.30 免费6+5满配" : "Free 6+5 at City Tycoon Lv.30"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/${lang}/characters/xiaozhi`}
                  className="text-xs px-3 py-1.5 rounded bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                >
                  {isZh ? "查看角色详情 →" : "View Character Details →"}
                </Link>
                <Link
                  href={`/${lang}/team-builder?team=xiaozhi,jiuyuan,hathor`}
                  className="text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {isZh ? "推荐配队 →" : "Recommended Team →"}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Contemplative Cat weapon */}
        {catWeapon && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {t(locale, "cityTycoon.exclusiveWeapon")}
            </h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div>
                  <h3 className="font-semibold">
                    {isZh ? catWeapon.name : catWeapon.nameEn}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isZh ? catWeapon.effectDescription : catWeapon.effectDescriptionEn}
                  </p>
                  <p className="text-xs text-orange-400 mt-1">
                    {isZh ? `都市大亨 Lv.21 奖励 · ${catWeapon.howToObtainZh}` : `City Tycoon Lv.21 Reward · ${catWeapon.howToObtainEn}`}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Level Rewards — Interactive Tracker */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "cityTycoon.levelRewards")}
          </h2>
          <CityTycoonTracker locale={locale} />
        </section>

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "cityTycoon.tipsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                titleZh: "优先升级核心建筑",
                titleEn: "Prioritize Core Buildings",
                descZh: "先升级收益最高的建筑，如商店和工坊，加速异环币产出。",
                descEn: "Upgrade the highest-yield buildings first, such as shops and workshops, to accelerate Hethereau Coin income.",
              },
              {
                titleZh: "每日任务不要遗漏",
                titleEn: "Don't Miss Daily Tasks",
                descZh: "都市大亨的每日任务是主要经验来源，坚持完成可以快速提升等级。",
                descEn: "Daily tasks are the primary XP source. Completing them consistently speeds up leveling.",
              },
              {
                titleZh: "赤子满配值得投入",
                titleEn: "Maxed Chiz is Worth the Investment",
                descZh: "满配6+5赤子强度超过所有主C，包括限定S角色。都市大亨是最重要的养成系统之一。",
                descEn: "Maxed 6+5 Chiz outperforms all DPS, including limited S-rank characters. City Tycoon is one of the most important progression systems.",
              },
              {
                titleZh: "配合探索伴侣使用",
                titleEn: "Use with Exploration Companion",
                descZh: "探索伴侣可以帮助你追踪地图收集进度，配合都市大亨资源管理更高效。",
                descEn: "The Exploration Companion helps track map collection progress, working together with City Tycoon resource management.",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-4"
              >
                <h3 className="text-sm font-semibold mb-2">
                  {isZh ? tip.titleZh : tip.titleEn}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {isZh ? tip.descZh : tip.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href={`/${lang}/explorer`}
            className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {t(locale, "cityTycoon.linkExplorer")} →
          </Link>
          <Link
            href={`/${lang}/characters/xiaozhi`}
            className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {t(locale, "cityTycoon.linkXiaozhi")} →
          </Link>
          <Link
            href={`/${lang}/tier-list`}
            className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {t(locale, "cityTycoon.linkTierList")} →
          </Link>
        </div>
      </div>
    </>
  );
}
