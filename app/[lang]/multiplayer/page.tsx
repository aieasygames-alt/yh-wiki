import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getAllFaqs } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqPageJsonLd, ArticleJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { FaqSection } from "../../../components/FaqSection";

const MULTIPLAYER_FAQ_IDS = [
  "multiplayer-coop",
  "pink-paws-coop",
  "co-op-unlock-level",
  "co-op-matchmaking-failed",
  "cross-platform-save",
  "cross-platform-how-to",
  "account-link-cross-save",
  "cross-platform-account-linking",
];

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const faqCount = MULTIPLAYER_FAQ_IDS.length;
  const title = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環多人聯機 & 跨平台存檔 — 4人組隊、跨平台連線教學（2026）"
      : "异环多人联机 & 跨平台存档 — 4人组队、跨平台连线教学（2026）")
    : "Is NTE Multiplayer? Co-op & Online Features Explained (2026)";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? `異環（NTE）多人聯機完整教學：4人組隊合作、跨平台存檔同步、Pink Paws 社交系統、聯機解鎖條件與匹配排查，並整理 ${faqCount} 個常見問題。`
      : `异环（NTE）多人联机完整教学：4人组队合作、跨平台存档同步、Pink Paws 社交系统、联机解锁条件与匹配排查，并整理 ${faqCount} 个常见问题。`)
    : `Complete Neverness to Everness multiplayer guide covering 4-player co-op, cross-save, Pink Paws squads, unlock requirements, matchmaking fixes, and ${faqCount} common FAQs.`;
  return {
    title,
    description,
    alternates: hreflangAlternates("multiplayer", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function MultiplayerPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const allFaqs = getAllFaqs();
  const faqs = MULTIPLAYER_FAQ_IDS
    .map((id) => allFaqs.find((f) => f.id === id))
    .filter(Boolean)
    .map((f) => ({
      question: f!.question,
      questionZh: f!.question,
      answer: f!.answer,
      answerZh: f!.answer,
    }));

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环多人联机指南" : "NTE Multiplayer & Cross-Platform Guide"}
        description={isZhLocale(locale) ? "4人组队、跨平台存档、联机教学" : "4-player co-op, cross-platform save, multiplayer guide"}
        url={`https://nteguide.com/${lang}/multiplayer`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "多人聯機" : "多人联机") : "Multiplayer" },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">
          {isZhLocale(locale)
            ? (locale === "tw" ? "異環多人聯機 & 跨平台指南" : "异环多人联机 & 跨平台指南")
            : "NTE Multiplayer & Cross-Platform Guide"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isZhLocale(locale)
            ? "异环支持全平台联机与跨平台存档。以下为你详解多人合作、组队玩法、跨平台数据同步等内容。"
            : "NTE supports full cross-platform play and cross-save. Here's everything you need to know about co-op, squads, and syncing your progress."}
        </p>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁多人指南最適合怎麼看？" : "这页多人指南最适合怎么用？")
              : "How should you use this multiplayer guide?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                  ? "先用這頁確認異環是否支援多人、跨平台存檔與解鎖條件，再按你的問題去看匹配、組隊或帳號同步細節。這頁最適合快速排查能不能一起玩，不適合替代完整的新手流程或設備設定教學。"
                  : "先用这页确认异环是否支持多人、跨平台存档与解锁条件，再按你的问题去看匹配、组队或账号同步细节。这页最适合快速排查能不能一起玩，不适合替代完整的新手流程或设备设置教学。")
              : "Use this page to confirm whether NTE supports co-op, cross-save, and your unlock requirements first, then jump into matchmaking, squads, or account sync details. It is best for quickly answering whether you can play together, not for replacing full onboarding or device setup guides."}
          </p>
        </section>

        {/* Quick Answer for Featured Snippet */}
        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZhLocale(locale) ? "联机人数：" : "Co-op Players:",
              value: isZhLocale(locale) ? "最多 4 人组队" : "Up to 4 players",
            },
            {
              label: isZhLocale(locale) ? "跨平台存档：" : "Cross-Save:",
              value: isZhLocale(locale) ? "PC / 手机 / PS5 全平台同步" : "PC, Mobile & PS5 full sync",
            },
            {
              label: isZhLocale(locale) ? "解锁条件：" : "Unlock:",
              value: isZhLocale(locale) ? "完成新手教程主线" : "After completing tutorial main story",
            },
            {
              label: isZhLocale(locale) ? "社交系统：" : "Social:",
              value: isZhLocale(locale) ? "Pink Paws 4人探索小队" : "Pink Paws 4-player exploration squads",
            },
          ]}
        />

        <section className="my-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "聯機前先看什麼" : "联机前先看什么")
                : "What should you check before co-op?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "先確認雙方是否都已完成新手主線並解鎖聯機入口。" : "先确认双方是否都已完成新手主线并解锁联机入口。") : "Confirm that everyone has cleared the tutorial path and unlocked co-op first."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "檢查是不是在同一帳號體系與同一區服節點下遊玩。" : "检查是不是在同一账号体系与同一区服节点下游玩。") : "Check that you are playing within the same account ecosystem and server track."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "如果你是跨平台登入，先把帳號綁定與存檔同步確認好。" : "如果你是跨平台登录，先把账号绑定与存档同步确认好。") : "If you move across platforms, verify account linking and save sync before troubleshooting matchmaking."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把跨平台存檔理解成任何伺服器都能直接互通。" : "把跨平台存档理解成任何服务器都能直接互通。") : "Assuming cross-save means every server environment is automatically interchangeable."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "沒先過完解鎖流程就直接排查連線問題。" : "没先过完解锁流程就直接排查连线问题。") : "Troubleshooting connection issues before checking the co-op unlock requirement."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "只看平台支援，不核對帳號與好友組隊條件。" : "只看平台支持，不核对账号与好友组队条件。") : "Checking platform support alone without confirming account and squad prerequisites."}</li>
            </ul>
          </div>
        </section>

        {/* Core Features */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "核心多人功能" : "Core Multiplayer Features"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "👥",
                title: isZhLocale(locale) ? "4人联机合作" : "4-Player Co-op",
                desc: isZhLocale(locale)
                  ? "邀请好友或匹配路人组队，共同探索开放世界、挑战 Boss、完成副本。"
                  : "Invite friends or match with randoms to explore the open world, fight bosses, and clear dungeons together.",
              },
              {
                icon: "🐾",
                title: "Pink Paws 社交小队",
                desc: isZhLocale(locale)
                  ? "创建或加入最多 4 人的探索小队，实时同步探索进度和资源采集。"
                  : "Create or join exploration squads of up to 4 players with real-time synced progress and resource gathering.",
              },
              {
                icon: "🌐",
                title: isZhLocale(locale) ? "跨平台存档同步" : "Cross-Platform Save",
                desc: isZhLocale(locale)
                  ? "PC、Android、iOS、PS5 全平台数据互通。使用同一完美世界账号登录即可自动同步。"
                  : "Full cross-save across PC, Android, iOS, and PS5. Log in with the same Perfect World account to auto-sync.",
              },
              {
                icon: "🔗",
                title: isZhLocale(locale) ? "账号绑定教学" : "Account Linking",
                desc: isZhLocale(locale)
                  ? "设置 → 账号管理 → 绑定邮箱/手机。建议绑定所有登录方式以防数据丢失。"
                  : "Settings → Account Management → Bind email/phone. Link all login methods to protect your data.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-5"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Platforms */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "支持平台" : "Supported Platforms"}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: "🖥️", name: "PC (Windows)" },
              { icon: "🤖", name: "Android" },
              { icon: "🍎", name: "iOS" },
              { icon: "🎮", name: "PlayStation 5" },
            ].map((p) => (
              <span
                key={p.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 bg-gray-900/30 text-sm"
              >
                <span>{p.icon}</span> {p.name}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {isZhLocale(locale) ? "常见问题" : "Frequently Asked Questions"}
          </h2>
          <FaqSection faqs={faqs} locale={locale} />
        </section>

        {/* Related Links */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-bold mb-4">
            {isZhLocale(locale) ? "相关内容" : "Related Content"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: isZhLocale(locale) ? "配置要求" : "System Requirements", href: `/${lang}/system-requirements` },
              { label: isZhLocale(locale) ? "下载安装" : "Download & Install", href: `/${lang}/system-requirements` },
              { label: isZhLocale(locale) ? "新手攻略" : "Beginner Guide", href: `/${lang}/guides/beginner-quick-start` },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
              >
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
