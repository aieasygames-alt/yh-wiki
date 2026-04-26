import { Metadata } from "next";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqSection } from "../../../components/FaqSection";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import specsData from "../../../data/system-requirements.json";
import { getAllFaqs } from "../../../lib/queries";

type SpecValue = { zh: string; en: string };
type PlatformSpecs = Record<string, SpecValue>;

const langs = ["zh", "tw", "en"] as const;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環配置要求與下載大小 — PC/Android/iOS 最低推薦配置（2026）"
      : "异环配置要求与下载大小 — PC/Android/iOS 最低与推荐配置（2026）")
    : "NTE System Requirements: PC, Mobile & Console Specs (2026)";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環(NTE)完整配置要求：PC、Android、iOS 最低和推薦配置，下載大小約40GB(PC)/15GB(手機)，儲存空間需求一覽。"
      : "异环(NTE)完整配置要求与下载大小：PC约40GB、手机约15GB，含PC/Android/iOS最低和推荐配置、存储空间要求。")
    : "Can your device run Neverness to Everness (NTE)? Full PC, Android, iOS minimum & recommended specs, download size (~40GB PC / ~15GB mobile), and storage requirements.";

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

function SpecTable({ specs, labels, locale }: { specs: PlatformSpecs; labels: Record<string, Record<Locale, string>>; locale: Locale }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {isZhLocale(locale) ? "配置项" : "Spec"}
            </th>
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {isZhLocale(locale) ? "最低配置" : "Minimum"}
            </th>
            <th className="py-3 px-4 text-left text-gray-400 font-medium">
              {isZhLocale(locale) ? "推荐配置" : "Recommended"}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(labels).map(([key, label]) => {
            const dataKey = isZhLocale(locale) ? "zh" as const : "en" as const;
            const minVal = specsData.pc.minimum[key as keyof typeof specsData.pc.minimum] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).android?.minimum?.[key as string] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).ios?.minimum?.[key as string];
            const recVal = specsData.pc.recommended[key as keyof typeof specsData.pc.recommended] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).android?.recommended?.[key as string] ||
                           (specsData as Record<string, Record<string, PlatformSpecs>>).ios?.recommended?.[key as string];
            return (
              <tr key={key} className="border-b border-gray-800/50">
                <td className="py-3 px-4 text-gray-300 font-medium">{label[locale]}</td>
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

  const pcLabels: Record<string, Record<Locale, string>> = {
    os: { zh: "操作系统", tw: "操作系統", en: "OS" },
    cpu: { zh: "处理器", tw: "處理器", en: "CPU" },
    ram: { zh: "内存", tw: "記憶體", en: "RAM" },
    gpu: { zh: "显卡", tw: "顯示卡", en: "GPU" },
    storage: { zh: "存储空间", tw: "儲存空間", en: "Storage" },
  };

  const androidLabels: Record<string, Record<Locale, string>> = {
    soC: { zh: "处理器", tw: "處理器", en: "SoC" },
    ram: { zh: "内存", tw: "記憶體", en: "RAM" },
    os: { zh: "系统版本", tw: "系統版本", en: "OS" },
    storage: { zh: "存储空间", tw: "儲存空間", en: "Storage" },
  };

  const iosLabels: Record<string, Record<Locale, string>> = {
    device: { zh: "设备", tw: "裝置", en: "Device" },
    os: { zh: "系统版本", tw: "系統版本", en: "OS" },
    storage: { zh: "存储空间", tw: "儲存空間", en: "Storage" },
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
          { label: isZhLocale(locale) ? "首页" : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? "配置要求" : "System Requirements" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isZhLocale(locale) ? "异环配置要求 — 你的设备能运行吗？" : "NTE System Requirements — Can Your Device Run It?"}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {isZhLocale(locale)
          ? "异环(Neverness to Everness)全平台配置要求一览，包含 PC、Android、iOS 最低与推荐配置，下载大小和存储空间需求。"
          : "Complete system requirements for Neverness to Everness on PC, Android, and iOS — minimum and recommended specs, download size, and storage."}
      </p>

      {/* PC Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🖥️</span>
          {isZhLocale(locale) ? "PC 配置要求" : "PC Requirements"}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable specs={specsData.pc.minimum} labels={pcLabels} locale={locale} />
        </div>
      </section>

      {/* Android Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          {isZhLocale(locale) ? "Android 配置要求" : "Android Requirements"}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable specs={specsData.android.minimum} labels={androidLabels} locale={locale} />
        </div>
      </section>

      {/* iOS Requirements */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🍎</span>
          {isZhLocale(locale) ? "iOS 配置要求" : "iOS Requirements"}
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <SpecTable specs={specsData.ios.minimum} labels={iosLabels} locale={locale} />
        </div>
      </section>

      {/* Storage Size */}
      <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
        <h2 className="text-lg font-bold mb-3">
          {isZhLocale(locale) ? "存储空间说明" : "Storage Size"}
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            <span className="text-gray-300 font-medium">PC:</span>{" "}
            {isZhLocale(locale) ? "约 40 GB（推荐 SSD）" : "~40 GB (SSD recommended)"}
          </p>
          <p>
            <span className="text-gray-300 font-medium">Android:</span>{" "}
            {isZhLocale(locale) ? "约 10-15 GB" : "~10-15 GB"}
          </p>
          <p>
            <span className="text-gray-300 font-medium">iOS:</span>{" "}
            {isZhLocale(locale) ? "约 10-15 GB" : "~10-15 GB"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {isZhLocale(locale)
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
