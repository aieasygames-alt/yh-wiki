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
    ? "服務條款 — NTE Guide"
    : isZhLocale(locale)
      ? "服务条款 — NTE Guide"
      : "Terms of Service — NTE Guide";
  const description = isTw
    ? "NTE Guide 服務條款 — 使用本網站前請閱讀以下條款和條件。"
    : isZhLocale(locale)
      ? "NTE Guide 服务条款 — 使用本网站前请阅读以下条款和条件。"
      : "NTE Guide Terms of Service — Please read the following terms and conditions before using our website.";

  return {
    title,
    description,
    alternates: hreflangAlternates("terms", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function TermsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isTw = locale === "tw";

  const lastUpdated = "2026-04-28";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? (isTw ? "首頁" : "首页") : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? (isTw ? "服務條款" : "服务条款") : "Terms of Service" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isTw ? "服務條款" : isZhLocale(locale) ? "服务条款" : "Terms of Service"}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {isTw ? `最後更新：${lastUpdated}` : isZhLocale(locale) ? `最后更新：${lastUpdated}` : `Last updated: ${lastUpdated}`}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Acceptance */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "接受條款" : isZhLocale(locale) ? "接受条款" : "Acceptance of Terms"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "通過訪問和使用 NTE Guide（以下簡稱「本站」），您同意受這些服務條款約束。如果您不同意這些條款，請不要使用本站。我們保留隨時修改這些條款的權利，繼續使用本站即表示您接受修訂後的條款。"
              : isZhLocale(locale)
                ? "通过访问和使用 NTE Guide（以下简称「本站」），您同意受这些服务条款约束。如果您不同意这些条款，请不要使用本站。我们保留随时修改这些条款的权利，继续使用本站即表示您接受修订后的条款。"
                : "By accessing and using NTE Guide (the \"Website\"), you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our Website. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of the revised terms."}
          </p>
        </section>

        {/* Description */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "服務說明" : isZhLocale(locale) ? "服务说明" : "Service Description"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "NTE Guide 是一個為異環（Neverness to Everness）玩家提供的非官方社群資源網站。本站提供遊戲資料查詢、養成計算器、抽卡模擬器、攻略指南和其他相關工具。本站與 Perfect World、Hotta Studio 或異環官方團隊沒有任何附屬關係。"
              : isZhLocale(locale)
                ? "NTE Guide 是一个为异环（Neverness to Everness）玩家提供的非官方社群资源网站。本站提供游戏数据查询、养成计算器、抽卡模拟器、攻略指南和其他相关工具。本站与 Perfect World、Hotta Studio 或异环官方团队没有任何附属关系。"
                : "NTE Guide is an unofficial community resource website for Neverness to Everness players. We provide game data lookup, build calculators, gacha simulators, guides, and other related tools. This website is not affiliated with Perfect World, Hotta Studio, or the official Neverness to Everness team."}
          </p>
        </section>

        {/* Use Rules */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "使用規則" : isZhLocale(locale) ? "使用规则" : "Rules of Use"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            {isTw ? "使用本站時，您同意不會：" : isZhLocale(locale) ? "使用本站时，您同意不会：" : "When using our Website, you agree not to:"}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside">
            <li>
              {isTw ? "以任何自動化方式（如爬蟲、機器人）抓取本站內容" : isZhLocale(locale) ? "以任何自动化方式（如爬虫、机器人）抓取本站内容" : "Scrape or crawl our website content using automated means (bots, scrapers)"}
            </li>
            <li>
              {isTw ? "試圖未經授權訪問本站的系統或資料" : isZhLocale(locale) ? "试图未经授权访问本站的系统或数据" : "Attempt to gain unauthorized access to our systems or data"}
            </li>
            <li>
              {isTw ? "干擾本站的正常運作或伺服器" : isZhLocale(locale) ? "干扰本站的正常运作或服务器" : "Interfere with the proper functioning of our website or servers"}
            </li>
            <li>
              {isTw ? "將本站內容用於商業目的而未獲授權" : isZhLocale(locale) ? "将本站内容用于商业目的而未获授权" : "Use our content for commercial purposes without authorization"}
            </li>
            <li>
              {isTw ? "傳播惡意軟體或有害程式碼" : isZhLocale(locale) ? "传播恶意软件或有害代码" : "Distribute malware or harmful code"}
            </li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "智慧財產權" : isZhLocale(locale) ? "知识产权" : "Intellectual Property"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "本站原創內容（包括但不限於文字、程式碼、設計和排版）受版權法保護。異環遊戲相關的所有素材（包括但不限於角色名稱、圖像、標誌和遊戲資料）均為 Perfect World / Hotta Studio 所有。本站合理使用這些素材僅為提供資訊目的，不主張對其擁有權利。"
              : isZhLocale(locale)
                ? "本站原创内容（包括但不限于文字、代码、设计和排版）受版权法保护。异环游戏相关的所有素材（包括但不限于角色名称、图像、标志和游戏数据）均为 Perfect World / Hotta Studio 所有。本站合理使用这些素材仅为提供信息目的，不主张对其拥有权利。"
                : "Original content on this website (including but not limited to text, code, design, and layout) is protected by copyright law. All game-related materials for Neverness to Everness (including but not limited to character names, images, logos, and game data) are owned by Perfect World / Hotta Studio. We use these materials on a fair-use basis for informational purposes only and do not claim ownership of them."}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "免責聲明" : isZhLocale(locale) ? "免责声明" : "Disclaimer"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "本站提供的所有資訊僅供參考，我們不保證其準確性、完整性或及時性。遊戲資料可能會因版本更新而變化，建議以遊戲內實際資料為準。對於因使用或無法使用本站而導致的任何損失，我們不承擔任何責任。"
              : isZhLocale(locale)
                ? "本站提供的所有信息仅供参考，我们不保证其准确性、完整性或及时性。游戏数据可能会因版本更新而变化，建议以游戏内实际数据为准。对于因使用或无法使用本站而导致的任何损失，我们不承担任何责任。"
                : "All information provided on this website is for reference only. We do not guarantee its accuracy, completeness, or timeliness. Game data may change due to version updates, and we recommend verifying with in-game data. We are not liable for any losses resulting from the use of or inability to use our website."}
          </p>
        </section>

        {/* Third-Party Content */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "第三方內容" : isZhLocale(locale) ? "第三方内容" : "Third-Party Content"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "本站可能包含指向第三方網站的連結或嵌入第三方內容。我們對這些第三方網站的內容、隱私慣例或可用性不承擔任何責任。包含這些連結不代表我們對其認可或推薦。"
              : isZhLocale(locale)
                ? "本站可能包含指向第三方网站的链接或嵌入第三方内容。我们对这些第三方网站的内容、隐私惯例或可用性不承担任何责任。包含这些链接不代表我们对其认可或推荐。"
                : "Our website may contain links to third-party websites or embed third-party content. We are not responsible for the content, privacy practices, or availability of these third-party websites. The inclusion of such links does not imply endorsement or recommendation."}
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "責任限制" : isZhLocale(locale) ? "责任限制" : "Limitation of Liability"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "在法律允許的最大範圍內，NTE Guide 及其營運者不對因使用本站而產生的任何直接、間接、附帶、特殊或後果性損害承擔責任。"
              : isZhLocale(locale)
                ? "在法律允许的最大范围内，NTE Guide 及其运营者不对因使用本站而产生的任何直接、间接、附带、特殊或后果性损害承担责任。"
                : "To the maximum extent permitted by law, NTE Guide and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our website."}
          </p>
        </section>

        {/* Changes */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "條款變更" : isZhLocale(locale) ? "条款变更" : "Changes to Terms"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "我們保留隨時更新這些服務條款的權利。變更將在此頁面上發布，並更新「最後更新」日期。建議您定期查閱這些條款。"
              : isZhLocale(locale)
                ? "我们保留随时更新这些服务条款的权利。变更将在此页面上发布，并更新「最后更新」日期。建议您定期查阅这些条款。"
                : "We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated \"Last updated\" date. We recommend reviewing these terms periodically."}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "聯絡我們" : isZhLocale(locale) ? "联系我们" : "Contact Us"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "如果您對這些服務條款有任何問題，請聯繫我們："
              : isZhLocale(locale)
                ? "如果您对这些服务条款有任何问题，请联系我们："
                : "If you have any questions about these Terms of Service, please contact us at:"}
          </p>
          <p className="text-primary-400 text-sm mt-2">
            <a href="mailto:contact@nteguide.com">contact@nteguide.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
