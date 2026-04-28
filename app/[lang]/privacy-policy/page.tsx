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
    ? "隱私政策 — NTE Guide"
    : isZhLocale(locale)
      ? "隐私政策 — NTE Guide"
      : "Privacy Policy — NTE Guide";
  const description = isTw
    ? "NTE Guide 隱私政策 — 了解我們如何收集、使用和保護您的個人資料。"
    : isZhLocale(locale)
      ? "NTE Guide 隐私政策 — 了解我们如何收集、使用和保护您的个人资料。"
      : "NTE Guide Privacy Policy — Learn how we collect, use, and protect your personal data.";

  return {
    title,
    description,
    alternates: hreflangAlternates("privacy-policy", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isTw = locale === "tw";

  const lastUpdated = "2026-04-28";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? (isTw ? "首頁" : "首页") : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? (isTw ? "隱私政策" : "隐私政策") : "Privacy Policy" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isTw ? "隱私政策" : isZhLocale(locale) ? "隐私政策" : "Privacy Policy"}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {isTw ? `最後更新：${lastUpdated}` : isZhLocale(locale) ? `最后更新：${lastUpdated}` : `Last updated: ${lastUpdated}`}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Introduction */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "簡介" : isZhLocale(locale) ? "简介" : "Introduction"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "歡迎使用 NTE Guide（以下簡稱「本站」或「我們」）。本隱私政策說明我們在您訪問和使用本站時，如何收集、使用、儲存和保護您的個人資訊。使用本站即表示您同意本政策中描述的做法。"
              : isZhLocale(locale)
                ? "欢迎使用 NTE Guide（以下简称「本站」或「我们」）。本隐私政策说明我们在您访问和使用本站时，如何收集、使用、存储和保护您的个人信息。使用本站即表示您同意本政策中描述的做法。"
                : "Welcome to NTE Guide (\"we\", \"us\", or \"our\"). This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit and use our website. By using our website, you agree to the practices described in this policy."}
          </p>
        </section>

        {/* Information Collection */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "資訊收集" : isZhLocale(locale) ? "信息收集" : "Information We Collect"}
          </h2>
          <h3 className="text-base font-semibold text-gray-300 mb-2">
            {isTw ? "自動收集的資料" : isZhLocale(locale) ? "自动收集的数据" : "Automatically Collected Data"}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            {isTw
              ? "當您訪問本站時，我們可能會自動收集以下資訊："
              : isZhLocale(locale)
                ? "当您访问本站时，我们可能会自动收集以下信息："
                : "When you visit our website, we may automatically collect the following information:"}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mb-4">
            <li>
              {isTw ? "瀏覽器類型和版本" : isZhLocale(locale) ? "浏览器类型和版本" : "Browser type and version"}
            </li>
            <li>
              {isTw ? "作業系統" : isZhLocale(locale) ? "操作系统" : "Operating system"}
            </li>
            <li>
              {isTw ? "推薦來源（您如何找到本站的）" : isZhLocale(locale) ? "推荐来源（您如何找到本站的）" : "Referring URL (how you found our site)"}
            </li>
            <li>
              {isTw ? "訪問的頁面和停留時間" : isZhLocale(locale) ? "访问的页面和停留时间" : "Pages visited and time spent"}
            </li>
            <li>
              {isTw ? "IP 位址（用於大致的地理位置）" : isZhLocale(locale) ? "IP 地址（用于大致的地理位置）" : "IP address (for approximate geographic location)"}
            </li>
            <li>
              {isTw ? "裝置類型（手機、平板、電腦）" : isZhLocale(locale) ? "设备类型（手机、平板、电脑）" : "Device type (mobile, tablet, desktop)"}
            </li>
          </ul>

          <h3 className="text-base font-semibold text-gray-300 mb-2">
            {isTw ? "使用者提供的資料" : isZhLocale(locale) ? "用户提供的数据" : "User-Provided Data"}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "如果您通過電子郵件聯繫我們，我們會收集您提供的姓名和電子郵件地址，僅用於回覆您的詢問。"
              : isZhLocale(locale)
                ? "如果您通过电子邮件联系我们，我们会收集您提供的姓名和电子邮件地址，仅用于回复您的询问。"
                : "If you contact us via email, we collect the name and email address you provide, solely for the purpose of responding to your inquiry."}
          </p>
        </section>

        {/* Analytics */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "分析工具" : isZhLocale(locale) ? "分析工具" : "Analytics"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "我們使用 Google Analytics（GA4）來分析網站流量和使用者行為。Google Analytics 使用 Cookie 來收集匿名的使用資料。收集的資料包括："
              : isZhLocale(locale)
                ? "我们使用 Google Analytics（GA4）来分析网站流量和用户行为。Google Analytics 使用 Cookie 来收集匿名的使用数据。收集的数据包括："
                : "We use Google Analytics (GA4) to analyze website traffic and user behavior. Google Analytics uses cookies to collect anonymized usage data. Data collected includes:"}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li>{isTw ? "頁面瀏覽量和瀏覽量" : isZhLocale(locale) ? "页面浏览量和浏览量" : "Page views and sessions"}</li>
            <li>{isTw ? "使用者地理位置（國家/城市層級）" : isZhLocale(locale) ? "用户地理位置（国家/城市级别）" : "User geographic location (country/city level)"}</li>
            <li>{isTw ? "流量來源" : isZhLocale(locale) ? "流量来源" : "Traffic sources"}</li>
            <li>{isTw ? "站內搜尋關鍵詞" : isZhLocale(locale) ? "站内搜索关键词" : "On-site search terms"}</li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {isTw
              ? "您可以通過安裝 Google Analytics 停用瀏覽器外掛來停用 Google Analytics 追蹤。"
              : isZhLocale(locale)
                ? "您可以通过安装 Google Analytics 停用浏览器插件来停用 Google Analytics 跟踪。"
                : "You can opt out of Google Analytics tracking by installing the Google Analytics opt-out browser add-on."}
          </p>
        </section>

        {/* Advertising */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "廣告" : isZhLocale(locale) ? "广告" : "Advertising"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "我們使用 Google AdSense 在本站展示廣告。Google AdSense 可能會使用 Cookie 和類似技術來展示基於您先前訪問本站或其他網站的個人化廣告。您可以通過以下方式控制廣告個人化設定："
              : isZhLocale(locale)
                ? "我们使用 Google AdSense 在本站展示广告。Google AdSense 可能会使用 Cookie 和类似技术来展示基于您先前访问本站或其他网站的个性化广告。您可以通过以下方式控制广告个性化设置："
                : "We use Google AdSense to display advertisements on our website. Google AdSense may use cookies and similar technologies to display personalized ads based on your prior visits to our site or other websites. You can control ad personalization through:"}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                Google Ads Settings
              </a>
              {" — "}
              {isTw ? "管理您的廣告偏好" : isZhLocale(locale) ? "管理您的广告偏好" : "Manage your ad preferences"}
            </li>
            <li>
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                {isTw ? "廣告個人化設定" : isZhLocale(locale) ? "广告个性化设置" : "Ad Personalization Settings"}
              </a>
              {" — "}
              {isTw ? "停用個人化廣告" : isZhLocale(locale) ? "停用个性化广告" : "Opt out of personalized ads"}
            </li>
            <li>
              <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                NAI Opt-Out
              </a>
              {" / "}
              <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                EDAA Opt-Out
              </a>
              {" — "}
              {isTw ? "第三方廣告退出" : isZhLocale(locale) ? "第三方广告退出" : "Third-party ad opt-out"}
            </li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {isTw
              ? "第三方廣告商可能會使用 Cookie 來追蹤您的瀏覽活動，以便在您訪問其他網站時展示相關廣告。這些第三方包括 Google 及其合作夥伴。"
              : isZhLocale(locale)
                ? "第三方广告商可能会使用 Cookie 来跟踪您的浏览活动，以便在您访问其他网站时展示相关广告。这些第三方包括 Google 及其合作伙伴。"
                : "Third-party advertisers may use cookies to track your browsing activity to display relevant ads when you visit other websites. These third parties include Google and its partners."}
          </p>
        </section>

        {/* Cookies */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "Cookie 政策" : isZhLocale(locale) ? "Cookie 政策" : "Cookie Policy"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "本站使用 Cookie 和類似技術來改善您的瀏覽體驗。Cookie 是存儲在您裝置上的小型文字檔案。我們使用的 Cookie 類型包括："
              : isZhLocale(locale)
                ? "本站使用 Cookie 和类似技术来改善您的浏览体验。Cookie 是存储在您设备上的小型文本文件。我们使用的 Cookie 类型包括："
                : "Our website uses cookies and similar technologies to improve your browsing experience. Cookies are small text files stored on your device. Types of cookies we use include:"}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li>
              <strong className="text-gray-300">{isTw ? "必要 Cookie" : isZhLocale(locale) ? "必要 Cookie" : "Essential Cookies"}</strong>
              {" — "}
              {isTw ? "網站正常運作所需" : isZhLocale(locale) ? "网站正常运作所需" : "Required for the website to function properly"}
            </li>
            <li>
              <strong className="text-gray-300">{isTw ? "分析 Cookie" : isZhLocale(locale) ? "分析 Cookie" : "Analytics Cookies"}</strong>
              {" — "}
              {isTw ? "用於了解訪客如何使用本站（Google Analytics）" : isZhLocale(locale) ? "用于了解访客如何使用本站（Google Analytics）" : "Used to understand how visitors use our site (Google Analytics)"}
            </li>
            <li>
              <strong className="text-gray-300">{isTw ? "廣告 Cookie" : isZhLocale(locale) ? "广告 Cookie" : "Advertising Cookies"}</strong>
              {" — "}
              {isTw ? "用於展示相關廣告（Google AdSense）" : isZhLocale(locale) ? "用于展示相关广告（Google AdSense）" : "Used to display relevant advertisements (Google AdSense)"}
            </li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {isTw
              ? "您可以通過瀏覽器設定來管理或刪除 Cookie。請注意，停用 Cookie 可能會影響網站的某些功能。"
              : isZhLocale(locale)
                ? "您可以通过浏览器设置来管理或删除 Cookie。请注意，停用 Cookie 可能会影响网站的某些功能。"
                : "You can manage or delete cookies through your browser settings. Please note that disabling cookies may affect certain features of the website."}
          </p>
        </section>

        {/* Data Protection */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "資料保護" : isZhLocale(locale) ? "数据保护" : "Data Protection"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "我們採取合理的技術和組織措施來保護您的個人資料免受未經授權的訪問、更改、披露或毀損。然而，請注意，網際網路上的資料傳輸永遠無法保證 100% 的安全性。"
              : isZhLocale(locale)
                ? "我们采取合理的技术和组织措施来保护您的个人数据免受未经授权的访问、更改、披露或毁损。然而，请注意，互联网上的数据传输永远无法保证 100% 的安全性。"
                : "We take reasonable technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, please note that data transmission over the internet can never be guaranteed to be 100% secure."}
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "兒童隱私" : isZhLocale(locale) ? "儿童隐私" : "Children's Privacy"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "本站不針對 13 歲以下的兒童。我們不會故意收集 13 歲以下兒童的個人資訊。如果我們發現我們收集了 13 歲以下兒童的資料，我們將立即採取措施刪除這些資訊。"
              : isZhLocale(locale)
                ? "本站不针对 13 岁以下的儿童。我们不会故意收集 13 岁以下儿童的个人资讯。如果我们发现我们收集了 13 岁以下儿童的数据，我们将立即采取措施删除这些信息。"
                : "Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected data from a child under 13, we will take steps to delete such information immediately."}
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "第三方連結" : isZhLocale(locale) ? "第三方链接" : "Third-Party Links"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "本站可能包含指向第三方網站（如 Discord、Reddit、YouTube 等）的連結。我們對這些第三方網站的隱私慣例不承擔任何責任。建議您閱讀您訪問的任何第三方網站的隱私政策。"
              : isZhLocale(locale)
                ? "本站可能包含指向第三方网站（如 Discord、Reddit、YouTube 等）的链接。我们对这些第三方网站的隐私惯例不承担任何责任。建议您阅读您访问的任何第三方网站的隐私政策。"
                : "Our website may contain links to third-party websites (such as Discord, Reddit, YouTube, etc.). We are not responsible for the privacy practices of these third-party websites. We recommend reading the privacy policy of any third-party website you visit."}
          </p>
        </section>

        {/* Changes */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "政策變更" : isZhLocale(locale) ? "政策变更" : "Policy Changes"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "我們可能會不定期更新本隱私政策。任何變更將在此頁面上發布，並更新「最後更新」日期。繼續使用本站即表示您同意修訂後的政策。"
              : isZhLocale(locale)
                ? "我们可能会不定期更新本隐私政策。任何变更将在此页面上发布，并更新「最后更新」日期。继续使用本站即表示您同意修订后的政策。"
                : "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated \"Last updated\" date. Your continued use of our website after changes constitutes acceptance of the revised policy."}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {isTw ? "聯絡我們" : isZhLocale(locale) ? "联系我们" : "Contact Us"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isTw
              ? "如果您對本隱私政策有任何問題，請通過以下方式聯繫我們："
              : isZhLocale(locale)
                ? "如果您对本隐私政策有任何问题，请通过以下方式联系我们："
                : "If you have any questions about this Privacy Policy, please contact us at:"}
          </p>
          <p className="text-primary-400 text-sm mt-2">
            <a href="mailto:aieasygames@gmail.com">aieasygames@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
