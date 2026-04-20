import { Metadata } from "next";
import { t, hreflangAlternates, type Locale } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqSection } from "../../../components/FaqSection";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import specsData from "../../../data/system-requirements.json";
import { getAllFaqs } from "../../../lib/queries";

type SpecValue = { zh: string; en: string };
type PlatformSpecs = Record<string, SpecValue>;

const langs = ["zh", "en"] as const;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  return {
    title: locale === "zh"
      ? "异环配置要求 — PC/Android/iOS 最低与推荐配置"
      : "NTE System Requirements — PC, Android & iOS Specs",
    description: locale === "zh"
      ? "异环(Neverness to Everness)完整配置要求：PC、Android、iOS 最低和推荐配置，存储空间大小，支持平台一览。"
      : "Complete Neverness to Everness system requirements for PC, Android, and iOS. Check minimum and recommended specs, storage size, and supported platforms.",
    alternates: hreflangAlternates("system-requirements", lang),
  };
}

function SpecTable({ specs, labels, locale }: { specs: PlatformSpecs; labels: Record<string, { zh: string; en: string }>; locale: Locale }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {locale === "zh" ? "配置项" : "Spec"}
            </th>
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {locale === "zh" ? "最低配置" : "Minimum"}
            </th>
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {locale === "zh" ? "推荐配置" : "Recommended"}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(labels).map(([key, label]) => {
            const minVal = specsData.pc.minimum[key as keyof typeof specsData.pc.minimum] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).android?.minimum?.[key as string] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).ios?.minimum?.[key as string];
            const recVal = specsData.pc.recommended[key as keyof typeof specsData.pc.recommended] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).android?.recommended?.[key as string] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).ios?.recommended?.[key as string];
            return (
              <tr key={key} className="border-b border-gray-800/50">
                <td className="py-3 px-4 text-gray-300 font-medium">{label[locale]}</td>
                <td className="py-3 px-4 text-gray-400">{minVal ? minVal[locale] : "—"}</td>
                <td className="py-3 px-4 text-gray-400">{recVal ? recVal[locale] : "—"}</td>
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

  const pcLabels: Record<string, { zh: string; en: string }> = {
    os: { zh: "操作系统", en: "OS" },
    cpu: { zh: "处理器", en: "CPU" },
    ram: { zh: "内存", en: "RAM" },
    gpu: { zh: "显卡", en: "GPU" },
    storage: { zh: "存储空间", en: "Storage" },
  };

  const androidLabels: Record<string, { zh: string; en: string }> = {
    soC: { zh: "处理器", en: "SoC" },
    ram: { zh: "内存", en: "RAM" },
    os: { zh: "系统版本", en: "OS" },
    storage: { zh: "存储空间", en: "Storage" },
  };

  const iosLabels: Record<string, { zh: string; en: string }> = {
    device: { zh: "设备", en: "Device" },
    os: { zh: "系统版本", en: "OS" },
    storage: { zh: "存储空间", en: "Storage" },
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
          { label: locale === "zh" ? "首页" : "Home", href: `/${lang}` },
          { label: locale === "zh" ? "配置要求" : "System Requirements" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {locale === "zh" ? "异环配置要求" : "NTE System Requirements"}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {locale === "zh"
          ? "异环(Neverness to Everness)全平台配置要求一览，包含 PC、Android、iOS 最低与推荐配置。"
          : "Complete system requirements for Neverness to Everness on PC, Android, and iOS — minimum and recommended specs."}
      </p>

      {/* PC Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🖥️</span>
          {locale === "zh" ? "PC 配置要求" : "PC Requirements"}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable specs={specsData.pc.minimum} labels={pcLabels} locale={locale} />
        </div>
      </section>

      {/* Android Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          {locale === "zh" ? "Android 配置要求" : "Android Requirements"}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable specs={specsData.android.minimum} labels={androidLabels} locale={locale} />
        </div>
      </section>

      {/* iOS Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🍎</span>
          {locale === "zh" ? "iOS 配置要求" : "iOS Requirements"}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable specs={specsData.ios.minimum} labels={iosLabels} locale={locale} />
        </div>
      </section>

      {/* Storage Size */}
      <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
        <h2 className="text-lg font-bold mb-3">
          {locale === "zh" ? "存储空间说明" : "Storage Size"}
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            <span className="text-gray-300 font-medium">PC:</span>{" "}
            {locale === "zh" ? "约 40 GB（推荐 SSD）" : "~40 GB (SSD recommended)"}
          </p>
          <p>
            <span className="text-gray-300 font-medium">Android:</span>{" "}
            {locale === "zh" ? "约 10-15 GB" : "~10-15 GB"}
          </p>
          <p>
            <span className="text-gray-300 font-medium">iOS:</span>{" "}
            {locale === "zh" ? "约 10-15 GB" : "~10-15 GB"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {locale === "zh"
              ? "以上为安装所需空间，后续版本更新可能需要额外空间。"
              : "Sizes above are for initial installation. Future updates may require additional space."}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection faqs={faqs} locale={locale} />
    </div>
  );
}
