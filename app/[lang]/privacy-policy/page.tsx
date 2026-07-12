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
    ? "隱私政策 — NTE Guide"
    : isZhLocale(locale)
      ? "隐私政策 — NTE Guide"
      : "Privacy Policy — NTE Guide";
  const description = isTw
    ? "NTE Guide 隱私政策，說明本站如何處理分析、廣告、Cookie 與聯絡資訊，以及您可如何管理個人資料與追蹤偏好。"
    : isZhLocale(locale)
      ? "NTE Guide 隐私政策，说明本站如何处理分析、广告、Cookie 与联系信息，以及你可以如何管理个人资料与追踪偏好。"
      : "NTE Guide privacy policy covering analytics, ads, cookies, contact data, and the ways you can manage your personal data and tracking preferences.";

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

  const lastUpdated = "2026-04-28";

  const autoDataItems = [
    t(locale, "privacyPolicy.autoDataItems.0"),
    t(locale, "privacyPolicy.autoDataItems.1"),
    t(locale, "privacyPolicy.autoDataItems.2"),
    t(locale, "privacyPolicy.autoDataItems.3"),
    t(locale, "privacyPolicy.autoDataItems.4"),
    t(locale, "privacyPolicy.autoDataItems.5"),
  ];

  const analyticsItems = [
    t(locale, "privacyPolicy.analyticsItems.0"),
    t(locale, "privacyPolicy.analyticsItems.1"),
    t(locale, "privacyPolicy.analyticsItems.2"),
    t(locale, "privacyPolicy.analyticsItems.3"),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: t(locale, "privacyPolicy.breadcrumbHome"), href: `/${lang}` },
          { label: t(locale, "privacyPolicy.breadcrumbLabel") },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {t(locale, "privacyPolicy.title")}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {t(locale, "privacyPolicy.lastUpdated", lastUpdated)}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Introduction */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.introTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.introContent")}
          </p>
        </section>

        {/* Information Collection */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.infoCollectionTitle")}
          </h2>
          <h3 className="text-base font-semibold text-gray-300 mb-2">
            {t(locale, "privacyPolicy.autoDataTitle")}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            {t(locale, "privacyPolicy.autoDataIntro")}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mb-4">
            {autoDataItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3 className="text-base font-semibold text-gray-300 mb-2">
            {t(locale, "privacyPolicy.userDataTitle")}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.userDataContent")}
          </p>
        </section>

        {/* Analytics */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.analyticsTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.analyticsContent")}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mt-2">
            {analyticsItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {t(locale, "privacyPolicy.analyticsOptOut")}
          </p>
        </section>

        {/* Advertising */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.advertisingTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.advertisingContent")}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                Google Ads Settings
              </a>
              {" — "}
              {t(locale, "privacyPolicy.adManagePrefs")}
            </li>
            <li>
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                {t(locale, "privacyPolicy.adPersonalization")}
              </a>
              {" — "}
              {t(locale, "privacyPolicy.adOptOut")}
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
              {t(locale, "privacyPolicy.adThirdPartyOptOut")}
            </li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {t(locale, "privacyPolicy.adThirdPartyNote")}
          </p>
        </section>

        {/* Cookies */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.cookieTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.cookieContent")}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside mt-2">
            <li>
              <strong className="text-gray-300">{t(locale, "privacyPolicy.cookieEssential")}</strong>
              {" — "}
              {t(locale, "privacyPolicy.cookieEssentialDesc")}
            </li>
            <li>
              <strong className="text-gray-300">{t(locale, "privacyPolicy.cookieAnalytics")}</strong>
              {" — "}
              {t(locale, "privacyPolicy.cookieAnalyticsDesc")}
            </li>
            <li>
              <strong className="text-gray-300">{t(locale, "privacyPolicy.cookieAdvertising")}</strong>
              {" — "}
              {t(locale, "privacyPolicy.cookieAdvertisingDesc")}
            </li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {t(locale, "privacyPolicy.cookieManage")}
          </p>
        </section>

        {/* Data Protection */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.dataProtectionTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.dataProtectionContent")}
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.childrenTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.childrenContent")}
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.thirdPartyTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.thirdPartyContent")}
          </p>
        </section>

        {/* Changes */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.changesTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.changesContent")}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "privacyPolicy.contactTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "privacyPolicy.contactContent")}
          </p>
          <p className="text-primary-400 text-sm mt-2">
            <a href="mailto:contact@nteguide.com">contact@nteguide.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
