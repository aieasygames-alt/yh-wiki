import Link from "next/link";
import type { Metadata } from "next";
import { t, isZhLocale, type Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { FaqSection } from "../../../components/FaqSection";
import { localizedText } from "../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环 Steam 版现状：已上线、PC配置要求、与移动端区别全解析", "NTE on Steam: Live Status, PC Specs & Mobile vs PC Differences");
  const description = localizedText(locale, "异环 Steam 版已在当前商店周期内上线。本文覆盖 Steam 当前状态、PC 最低/推荐配置、与移动端的画面与操作差异、以及账号与平台选择要点。", "NTE is already live on Steam in the current store cycle. This guide covers its current Steam status, PC minimum/recommended specs, visual and control differences vs mobile, and practical account/platform choices.");
  return {
    title,
    description,
    alternates: hreflangAlternates("steam", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function SteamPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const faqs = [
    {
      question: "When does NTE release on Steam?",
      questionZh: "异环 Steam 版什么时候发售？",
      answer: "As of July 11, 2026, NTE is already live on Steam in the current release cycle. If you mainly care about PC platform choice now, the question is no longer whether to wait for Steam, but whether you prefer Steam, the standalone launcher, Epic, or Cloud PC.",
      "answerZh": "截至 2026 年 7 月 11 日，异环 Steam 版已经在当前商店周期内上线。对现在的 PC 玩家来说，重点已经不是“要不要等 Steam”，而是更适合 Steam、独立启动器、Epic，还是云异环 PC。"
    },
    {
      question: "Will my NTE account work on Steam?",
      questionZh: "异环 Steam 版能用现有账号吗？",
      answer: "The current Steam release works with the existing NTE account flow used by the global publishing track. In practical terms, players should treat Steam as another global-side PC entry point rather than as a separate progression server. CN-server migration still should not be assumed without explicit official support.",
      "answerZh": "当前 Steam 版已经进入现有的异环账号流程，更像是国际服 PC 侧的又一个入口，而不是一套独立进度服务器。国服账号迁移仍然不应默认视为已支持，具体边界仍以官方说明为准。"
    },
    {
      question: "What are the PC requirements for NTE on Steam?",
      questionZh: "异环 Steam 版 PC 配置要求是什么？",
      answer: "Minimum: Intel i5-8400 / Ryzen 5 1600, 8GB RAM, GTX 1060 6GB / RX 580, 90GB SSD. Recommended: Intel i7-9700 / Ryzen 7 3700X, 16GB RAM, RTX 2060 / RX 5700 XT class GPU, 90GB NVMe SSD. Full details on the system requirements page.",
      "answerZh": "最低配置：Intel i5-8400 / Ryzen 5 1600、8GB 内存、GTX 1060 6GB / RX 580、90GB SSD。推荐配置：Intel i7-9700 / Ryzen 7 3700X、16GB 内存、RTX 2060 / RX 5700 XT 级显卡、90GB NVMe SSD。完整配置表见系统要求页面。"
    },
    {
      question: "Is the Steam version worth waiting for?",
      questionZh: "异环 Steam 版值得等吗？",
      "answer": "As of July 11, 2026, this is no longer a waiting question for most players because Steam is already live. The real choice is whether you value Steam's ecosystem enough to prefer it over the launcher, Epic, or Cloud PC.",
      "answerZh": "截至 2026 年 7 月 11 日，对多数玩家来说这已经不是“值不值得等”的问题，因为 Steam 版已经上线。现在真正要比较的是：你是否更看重 Steam 生态，而不是独立启动器、Epic 或云异环 PC。"
    },
  ];

  return (
    <>
      <ArticleJsonLd
        title={isZh ? "异环 Steam 版发售指南" : "NTE on Steam — Release Guide"}
        description={localizedText(locale, "Steam 版当前状态、PC 配置要求、账号互通与平台选择建议", "Steam live status, PC requirements, account behavior, and platform choice advice")}
        url={`https://nteguide.com/${lang}/steam`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "Steam 版" : "Steam Version" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {isZh ? "2026-07-11 更新" : "Updated July 11, 2026"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {localizedText(locale, "异环 Steam 版：当前状态与 PC 入口完整指南", "NTE on Steam: Current Status and PC Access Guide", "異環 Steam 版：目前狀態與 PC 入口完整指南")}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {localizedText(
              locale,
              "截至 2026 年 7 月 11 日，异环（Neverness to Everness）Steam 版已经进入当前商店周期。本文不再按“预售等待页”来写，而是直接回答现在 Steam、独立启动器、Epic 与云异环 PC 该怎么选。",
              "As of July 11, 2026, Neverness to Everness is already in the current Steam store cycle. This page no longer treats Steam as a future waitlist topic and instead focuses on how to choose between Steam, the standalone launcher, Epic, and Cloud PC right now.",
              "截至 2026 年 7 月 11 日，異環（Neverness to Everness）Steam 版已進入目前商店週期。本文不再把它寫成等待頁，而是直接回答現在該如何在 Steam、獨立啟動器、Epic 與雲異環 PC 之間做選擇。"
            )}
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh
              ? (locale === "tw" ? "這頁 Steam 指南最適合怎麼用？" : "这页 Steam 指南最适合怎么用？")
              : "How should you use this Steam guide?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZh
              ? (locale === "tw"
                  ? "先用這頁判斷你現在是不是更適合 Steam、獨立啟動器、Epic 或雲端 PC，再回到配置、下載與帳號頁面確認細節。這頁最適合做平台選擇，不適合替代完整的安裝與故障排查文檔。"
                  : "先用这页判断你现在是不是更适合 Steam、独立启动器、Epic 或云端 PC，再回到配置、下载与账号页面确认细节。这页最适合做平台选择，不适合替代完整的安装与故障排查文档。")
              : "Use this page to decide whether Steam, the standalone launcher, Epic, or cloud PC is the best fit for you right now, then verify details on requirements, download, and account pages. It is best for platform choice, not for replacing full install or troubleshooting docs."}
          </p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "当前状态：" : "Status:",
              value: isZh ? "Steam 已上线" : "Steam live"
            },
            {
              label: isZh ? "最低 GPU：" : "Min GPU:",
              value: "GTX 1060 6GB / RX 580"
            },
            {
              label: isZh ? "推荐 GPU：" : "Rec GPU:",
              value: "RTX 2060 / RX 5700 XT"
            },
            {
              label: isZh ? "账号互通：" : "Account:",
              value: isZh ? "国际服入口已接通" : "Global entry active"
            },
          ]}
        />

        <section className="my-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh
                ? (locale === "tw" ? "入 Steam 前先看什麼" : "入 Steam 前先看什么")
                : "What should you check before choosing Steam?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? (locale === "tw" ? "先確認你的 PC 配置是否更適合本地安裝，而不是雲端方案。" : "先确认你的 PC 配置是否更适合本地安装，而不是云端方案。") : "Confirm that your PC is better suited for native install than a cloud alternative."}</li>
              <li>{isZh ? (locale === "tw" ? "如果你很在意成就、好友列表與平台管理，Steam 會更順手。" : "如果你很在意成就、好友列表与平台管理，Steam 会更顺手。") : "If achievements, friends, and platform management matter to you, Steam is usually the cleaner fit."}</li>
              <li>{isZh ? (locale === "tw" ? "先想清楚你更重視平台生態，還是最快開玩與最少中轉。" : "先想清楚你更重视平台生态，还是最快开玩与最少中转。") : "Decide whether you value platform ecosystem more than the fastest path to launch and patching."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? (locale === "tw" ? "把 Steam 版誤解成一套完全獨立的新伺服器進度。" : "把 Steam 版误解成一套完全独立的新服务器进度。") : "Assuming the Steam version is a totally separate progression ecosystem by default."}</li>
              <li>{isZh ? (locale === "tw" ? "只因為看到 Steam 上線，就忽略了配置與下載成本。" : "只因为看到 Steam 上线，就忽略了配置与下载成本。") : "Seeing Steam availability and ignoring the local hardware and storage cost."}</li>
              <li>{isZh ? (locale === "tw" ? "把平台入口問題和區服、帳號體系問題混在一起。" : "把平台入口问题和区服、账号体系问题混在一起。") : "Mixing up platform-entry decisions with server-region or account-system decisions."}</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "一、当前 Steam 状态" : "1. Current Steam Status"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "截至 2026 年 7 月 11 日，这页更适合按“已经能上 Steam”来理解，而不是继续保留 7 月 22 日的旧等待口径。对玩家更有价值的问题是：你现在要不要直接从 Steam 进入、是否更适合用独立启动器或 Epic，以及你所在区服对应的账号体系怎么选。"
              : "As of July 11, 2026, this page is more useful when read as an already-live Steam entry rather than a July 22 waiting page. The practical question now is whether Steam is your best PC route versus the launcher or Epic, and how that fits your server/account setup."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "二、PC 配置要求" : "2. PC Requirements"}</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
              <h3 className="font-semibold text-gray-200 mb-3">{isZh ? "最低配置" : "Minimum"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><span className="text-gray-500">{isZh ? "系统：" : "OS: "}</span>Windows 10 64-bit</li>
                <li><span className="text-gray-500">{isZh ? "CPU：" : "CPU: "}</span>Intel Core i5-8400 / AMD Ryzen 5 1600</li>
                <li><span className="text-gray-500">{isZh ? "内存：" : "RAM: "}</span>8 GB</li>
                <li><span className="text-gray-500">{isZh ? "显卡：" : "GPU: "}</span>NVIDIA GTX 1060 6GB / AMD RX 580</li>
                <li><span className="text-gray-500">{isZh ? "存储：" : "Storage: "}</span>90 GB SSD（推荐 NVMe）</li>
              </ul>
            </div>
            <div className="rounded-lg border border-primary-500/30 bg-primary-500/5 p-4">
              <h3 className="font-semibold text-primary-300 mb-3">{isZh ? "推荐配置" : "Recommended"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><span className="text-gray-500">{isZh ? "系统：" : "OS: "}</span>Windows 10/11 64-bit</li>
                <li><span className="text-gray-500">{isZh ? "CPU：" : "CPU: "}</span>Intel Core i7-9700 / AMD Ryzen 7 3700X</li>
                <li><span className="text-gray-500">{isZh ? "内存：" : "RAM: "}</span>16 GB</li>
                <li><span className="text-gray-500">{isZh ? "显卡：" : "GPU: "}</span>NVIDIA RTX 2060 / AMD RX 5700 XT 或更好</li>
                <li><span className="text-gray-500">{isZh ? "存储：" : "Storage: "}</span>90 GB NVMe SSD</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            <Link href={`/${lang}/system-requirements`} className="text-primary-400 hover:text-primary-300">
              {isZh ? "→ 完整系统要求页面（含手机/PS5）" : "→ Full system requirements (mobile/PS5 included)"}
            </Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "三、Steam 版 vs 移动端差异" : "3. Steam vs Mobile Differences"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="text-left p-3">{isZh ? "对比项" : "Aspect"}</th>
                  <th className="text-left p-3">{isZh ? "Steam / PC" : "Steam / PC"}</th>
                  <th className="text-left p-3">{isZh ? "移动端" : "Mobile"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="p-3">{isZh ? "画面" : "Visuals"}</td><td className="p-3 text-emerald-400">{isZh ? "最高，接近 CG" : "Max, near-CG"}</td><td className="p-3 text-amber-400">{isZh ? "受机型限制" : "Device-limited"}</td></tr>
                <tr><td className="p-3">{isZh ? "帧率" : "Frame Rate"}</td><td className="p-3 text-emerald-400">{isZh ? "可稳定 120+" : "Stable 120+"}</td><td className="p-3 text-amber-400">{isZh ? "旗舰 120，中端 60" : "Flagship 120, mid 60"}</td></tr>
                <tr><td className="p-3">{isZh ? "操作" : "Controls"}</td><td className="p-3 text-emerald-400">{isZh ? "键鼠/手柄精准" : "KBM/gamepad precise"}</td><td className="p-3 text-amber-400">{isZh ? "触屏" : "Touch"}</td></tr>
                <tr><td className="p-3">{isZh ? "加载速度" : "Loading"}</td><td className="p-3 text-emerald-400">{isZh ? "NVMe 极快" : "NVMe very fast"}</td><td className="p-3 text-amber-400">{isZh ? "依赖闪存速度" : "Depends on flash"}</td></tr>
                <tr><td className="p-3">{isZh ? "便携性" : "Portability"}</td><td className="p-3 text-gray-500">{isZh ? "低" : "Low"}</td><td className="p-3 text-emerald-400">{isZh ? "高" : "High"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {isZh
              ? "如果你追求最佳画面和操作体验，Steam/PC 版是首选。如果想随时随地玩，移动端更合适。两边账号互通（同一服务器内），可以双端切换。"
              : "If you want the best visuals and controls, Steam/PC is the pick. For on-the-go play, mobile wins. Accounts sync within the same server, so you can switch between both."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "四、现在就能在 PC 上怎么玩？" : "4. How Can You Play on PC Right Now?"}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
              <h3 className="font-semibold text-gray-200 mb-2">{isZh ? "官网客户端 / Epic" : "Launcher / Epic"}</h3>
              <p className="text-sm text-gray-400">
                {isZh
                  ? "适合本地设备够用、想现在就稳定玩的人。重点是原生体验、低延迟和完整本地安装。"
                  : "Best if your local hardware is good enough and you want native play right now with low latency."}
              </p>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "云异环 PC" : "Cloud Yihuan PC"}</h3>
              <p className="text-sm text-gray-400">
                {isZh
                  ? "适合低配置设备、短时上线、或不想安装完整客户端的人。代价是要接受网络和排队。"
                  : "Best for weaker PCs, short login sessions, or players who do not want a full local install. The tradeoff is queue and network dependence."}
              </p>
              <Link href={`/${lang}/blog/cloud-yihuan-pc-guide`} className="inline-block mt-3 text-sm text-primary-400 hover:text-primary-300">
                {isZh ? "→ 看云异环 PC 说明" : "→ Cloud PC guide"}
              </Link>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "Steam" : "Steam"}</h3>
              <p className="text-sm text-gray-400">
                {isZh
                  ? "更适合长期 PC 主力玩家，重视成就、好友列表和平台生态。它是平台偏好，不是内容门槛。"
                  : "Best for long-term PC mains who care about achievements, friends, and the Steam ecosystem. It is a platform preference, not a content gate."}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "五、跨平台账号" : "5. Cross-Platform Account"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "Steam 版现在更应视作国际服 PC 入口的一部分。也就是说，如果你本来就在国际服体系内玩手机、Epic 或其他 PC 入口，Steam 更像是换了一个平台容器，而不是重开一条独立进度线。国服账号迁移到 Steam 仍不应默认视为已支持；详细服务器区别参考国服 vs 国际服对比页。"
              : "Steam should now be treated as part of the global-side PC entry flow. In practice, if you already play on the global publishing track through mobile, Epic, or another PC route, Steam behaves more like a new platform container than a separate progression line. CN account migration still should not be assumed supported. See the CN vs Global page for server differences."}
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "六、现在更适合选 Steam 吗？" : "6. Should You Choose Steam Now?"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "更适合选 Steam，如果……" : "Choose Steam if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你主力 PC 且偏好 Steam 生态" : "You're a PC main who prefers Steam"}</li>
                <li>{isZh ? "在意 Steam 成就、好友列表、创意工坊" : "You value achievements, friends, workshop"}</li>
                <li>{isZh ? "想把 PC 游戏库统一放在 Steam" : "You want your PC library consolidated in Steam"}</li>
              </ul>
            </div>
            <div className="rounded-lg bg-sky-500/5 border border-sky-500/20 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "未必非 Steam 不可，如果……" : "Steam is optional if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你现在就想玩，独立启动器/Epic 已开放" : "You want to play now — launcher/Epic are live"}</li>
                <li>{isZh ? "你主力移动端" : "You play mainly on mobile"}</li>
                <li>{isZh ? "对 Steam 生态没有强偏好" : "You don't care about Steam features"}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { href: `/${lang}/system-requirements`, label: isZh ? "完整系统要求" : "Full System Requirements" },
            { href: `/${lang}/cn-vs-global`, label: isZh ? "国服 vs 国际服" : "CN vs Global" },
            { href: `/${lang}/blog/cloud-yihuan-pc-guide`, label: isZh ? "云异环 PC 说明" : "Cloud PC Guide" },
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

        <FaqSection faqs={faqs} locale={locale} />
      </main>
    </>
  );
}
