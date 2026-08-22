import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { t, hreflangAlternates, isZhLocale, type Locale, LOCALES } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(
    locale,
    "异环官网入口导航：国服/国际服、PC下载、Steam、云异环与手机入口",
    "NTE Official Site Entry Guide: PC Download, Steam, Cloud PC, Mobile and Servers",
    "異環官網入口導航：國服/國際服、PC下載、Steam、雲異環與手機入口"
  );
  const description = localizedText(
    locale,
    "异环(NTE)非官方官网入口导航，帮你区分国服官网、国际服入口、PC启动器、Steam/Epic、Android/iOS、PS5和云异环，避免误下第三方安装包。",
    "Unofficial NTE official-site entry guide covering CN/global routes, PC launcher, Steam/Epic, Android/iOS, PS5, and Cloud PC so you avoid unsafe third-party downloads.",
    "異環(NTE)非官方官網入口導航，幫你區分國服官網、國際服入口、PC啟動器、Steam/Epic、Android/iOS、PS5和雲異環，避免誤下第三方安裝包。"
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("official-site", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function OfficialSitePage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const title = localizedText(
    locale,
    "异环官网入口导航",
    "NTE Official Site Entry Guide",
    "異環官網入口導航"
  );
  const description = localizedText(
    locale,
    "这不是官方站，而是把异环国服、国际服、本地 PC、Steam/Epic、手机、PS5 和云异环入口整理到一页，方便你先判断该走哪条路径。",
    "This is not the official site. It is a route guide that helps you choose between CN/global, local PC, Steam/Epic, mobile, PS5, and Cloud PC access.",
    "這不是官方站，而是把異環國服、國際服、本地 PC、Steam/Epic、手機、PS5 和雲異環入口整理到一頁，方便你先判斷該走哪條路徑。"
  );

  const faqs = [
    {
      question: "Where is the NTE official site entry?",
      questionZh: "异环官网入口在哪里？",
      answer: "Use the official site, platform stores, or the cloud-gaming entry referenced by official notices. This page is an unofficial guide that helps you choose the right route before downloading.",
      answerZh: "优先使用官方站、平台商店，或官方公告指向的云游戏入口。本页是非官方导航，帮助你在下载前先选对路线。",
    },
    {
      question: "Should I use the CN site, global site, Steam, or Cloud PC?",
      questionZh: "异环应该用国服官网、国际服、Steam 还是云异环？",
      answer: "Choose by account and device: CN for CN account/community, global or Steam for global access, local PC if your hardware is strong, and Cloud PC for low-spec or short sessions.",
      answerZh: "按账号和设备选：国服账号/中文社区走国服，国际服或 Steam 适合全球服，本地 PC 适合配置够的玩家，云异环适合低配或短时上线。",
    },
    {
      question: "Is this page an official NTE website?",
      questionZh: "这个页面是异环官网吗？",
      answer: "No. NTE Guide is an unofficial wiki and route guide. It links users toward safer official or platform entry paths, but it is not operated by Perfect World or Hotta Studio.",
      answerZh: "不是。NTE Guide 是非官方 Wiki 和入口导航，帮助用户找到更安全的官方或平台入口，但并非完美世界或 Hotta Studio 运营。",
    },
  ];

  const routes = [
    {
      label: localizedText(locale, "官网 PC 启动器", "Official PC Launcher", "官網 PC 啟動器"),
      href: `/${lang}/guides/download-install-guide`,
      bestFor: localizedText(locale, "电脑配置达标、想长期本地游玩", "Long-term local PC play on capable hardware", "電腦配置達標、想長期本地遊玩"),
      note: localizedText(locale, "先确认国服/国际服账号，再下载对应客户端。", "Confirm CN/global account route before downloading.", "先確認國服/國際服帳號，再下載對應客戶端。"),
    },
    {
      label: "Steam / Epic",
      href: `/${lang}/steam`,
      bestFor: localizedText(locale, "偏好平台库、好友系统、自动更新", "Players who prefer platform library, friends, and updates", "偏好平台庫、好友系統、自動更新"),
      note: localizedText(locale, "适合全球服 PC 入口选择，仍需确认账号区服。", "Useful for global-side PC access; still verify server account.", "適合全球服 PC 入口選擇，仍需確認帳號區服。"),
    },
    {
      label: localizedText(locale, "手机商店", "Mobile Stores", "手機商店"),
      href: `/${lang}/guides/download-install-guide`,
      bestFor: localizedText(locale, "iOS / Android 主力玩家", "iOS and Android players", "iOS / Android 主力玩家"),
      note: localizedText(locale, "优先 App Store、Google Play、TapTap 或官方 APK。", "Prefer App Store, Google Play, TapTap, or official APK routes.", "優先 App Store、Google Play、TapTap 或官方 APK。"),
    },
    {
      label: "PS5",
      href: `/${lang}/guides/download-install-guide`,
      bestFor: localizedText(locale, "主机玩家", "Console players", "主機玩家"),
      note: localizedText(locale, "从 PlayStation Store 搜索游戏名进入。", "Search the game name on PlayStation Store.", "從 PlayStation Store 搜尋遊戲名進入。"),
    },
    {
      label: localizedText(locale, "云异环 PC", "Cloud Yihuan / Cloud PC", "雲異環 PC"),
      href: `/${lang}/blog/cloud-yihuan-pc-guide`,
      bestFor: localizedText(locale, "低配电脑、Mac 过渡、短时上线", "Low-spec PCs, Mac fallback, quick logins", "低配電腦、Mac 過渡、短時上線"),
      note: localizedText(locale, "重点确认免费时长、排队、网络延迟和区服账号。", "Check free time, queue, latency, and server account first.", "重點確認免費時長、排隊、網路延遲和區服帳號。"),
    },
    {
      label: localizedText(locale, "国服 vs 国际服", "CN vs Global", "國服 vs 國際服"),
      href: `/${lang}/cn-vs-global`,
      bestFor: localizedText(locale, "还没决定账号区服的新玩家", "New players who have not chosen a server", "還沒決定帳號區服的新玩家"),
      note: localizedText(locale, "账号、数据、好友和兑换码通常不互通。", "Accounts, progress, friends, and codes are usually separate.", "帳號、資料、好友和兌換碼通常不互通。"),
    },
  ];

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={description}
        url={`https://nteguide.com/${lang}/official-site`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: title },
        ]}
      />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {localizedText(locale, "非官方入口导航", "Unofficial Route Guide", "非官方入口導航")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">{description}</p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "先判断：" : "Start with:",
              value: localizedText(locale, "你要的是国服、国际服、本地 PC、手机、PS5，还是云异环。", "Decide whether you need CN, global, local PC, mobile, PS5, or Cloud PC.", "你要的是國服、國際服、本地 PC、手機、PS5，還是雲異環。"),
            },
            {
              label: isZh ? "安全原则：" : "Safety rule:",
              value: localizedText(locale, "不要优先下载第三方网盘包或来历不明的启动器。", "Avoid third-party mirrors or unknown launchers first.", "不要優先下載第三方網盤包或來歷不明的啟動器。"),
            },
            {
              label: isZh ? "账号提醒：" : "Account note:",
              value: localizedText(locale, "国服和国际服账号/数据通常不互通，下载前先选区服。", "CN and global account/progress are usually separate, so choose server first.", "國服和國際服帳號/資料通常不互通，下載前先選區服。"),
            },
          ]}
        />

        <section className="my-10">
          <h2 className="text-2xl font-bold mb-4">
            {localizedText(locale, "按需求选择入口", "Choose by what you need", "按需求選擇入口")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route) => (
              <Link
                key={route.label}
                href={route.href}
                className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 hover:border-primary-500/40 hover:bg-gray-900/60 transition-colors"
              >
                <h3 className="text-lg font-semibold text-primary-300">{route.label}</h3>
                <p className="mt-2 text-sm text-gray-300">{route.bestFor}</p>
                <p className="mt-3 text-xs leading-5 text-gray-500">{route.note}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h2 className="text-lg font-semibold text-amber-200">
            {localizedText(locale, "为什么不要只搜“异环官网”就直接点？", "Why not click the first “NTE official site” result blindly?", "為什麼不要只搜「異環官網」就直接點？")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {localizedText(
              locale,
              "因为“官网”这个词会混合多个意图：国服官网、国际服官网、PC 本地客户端、Steam/Epic、手机商店、PS5、云异环，甚至还有第三方镜像。先判断账号区服和设备，再进入对应入口，能减少下载错包、登录错服和重复安装。",
              "Because “official site” mixes several intents: CN site, global site, local PC launcher, Steam/Epic, mobile stores, PS5, Cloud PC, and sometimes third-party mirrors. Pick account server and device first to avoid wrong packages, wrong server logins, and duplicate installs.",
              "因為「官網」這個詞會混合多個意圖：國服官網、國際服官網、PC 本地客戶端、Steam/Epic、手機商店、PS5、雲異環，甚至還有第三方鏡像。先判斷帳號區服和裝置，再進入對應入口，能減少下載錯包、登入錯服和重複安裝。"
            )}
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { href: `/${lang}/guides/download-install-guide`, label: localizedText(locale, "完整下载指南", "Full Download Guide", "完整下載指南") },
            { href: `/${lang}/system-requirements`, label: localizedText(locale, "配置要求", "System Requirements", "配置要求") },
            { href: `/${lang}/blog/cloud-yihuan-pc-guide`, label: localizedText(locale, "云异环说明", "Cloud PC Guide", "雲異環說明") },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 text-sm text-gray-300 hover:border-primary-500/40 hover:text-primary-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
