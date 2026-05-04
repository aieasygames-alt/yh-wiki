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

  const lastUpdated = "2026-04-28";

  const rulesItems = [
    t(locale, "terms.rulesItems.0"),
    t(locale, "terms.rulesItems.1"),
    t(locale, "terms.rulesItems.2"),
    t(locale, "terms.rulesItems.3"),
    t(locale, "terms.rulesItems.4"),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: t(locale, "terms.breadcrumbHome"), href: `/${lang}` },
          { label: t(locale, "terms.breadcrumbLabel") },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {t(locale, "terms.title")}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {t(locale, "terms.lastUpdated", lastUpdated)}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Acceptance */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.acceptanceTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.acceptanceContent")}
          </p>
        </section>

        {/* Description */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.descriptionTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.descriptionContent")}
          </p>
        </section>

        {/* Use Rules */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.rulesTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            {t(locale, "terms.rulesIntro")}
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-1 list-disc list-inside">
            {rulesItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.ipTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.ipContent")}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.disclaimerTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.disclaimerContent")}
          </p>
        </section>

        {/* Third-Party Content */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.thirdPartyTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.thirdPartyContent")}
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.liabilityTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.liabilityContent")}
          </p>
        </section>

        {/* Changes */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.changesTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.changesContent")}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-xl font-bold text-white mb-3">
            {t(locale, "terms.contactTitle")}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(locale, "terms.contactContent")}
          </p>
          <p className="text-primary-400 text-sm mt-2">
            <a href="mailto:contact@nteguide.com">contact@nteguide.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
