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
      ? "異環 PC／手機配置核驗指南 — 下載前檢查商店與啟動器"
      : "异环 PC／手机配置核验指南 — 下载前检查商店与启动器")
    : "NTE PC & Mobile Requirements Check Guide — Verify Before Downloading";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環(NTE) PC、Android 與 iOS 的設備核驗流程、歷史規格參考、儲存空間與 ${faqCount} 個效能常見問題。配置與下載大小可能變動，請以目前商店頁或啟動器為準。`
      : `异环(NTE) PC、Android 与 iOS 的设备核验流程、历史规格参考、存储空间与 ${faqCount} 个性能常见问题。配置与下载大小可能变动，请以当前商店页或启动器为准。`)
    : `NTE device-check workflow, historical PC/Android/iOS spec references, storage guidance, and ${faqCount} performance FAQs. Requirements and download size can change; use the current store page or launcher as the source of truth.`;

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
      <p className="text-xs text-gray-500 -mt-5 mb-8">
        {isZhLocale(locale)
          ? (locale === "tw" ? "歷史規格復核：2026-09-29。下載前請以目前商店頁或啟動器顯示為準。" : "历史规格复核：2026-09-29。下载前请以当前商店页或启动器显示为准。")
          : "Historical specs reviewed September 29, 2026. Verify the current store page or launcher before downloading."}
      </p>

      <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
        <h2 className="text-lg font-semibold text-white">
          {isZhLocale(locale)
            ? (locale === "tw" ? "這頁配置表最適合怎麼看？" : "这页配置表最适合怎么用？")
            : "How should you use this requirements page?"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-300">
          {isZhLocale(locale)
            ? (locale === "tw"
                ? "先用這頁整理設備、儲存、散熱與網路條件，再到目前商店頁或啟動器核對最低要求、下載大小與支援平台。歷史配置表只能用於預估，不代表每個版本或每台設備的實際效能。"
                : "先用这页整理设备、存储、散热与网络条件，再到当前商店页或启动器核对最低要求、下载大小与支持平台。历史配置表只能用于预估，不代表每个版本或每台设备的实际性能。")
            : "Use this page to organize your device, storage, thermals, and network conditions, then verify minimum requirements, download size, and supported platforms on the current store page or launcher. Historical spec tables are planning references only, not a performance guarantee for every version or device."}
        </p>
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-base font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "安裝前先看什麼" : "安装前先看什么")
              : "What should you check before installing?"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{isZhLocale(locale) ? (locale === "tw" ? "先確認你的 CPU、顯卡與可用 SSD 空間是否同時達標。" : "先确认你的 CPU、显卡与可用 SSD 空间是否同时达标。") : "Verify CPU, GPU, and available SSD space together rather than checking one spec in isolation."}</li>
            <li>{isZhLocale(locale) ? (locale === "tw" ? "手機端除了晶片，也要看散熱、儲存與長時間穩定性。" : "手机端除了芯片，也要看散热、存储与长时间稳定性。") : "On mobile, judge thermals, storage, and sustained stability in addition to chipset tier."}</li>
            <li>{isZhLocale(locale) ? (locale === "tw" ? "如果設備卡在線上邊緣，先考慮雲端或較低畫質方案。" : "如果设备卡在线上边缘，先考虑云端或较低画质方案。") : "If your hardware is borderline, consider cloud play or lower visual targets before downloading."}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-base font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "常見誤區" : "常见误区")
              : "Common mistakes"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{isZhLocale(locale) ? (locale === "tw" ? "只看記憶體，不看顯卡、磁碟和暫存空間。" : "只看内存，不看显卡、磁盘和临时空间。") : "Looking at RAM alone while ignoring GPU, storage speed, and temporary install space."}</li>
            <li>{isZhLocale(locale) ? (locale === "tw" ? "把最低配置當成穩定高畫質配置。" : "把最低配置当成稳定高画质配置。") : "Treating minimum requirements as if they guarantee consistently smooth high settings."}</li>
            <li>{isZhLocale(locale) ? (locale === "tw" ? "看到旗艦機型名稱相近，就預設所有版本表現一致。" : "看到旗舰机型名称相近，就预设所有版本表现一致。") : "Assuming similarly named flagship devices will perform identically across every version."}</li>
          </ul>
        </div>
      </section>

      <section className="mb-10 rounded-xl border border-primary-500/20 bg-primary-500/10 p-5">
        <h2 className="text-base font-semibold text-white">
          {isZhLocale(locale)
            ? (locale === "tw" ? "配置不夠時怎麼選入口？" : "配置不够时怎么选入口？")
            : "What if your device is below the recommended specs?"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-300">
          {isZhLocale(locale)
            ? (locale === "tw"
              ? "如果你的 PC 只勉強達到最低配置，先看下載安裝頁確認本地客戶端空間，再比較雲異環 PC 是否更適合短時登入。手機端發熱或掉幀嚴重時，也可以先降低畫質與幀率，不必急著重裝。"
              : "如果你的 PC 只勉强达到最低配置，先看下载安装页确认本地客户端空间，再比较云异环 PC 是否更适合短时登录。手机端发热或掉帧严重时，也可以先降低画质与帧率，不必急着重装。")
            : "If your PC only barely meets minimum specs, check the download guide for local-client storage first, then compare whether Cloud PC fits short login sessions better. On mobile, try lower graphics and frame-rate targets before reinstalling."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${lang}/guides/download-install-guide`} className="text-sm text-primary-300 hover:text-primary-200">
            {isZhLocale(locale) ? (locale === "tw" ? "下載安裝指南" : "下载安装指南") : "Download Guide"}
          </Link>
          <Link href={`/${lang}/blog/cloud-yihuan-pc-guide`} className="text-sm text-primary-300 hover:text-primary-200">
            {isZhLocale(locale) ? (locale === "tw" ? "雲異環 PC 說明" : "云异环 PC 说明") : "Cloud PC Guide"}
          </Link>
        </div>
      </section>

      {/* Quick Answer — helps Featured Snippet / CTR */}
      <QuickAnswerCard
        locale={locale}
        items={[
          {
            label: isZhLocale(locale) ? "核验入口：" : "Verify from:",
            value: isZhLocale(locale) ? "当前商店页或游戏启动器" : "The current store page or game launcher",
          },
          {
            label: isZhLocale(locale) ? "PC 参考：" : "PC reference:",
            value: isZhLocale(locale) ? "历史规格表仅供下载前预估" : "Historical spec table for pre-download planning only",
          },
          {
            label: "Mobile:",
            value: isZhLocale(locale) ? "核对商店支持、可用空间、系统版本与散热" : "Check store support, free space, OS version, and thermals",
          },
          {
            label: isZhLocale(locale) ? "性能预期：" : "Performance:",
            value: isZhLocale(locale) ? "因设备、版本与设置而异" : "Varies by device, version, and settings",
          },
          {
            label: isZhLocale(locale) ? "下载大小：" : "Download size:",
            value: isZhLocale(locale) ? "以当前商店或启动器显示为准" : "Use the current store or launcher listing",
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
          {isZhLocale(locale) ? "Steam / PC 平台状态核验" : "Steam / PC Status Check"}
        </h2>
        <p className="text-sm text-gray-400 mb-3 leading-relaxed">
          {isZhLocale(locale)
            ? "Steam、独立启动器、Epic 与云端 PC 的可用性、地区覆盖、账号绑定和配置要求都可能变化。下载或绑定前，请先核对当前商店页、客户端提示和官方公告，再使用完整 Steam 指南比较平台路径。"
            : "Availability, regional coverage, account binding, and requirements for Steam, the launcher, Epic, and Cloud PC can change. Before downloading or linking an account, check the current store page, client prompts, and official notices, then use the Steam guide to compare platform routes."}
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
