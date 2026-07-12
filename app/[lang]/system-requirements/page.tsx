import { Metadata } from "next";
import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqSection } from "../../../components/FaqSection";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import specsData from "../../../data/system-requirements.json";

type SpecValue = { zh: string; en: string };
type PlatformSpecs = Record<string, SpecValue>;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const faqCount = specsData.faq.length;

  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環電腦配置要求（2026）— PC/i5-8400/GTX1060、手機 Android/iOS 詳細規格"
      : "异环电脑配置要求（2026）— PC/i5-8400/GTX1060、手机 Android/iOS 详细规格")
    : "NTE System Requirements (2026) — PC, Mobile & Download Size";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環(NTE)完整配置要求：PC 最低 i7-10700 + GTX 1660、推薦 i7-12700 + RTX 3060，並整理 Android / iOS 規格、下載大小與 ${faqCount} 個效能常見問題。`
      : `异环(NTE)完整配置要求：PC 最低 i7-10700 + GTX 1660、推荐 i7-12700 + RTX 3060，并整理 Android / iOS 规格、下载大小与 ${faqCount} 个性能常见问题。`)
    : `Neverness to Everness system requirements for PC, Android, and iOS, including minimum and recommended specs, download size, and ${faqCount} performance FAQs.`;

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

      {/* Quick Answer — helps Featured Snippet / CTR */}
      <QuickAnswerCard
        locale={locale}
        items={[
          {
            label: "PC Minimum:",
            value: isZhLocale(locale) ? "Windows 10, i7-10700, GTX 1660 / RX 5600, 60GB SSD" : "Windows 10, Intel i7-10700, GTX 1660 / RX 5600, 60GB SSD",
          },
          {
            label: "PC Recommended:",
            value: isZhLocale(locale) ? "i7-12700, RTX 3060 / RX 6700, 60GB SSD" : "Intel i7-12700, RTX 3060 / RX 6700, 60GB SSD",
          },
          {
            label: "Android:",
            value: isZhLocale(locale) ? "Snapdragon 855 / 天玑 8000，20GB 存储" : "Snapdragon 855 or Dimensity 8000, 20GB storage",
          },
          {
            label: "iOS:",
            value: isZhLocale(locale) ? "iPhone 12 Pro Max，iOS 15+" : "iPhone 12 Pro Max, iOS 15+",
          },
          {
            label: isZhLocale(locale) ? "下载大小:" : "Download Size:",
            value: isZhLocale(locale) ? "约 60GB（额外需 60GB 临时解压空间）" : "~60GB (plus 60GB temp for extraction)",
          },
        ]}
      />

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

      <section className="mb-10 rounded-xl border border-primary-500/30 bg-primary-500/5 p-5">
        <h2 className="text-lg font-bold mb-2">
          {isZhLocale(locale) ? "Steam / PC 当前状态" : "Steam / PC Status Right Now"}
        </h2>
        <p className="text-sm text-gray-400 mb-3 leading-relaxed">
          {isZhLocale(locale)
            ? "截至 2026 年 7 月 11 日，异环 Steam 版已经上线。现在更值得比较的不是“要不要等 Steam”，而是你更适合 Steam、官网独立启动器、Epic，还是云异环 PC。想先确认配置、平台差异和账号入口，可以继续看完整 Steam 指南。"
            : "As of July 11, 2026, NTE is already live on Steam. The practical question is no longer whether to wait for Steam, but whether Steam, the official launcher, Epic, or Cloud PC fits you best. See the full Steam guide for specs, platform differences, and account flow."}
        </p>
        <Link
          href={`/${lang}/steam`}
          className="inline-block text-sm text-primary-300 hover:text-primary-200 font-medium"
        >
          {isZhLocale(locale) ? "→ 查看 Steam / PC 入口指南" : "→ Steam / PC entry guide"}
        </Link>
      </section>

      {/* FAQ */}
      <FaqSection faqs={faqs} locale={locale} />
    </div>
  );
}
