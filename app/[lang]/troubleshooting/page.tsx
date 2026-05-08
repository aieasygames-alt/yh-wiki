import { Metadata } from "next";
import { isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import troubleshootingData from "../../../data/troubleshooting.json";

type BilingualText = { zh: string; en: string };

interface TroubleshootingItem {
  id: string;
  title: BilingualText;
  description: BilingualText;
  severity: string;
  platforms: string[];
  steps: BilingualText;
}

interface TroubleshootingSection {
  id: string;
  title: BilingualText;
  icon: string;
  items: TroubleshootingItem[];
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const title = isZh
    ? (locale === "tw"
      ? "異環常見問題排查指南 — 崩潰、卡頓、帳號問題完整解決方案"
      : "异环常见问题排查指南 — 崩溃、卡顿、账号问题完整解决方案")
    : "NTE Troubleshooting Guide: Fix Crashes, FPS Drops, Account Issues & Bugs";
  const description = isZh
    ? (locale === "tw"
      ? "異環(NTE)完整故障排查指南：遊戲崩潰閃退、FPS卡頓、帳號同步、預註冊獎勵、充值問題等常見問題的詳細解決步驟。"
      : "异环(NTE)完整故障排查指南：游戏崩溃闪退、FPS卡顿、账号同步、预注册奖励、充值问题等常见问题的详细解决步骤。")
    : "Complete NTE troubleshooting guide: Fix game crashes, FPS drops, stuttering, account linking, pre-registration rewards, purchase issues, and in-game bugs. Step-by-step solutions for all platforms.";

  return {
    title,
    description,
    alternates: hreflangAlternates("troubleshooting", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  const labels: Record<string, Record<string, string>> = {
    high: { zh: "严重", en: "High" },
    medium: { zh: "中等", en: "Medium" },
    low: { zh: "轻微", en: "Low" },
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${colors[severity] || colors.low}`}>
      {labels[severity]?.en || severity}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const icons: Record<string, string> = { pc: "🖥", mobile: "📱", ps5: "🎮" };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 rounded">
      {icons[platform] || ""} {platform.toUpperCase()}
    </span>
  );
}

function TroubleshootingItemCard({ item, locale }: { item: TroubleshootingItem; locale: Locale }) {
  const isZh = isZhLocale(locale);
  const title = isZh ? item.title.zh : item.title.en;
  const description = isZh ? item.description.zh : item.description.en;
  const steps = isZh ? item.steps.zh : item.steps.en;

  return (
    <div id={item.id} className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-colors p-5">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="text-base font-semibold text-gray-100">{title}</h3>
        <SeverityBadge severity={item.severity} />
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.platforms.map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="text-xs text-purple-400 font-medium mb-2">
          {isZh ? "解决步骤" : "Solution Steps"}
        </div>
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {steps}
        </div>
      </div>
    </div>
  );
}

export default function TroubleshootingPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const data = troubleshootingData as {
    title: BilingualText;
    description: BilingualText;
    sections: TroubleshootingSection[];
    officialSupport: {
      email: string;
      channels: BilingualText;
      tip: BilingualText;
    };
  };

  const pageTitle = isZh ? data.title.zh : data.title.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: isZh ? "首页" : "Home", href: `/${lang}` },
          { label: pageTitle, href: `/${lang}/troubleshooting` },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-3">{pageTitle}</h1>
        <p className="text-gray-400 text-lg">
          {isZh ? data.description.zh : data.description.en}
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {data.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-sm hover:bg-purple-500/20 transition-colors border border-purple-500/20"
          >
            <span>{section.icon}</span>
            <span>{isZh ? section.title.zh : section.title.en}</span>
          </a>
        ))}
      </div>

      {/* Sections */}
      {data.sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">{section.icon}</span>
            {isZh ? section.title.zh : section.title.en}
          </h2>
          <div className="grid gap-4">
            {section.items.map((item) => (
              <TroubleshootingItemCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </section>
      ))}

      {/* Official Support */}
      <div className="mt-8 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-6">
        <h2 className="text-lg font-bold text-yellow-400 mb-3">
          {isZh ? "📞 联系官方客服" : "📞 Contact Official Support"}
        </h2>
        <p className="text-sm text-gray-300 mb-2">
          {isZh
            ? "如果以上方案无法解决问题，请联系官方客服："
            : "If the solutions above don't resolve your issue, contact official support:"}
        </p>
        <div className="bg-gray-800/50 rounded-lg p-4 mb-3">
          <div className="text-sm text-gray-400 mb-1">
            {isZh ? "官方客服邮箱" : "Official Support Email"}
          </div>
          <a
            href={`mailto:${data.officialSupport.email}`}
            className="text-lg text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            {data.officialSupport.email}
          </a>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          {isZh ? data.officialSupport.channels.zh : data.officialSupport.channels.en}
        </p>
        <p className="text-xs text-gray-500 italic">
          💡 {isZh ? data.officialSupport.tip.zh : data.officialSupport.tip.en}
        </p>
      </div>

      {/* FAQ Link */}
      <div className="mt-6 text-center">
        <a
          href={`/${lang}/faq/`}
          className="inline-block px-6 py-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/20 text-sm font-medium"
        >
          {isZh ? "查看更多常见问题 →" : "View All FAQs →"}
        </a>
      </div>
    </div>
  );
}
