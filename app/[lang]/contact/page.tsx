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
    ? "聯絡我們 — NTE Guide"
    : isZhLocale(locale)
      ? "联系我们 — NTE Guide"
      : "Contact Us — NTE Guide";
  const description = isTw
    ? "聯絡 NTE Guide 團隊。如有建議、合作或問題，歡迎通過郵箱 aieasygames@gmail.com 聯繫我們。"
    : isZhLocale(locale)
      ? "联系 NTE Guide 团队。如有建议、合作或问题，欢迎通过邮箱 aieasygames@gmail.com 联系我们。"
      : "Contact the NTE Guide team. For suggestions, collaborations, or questions, reach us at aieasygames@gmail.com.";

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
  const isTw = locale === "tw";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? (isTw ? "首頁" : "首页") : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? (isTw ? "聯絡我們" : "联系我们") : "Contact Us" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isTw ? "聯絡我們" : isZhLocale(locale) ? "联系我们" : "Contact Us"}
      </h1>
      <p className="text-gray-400 mb-8 text-sm">
        {isTw
          ? "如有建議、合作洽談或任何問題，歡迎通過以下方式聯繫我們。"
          : isZhLocale(locale)
            ? "如有建议、合作洽谈或任何问题，欢迎通过以下方式联系我们。"
            : "For suggestions, business inquiries, or any questions, feel free to reach out through the following channels."}
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
              {isTw ? "電子郵箱" : isZhLocale(locale) ? "电子邮箱" : "Email"}
            </h2>
            <a
              href="mailto:aieasygames@gmail.com"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              aieasygames@gmail.com
            </a>
            <p className="text-gray-500 text-xs mt-1">
              {isTw
                ? "我們會在 1-3 個工作日內回覆您的來信。"
                : isZhLocale(locale)
                  ? "我们会在 1-3 个工作日内回复您的来信。"
                  : "We typically respond within 1-3 business days."}
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
              {isTw ? "關於我們" : isZhLocale(locale) ? "关于我们" : "About Us"}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isTw
                ? "NTE Guide 是一個為異環（Neverness to Everness）玩家打造的社群驅動攻略網站，提供角色資料、強度排行、養成計算器、抽卡模擬器等實用工具。"
                : isZhLocale(locale)
                  ? "NTE Guide 是一个为异环（Neverness to Everness）玩家打造的社区驱动攻略网站，提供角色资料、强度排行、养成计算器、抽卡模拟器等实用工具。"
                  : "NTE Guide is a community-driven resource for Neverness to Everness players, featuring character databases, tier lists, build calculators, gacha simulators, and more."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick note */}
      <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900/20 px-4 py-3">
        <p className="text-xs text-gray-500">
          {isTw
            ? "如果您發現網站上的資料有誤，或有內容建議，也歡迎通過郵箱反饋給我們。感謝您的支持！"
            : isZhLocale(locale)
              ? "如果您发现网站上的资料有误，或有内容建议，也欢迎通过邮箱反馈给我们。感谢您的支持！"
              : "Found an error on our site or have content suggestions? We'd love to hear from you. Thank you for your support!"}
        </p>
      </div>
    </div>
  );
}
