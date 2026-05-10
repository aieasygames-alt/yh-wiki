import { Metadata } from "next";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqSection } from "../../../components/FaqSection";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import specsData from "../../../data/system-requirements.json";

type SpecValue = { zh: string; en: string };
type PlatformSpecs = Record<string, SpecValue>;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環配置要求與下載大小 — PC/Android/iOS 最低推薦配置（2026）"
      : "异环配置要求与下载大小 — PC/Android/iOS 最低与推荐配置（2026）")
    : "NTE System Requirements - Can Your PC Run It? (PC, Mobile Specs)";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環(NTE)完整配置要求：PC、Android、iOS 最低和推薦配置，下載大小約90GB(PC)/20GB(手機)，儲存空間需求一覽。"
      : "异环(NTE)完整配置要求与下载大小：PC约90GB、手机约20GB，含PC/Android/iOS最低和推荐配置、存储空间要求。")
    : "NTE system requirements: PC minimum (i5-8400, GTX 1060, 8GB RAM, 90GB SSD), Android & iOS specs. Check if your device can run NTE.";

  return {
    title,
    description,
    alternates: hreflangAlternates("system-requirements", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

function SpecTable({ labels, locale }: { labels: Record<string, string>; locale: Locale }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {t(locale, "systemReqs.spec")}
            </th>
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {t(locale, "systemReqs.minimum")}
            </th>
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {t(locale, "systemReqs.recommended")}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(labels).map(([key, label]) => {
            const dataKey = isZhLocale(locale) ? "zh" as const : "en" as const;
            const minVal = specsData.pc.minimum[key as keyof typeof specsData.pc.minimum] ||
                           (specsData as unknown as Record<string, Record<string, PlatformSpecs>>).android?.minimum?.[key as string] ||
                           (specsData as unknown as Record<string, Record<string, PlatformSpecs>>).ios?.minimum?.[key as string];
            const recVal = specsData.pc.recommended[key as keyof typeof specsData.pc.recommended] ||
                           (specsData as unknown as Record<string, Record<string, PlatformSpecs>>).android?.recommended?.[key as string] ||
                           (specsData as unknown as Record<string, Record<string, PlatformSpecs>>).ios?.recommended?.[key as string];
            return (
              <tr key={key} className="border-b border-gray-800/50">
                <td className="py-3 px-4 text-gray-300 font-medium">{label}</td>
                <td className="py-3 px-4 text-gray-400">{minVal ? minVal[dataKey] : "—"}</td>
                <td className="py-3 px-4 text-gray-400">{recVal ? recVal[dataKey] : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function SystemRequirementsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;

  const pcLabels: Record<string, string> = {
    os: t(locale, "systemReqs.pc.os"),
    cpu: t(locale, "systemReqs.pc.cpu"),
    ram: t(locale, "systemReqs.pc.ram"),
    gpu: t(locale, "systemReqs.pc.gpu"),
    storage: t(locale, "systemReqs.pc.storage"),
  };

  const androidLabels: Record<string, string> = {
    soC: t(locale, "systemReqs.android.cpu"),
    ram: t(locale, "systemReqs.android.ram"),
    os: t(locale, "systemReqs.android.os"),
    storage: t(locale, "systemReqs.android.storage"),
  };

  const iosLabels: Record<string, string> = {
    device: t(locale, "systemReqs.ios.device"),
    os: t(locale, "systemReqs.ios.os"),
    storage: t(locale, "systemReqs.ios.storage"),
  };

  const faqs = specsData.faq.map((f) => ({
    question: f.question,
    questionZh: f.questionZh,
    answer: f.answer,
    answerZh: f.answerZh,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: t(locale, "systemReqs.title") },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {t(locale, "systemReqs.pageTitle")}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {t(locale, "systemReqs.pageDescription")}
      </p>

      {/* PC Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🖥️</span>
          {t(locale, "systemReqs.pcTitle")}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable labels={pcLabels} locale={locale} />
        </div>
      </section>

      {/* Android Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          {t(locale, "systemReqs.androidTitle")}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable labels={androidLabels} locale={locale} />
        </div>
      </section>

      {/* iOS Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🍎</span>
          {t(locale, "systemReqs.iosTitle")}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable labels={iosLabels} locale={locale} />
        </div>
      </section>

      {/* Storage Size */}
      <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
        <h2 className="text-lg font-bold mb-3">
          {t(locale, "systemReqs.storageTitle")}
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            <span className="text-gray-300 font-medium">PC:</span>{" "}
            {t(locale, "systemReqs.pcStorage")}
          </p>
          <p>
            <span className="text-gray-300 font-medium">Android:</span>{" "}
            {t(locale, "systemReqs.mobileStorage")}
          </p>
          <p>
            <span className="text-gray-300 font-medium">iOS:</span>{" "}
            {t(locale, "systemReqs.mobileStorage")}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {t(locale, "systemReqs.storageDisclaimer")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection faqs={faqs} locale={locale} />
    </div>
  );
}
