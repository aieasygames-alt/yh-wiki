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
      ? "異環電腦配置要求（2026）— PC/i5-8400/GTX 1060、手機 Android/iOS 詳細規格"
      : "异环电脑配置要求（2026）— PC/i5-8400/GTX 1060、手机 Android/iOS 详细规格")
    : "NTE System Requirements (2026) — PC, Mobile & Download Size";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環(NTE)完整配置要求：PC 最低 i5-8400 + GTX 1060、推薦 i7-9700 + RTX 2060，並整理 Android / iOS 規格、下載大小與 ${faqCount} 個效能常見問題。`
      : `异环(NTE)完整配置要求：PC 最低 i5-8400 + GTX 1060、推荐 i7-9700 + RTX 2060，并整理 Android / iOS 规格、下载大小与 ${faqCount} 个性能常见问题。`)
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

      <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
        <h2 className="text-lg font-semibold text-white">
          {isZhLocale(locale)
            ? (locale === "tw" ? "這頁配置表最適合怎麼看？" : "这页配置表最适合怎么用？")
            : "How should you use this requirements page?"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-300">
          {isZhLocale(locale)
            ? (locale === "tw"
                ? "先用這頁判斷你的設備屬於最低可玩、推薦流暢，還是需要調低畫質的區間，再決定要不要下載 PC、手機或換到雲端方案。這頁最適合做安裝前判斷，不適合替代實際的效能測試。"
                : "先用这页判断你的设备属于最低可玩、推荐流畅，还是需要调低画质的区间，再决定要不要下载 PC、手机或换到云端方案。这页最适合做安装前判断，不适合替代实际的性能测试。")
            : "Use this page to decide whether your hardware sits at minimum playable, recommended smooth play, or a lower-settings tier before you install on PC or mobile or switch to a cloud option. It is best for pre-install planning, not for replacing real performance testing."}
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
            label: "PC Minimum:",
            value: isZhLocale(locale) ? "Windows 10, i5-8400, GTX 1060 6GB / RX 580, 90GB SSD" : "Windows 10, Intel i5-8400, GTX 1060 6GB / RX 580, 90GB SSD",
          },
          {
            label: "PC Recommended:",
            value: isZhLocale(locale) ? "i7-9700, RTX 2060 / RX 5700 XT, 90GB SSD" : "Intel i7-9700, RTX 2060 / RX 5700 XT, 90GB SSD",
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
