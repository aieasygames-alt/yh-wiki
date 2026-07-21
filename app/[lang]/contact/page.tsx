import { Metadata } from "next";
import { isZhLocale, Locale, hreflangAlternates, t, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const isTw = locale === "tw";

  const title = isTw
    ? "聯絡我們 — NTE Guide"
    : isZhLocale(locale)
      ? "联系我们 — NTE Guide"
      : "Contact Us — NTE Guide";
  const description = isTw
    ? "聯絡 NTE Guide 團隊：提交內容更正、合作需求、工具回饋或網站問題，並透過 contact@nteguide.com 取得回覆。"
    : isZhLocale(locale)
      ? "联系 NTE Guide 团队：提交内容更正、合作需求、工具反馈或网站问题，并通过 contact@nteguide.com 获取回复。"
      : "Contact the NTE Guide team for content corrections, partnership requests, tool feedback, or site issues through contact@nteguide.com.";

  return {
    title,
    description,
    alternates: hreflangAlternates("contact", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: t(locale, "contact.breadcrumbHome"), href: `/${lang}` },
          { label: t(locale, "contact.breadcrumbLabel") },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {t(locale, "contact.title")}
      </h1>
      <p className="text-gray-400 mb-8 text-sm">
        {t(locale, "contact.subtitle")}
      </p>

      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 space-y-6">
        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-1">
              {t(locale, "contact.emailLabel")}
            </h2>
            <a
              href="mailto:contact@nteguide.com"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              contact@nteguide.com
            </a>
            <p className="text-gray-500 text-xs mt-1">
              {t(locale, "contact.emailResponseTime")}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800" />

        {/* About */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-1">
              {t(locale, "contact.aboutLabel")}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t(locale, "contact.aboutContent")}
            </p>
          </div>
        </div>
      </div>

      {/* Quick note */}
      <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900/20 px-4 py-3">
        <p className="text-xs text-gray-500">
          {t(locale, "contact.feedbackNote")}
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">
            {isZhLocale(locale) ? (locale === "tw" ? "什麼情況適合聯絡" : "什么情况适合联系") : "When to contact us"}
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-gray-300">
            <li>
              {isZhLocale(locale)
                ? (locale === "tw" ? "角色、素材、載具、任務或地圖資料和正式服不一致。" : "角色、素材、载具、任务或地图数据和正式服不一致。")
                : "Character, material, vehicle, quest, or map data differs from the live game."}
            </li>
            <li>
              {isZhLocale(locale)
                ? (locale === "tw" ? "工具計算結果、搜尋、語言切換或頁面連結出現問題。" : "工具计算结果、搜索、语言切换或页面链接出现问题。")
                : "A calculator result, search behavior, language switch, or page link is not working correctly."}
            </li>
            <li>
              {isZhLocale(locale)
                ? (locale === "tw" ? "你希望補充攻略、FAQ、版本更新或合作內容。" : "你希望补充攻略、FAQ、版本更新或合作内容。")
                : "You want to suggest guides, FAQs, version updates, or partnership content."}
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-lg font-semibold text-white mb-3">
            {isZhLocale(locale) ? (locale === "tw" ? "提供哪些資訊更快處理" : "提供哪些信息更快处理") : "What helps us respond faster"}
          </h2>
          <p className="text-sm leading-6 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "請盡量附上頁面 URL、問題截圖、你看到的正式服資料，以及希望修正的具體欄位。若是工具問題，請補充語言版本、瀏覽器和重現步驟。"
                  : "请尽量附上页面 URL、问题截图、你看到的正式服数据，以及希望修正的具体字段。如果是工具问题，请补充语言版本、浏览器和复现步骤。")
              : "Please include the page URL, screenshots, live-game data you are comparing against, and the exact field that should be corrected. For tool issues, include language, browser, and reproduction steps."}
          </p>
        </div>
      </section>
    </div>
  );
}
