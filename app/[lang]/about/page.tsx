import { Metadata } from "next";
import { isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";

const langs = ["zh", "tw", "en"] as const;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const isTw = locale === "tw";

  const title = isTw
    ? "關於我們 — NTE Guide"
    : isZhLocale(locale)
      ? "关于我们 — NTE Guide"
      : "About Us — NTE Guide";
  const description = isTw
    ? "關於 NTE Guide — 異環玩家社群工具站，提供角色資料、強度排行、養成計算器等實用工具。"
    : isZhLocale(locale)
      ? "关于 NTE Guide — 异环玩家社群工具站，提供角色资料、强度排行、养成计算器等实用工具。"
      : "About NTE Guide — A community-driven resource for Neverness to Everness players.";

  return {
    title,
    description,
    alternates: hreflangAlternates("about", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isTw = locale === "tw";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? (isTw ? "首頁" : "首页") : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? (isTw ? "關於我們" : "关于我们") : "About Us" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isTw ? "關於我們" : isZhLocale(locale) ? "关于我们" : "About Us"}
      </h1>
      <p className="text-gray-400 mb-8 text-sm">
        {isTw
          ? "了解 NTE Guide 的使命與團隊。"
          : isZhLocale(locale)
            ? "了解 NTE Guide 的使命与团队。"
            : "Learn about NTE Guide's mission and team."}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Who We Are */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "我們是誰" : isZhLocale(locale) ? "我们是谁" : "Who We Are"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "NTE Guide 是一個由異環（Neverness to Everness）玩家社群驅動的攻略與工具網站。我們的目標是為全球異環玩家提供最全面、最準確的遊戲資料和實用工具，幫助每一位玩家更好地享受遊戲。"
              : isZhLocale(locale)
                ? "NTE Guide 是一个由异环（Neverness to Everness）玩家社群驱动的攻略与工具网站。我们的目标是为全球异环玩家提供最全面、最准确的游戏资料和实用工具，帮助每一位玩家更好地享受游戏。"
                : "NTE Guide is a community-driven resource and tools website for Neverness to Everness players. Our goal is to provide the most comprehensive and accurate game data and practical tools for NTE players worldwide, helping every player enjoy the game to the fullest."}
          </p>
        </section>

        {/* What We Offer */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "我們提供的內容" : isZhLocale(locale) ? "我们提供的内容" : "What We Offer"}
          </h2>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-2">
            <li>
              <strong className="text-gray-300">
                {isTw ? "角色資料庫" : isZhLocale(locale) ? "角色资料库" : "Character Database"}
              </strong>
              {" — "}
              {isTw ? "完整的角色資料，包含技能、屬性、推薦配裝和隊伍搭配" : isZhLocale(locale) ? "完整的角色资料，包含技能、属性、推荐配装和队伍搭配" : "Complete character data including skills, attributes, recommended builds, and team compositions"}
            </li>
            <li>
              <strong className="text-gray-300">
                {isTw ? "實用工具" : isZhLocale(locale) ? "实用工具" : "Practical Tools"}
              </strong>
              {" — "}
              {isTw ? "升級計算器、Build 計算器、抽卡模擬器和交互地圖" : isZhLocale(locale) ? "升级计算器、Build 计算器、抽卡模拟器和交互地图" : "Leveling calculator, build calculator, gacha simulator, and interactive map"}
            </li>
            <li>
              <strong className="text-gray-300">
                {isTw ? "強度排行" : isZhLocale(locale) ? "强度排行" : "Tier Lists"}
              </strong>
              {" — "}
              {isTw ? "基於社群反饋的角色強度評估" : isZhLocale(locale) ? "基于社群反馈的角色强度评估" : "Community-driven character rankings and ratings"}
            </li>
            <li>
              <strong className="text-gray-300">
                {isTw ? "攻略指南" : isZhLocale(locale) ? "攻略指南" : "Guides & Tips"}
              </strong>
              {" — "}
              {isTw ? "新手攻略、進階技巧和版本更新解析" : isZhLocale(locale) ? "新手攻略、进阶技巧和版本更新解析" : "Beginner guides, advanced tips, and version update analysis"}
            </li>
            <li>
              <strong className="text-gray-300">
                {isTw ? "兌換碼" : isZhLocale(locale) ? "兑换码" : "Redeem Codes"}
              </strong>
              {" — "}
              {isTw ? "即時更新的最新可用兌換碼" : isZhLocale(locale) ? "即时更新的最新可用兑换码" : "Up-to-date active redeem codes"}
            </li>
          </ul>
        </section>

        {/* Community */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "社群參與" : isZhLocale(locale) ? "社群参与" : "Community"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "我們在 Discord 和 Reddit 上活躍經營社群。如果您有任何建議、發現資料錯誤，或想參與貢獻，歡迎加入我們的社群或通過郵箱聯繫我們。"
              : isZhLocale(locale)
                ? "我们在 Discord 和 Reddit 上活跃经营社群。如果您有任何建议、发现资料错误，或想参与贡献，欢迎加入我们的社群或通过邮箱联系我们。"
                : "We actively maintain communities on Discord and Reddit. If you have suggestions, find data errors, or want to contribute, feel free to join our communities or contact us via email."}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "免責聲明" : isZhLocale(locale) ? "免责声明" : "Disclaimer"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "NTE Guide 是一個非官方的社群粉絲網站，與 Perfect World、Hotta Studio 或異環官方團隊沒有任何附屬關係。網站上所有遊戲相關內容和素材的版權歸其各自原作者所有。"
              : isZhLocale(locale)
                ? "NTE Guide 是一个非官方的社群粉丝网站，与 Perfect World、Hotta Studio 或异环官方团队没有任何附属关系。网站上所有游戏相关内容和素材的版权归其各自原作者所有。"
                : "NTE Guide is an unofficial community fan site and is not affiliated with, endorsed by, or connected to Perfect World, Hotta Studio, or the official Neverness to Everness team. All game-related content and materials on this site are copyrighted by their respective owners."}
          </p>
        </section>
      </div>
    </div>
  );
}
