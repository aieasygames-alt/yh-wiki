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
    ? "聯絡 NTE Guide 團隊。如有建議、合作或問題，歡迎通過郵箱 contact@nteguide.com 聯繫我們。"
    : isZhLocale(locale)
      ? "联系 NTE Guide 团队。如有建议、合作或问题，欢迎通过邮箱 contact@nteguide.com 联系我们。"
      : "Contact the NTE Guide team. For suggestions, collaborations, or questions, reach us at contact@nteguide.com.";

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
    </div>
  );
}
