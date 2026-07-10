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
  const title = localizedText(locale, "异环 Steam 版：2026年7月22日发售、PC配置要求、与移动端区别全解析", "NTE on Steam: July 22 2026 Release, PC Specs & Mobile vs PC Differences");
  const description = localizedText(locale, "异环 Steam 版 2026 年 7 月 22 日发售。本文覆盖 Steam 版发售时间、PC 最低/推荐配置、与移动端的画面与操作差异、跨平台账号互通、以及 Steam 版值不值得等要点。", "Neverness to Everness launches on Steam July 22, 2026. This guide covers the Steam release date, PC minimum/recommended specs, visual and control differences vs mobile, cross-platform account sharing, and whether the Steam version is worth it.");
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
      answer: "NTE's Steam version is scheduled to release on July 22, 2026. This is a key node for PC players who prefer the Steam ecosystem over the standalone launcher or Epic.",
      "answerZh": "异环 Steam 版预计 2026 年 7 月 22 日发售。这是偏好 Steam 平台的 PC 玩家的关键节点，相比独立启动器或 Epic 更方便。"
    },
    {
      question: "Will my NTE account work on Steam?",
      questionZh: "异环 Steam 版能用现有账号吗？",
      answer: "The Steam version is expected to integrate with the global server account system. You should be able to log in with your existing global account and keep your progress. CN server accounts will not transfer to Steam. Wait for official confirmation closer to launch.",
      "answerZh": "Steam 版预计接入国际服账号体系，可以用现有的国际服账号登录并保留进度。国服账号无法转移到 Steam。具体以临近发售时的官方确认为准。"
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
      "answer": "If you play primarily on PC and prefer Steam's ecosystem (achievements, friend list, workshop potential), waiting is reasonable. If you want to play now, the standalone launcher and Epic versions are already available with the same content. Steam is a platform preference, not a content gate.",
      "answerZh": "如果你主要在 PC 上玩、且偏好 Steam 生态（成就、好友、创意工坊潜力），等 Steam 版是合理的。如果想现在就玩，独立启动器和 Epic 版本已经上线，内容完全一致。Steam 是平台偏好，不是内容门槛。"
    },
  ];

  return (
    <>
      <ArticleJsonLd
        title={isZh ? "异环 Steam 版发售指南" : "NTE on Steam — Release Guide"}
        description={isZh ? "Steam 版发售时间、PC配置、跨平台账号" : "Steam release date, PC specs, cross-platform account"}
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
            {isZh ? "2026-06-19 更新" : "Updated June 19, 2026"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? "异环 Steam 版：7 月 22 日发售完整指南" : "NTE on Steam: Complete July 22 Release Guide"}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {isZh
              ? "异环（Neverness to Everness）Steam 版定于 2026 年 7 月 22 日发售，是 PC 玩家的下一个关键节点。本文覆盖发售时间、PC 配置要求、与移动端差异、跨平台账号互通，以及 Steam 版值不值得等。"
              : "Neverness to Everness lands on Steam July 22, 2026 — the next key milestone for PC players. This guide covers the release date, PC spec requirements, differences vs mobile, cross-platform account sharing, and whether the Steam version is worth waiting for."}
          </p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "发售日期：" : "Release:",
              value: isZh ? "2026 年 7 月 22 日" : "July 22, 2026"
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
              value: isZh ? "预计接入国际服账号" : "Expected: global account"
            },
          ]}
        />

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "一、发售时间" : "1. Release Date"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "异环 Steam 版定于 2026 年 7 月 22 日发售。这个时间点落在 1.2 版本（6/11-7/15）和 1.3 版本（预计 7 月中旬）之间，意味着 Steam 版上线时很可能直接是 1.3 或 1.2 末期内容。国服 Steam 上线安排需以官方后续公告为准。"
              : "NTE's Steam version is set for July 22, 2026. This falls between v1.2 (Jun 11 – Jul 15) and v1.3 (expected mid-July), meaning Steam players will likely land in v1.3 or late v1.2 content. CN server Steam availability will be confirmed by official notices."}
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
          <h2 className="text-2xl font-bold mb-4">{isZh ? "四、跨平台账号" : "4. Cross-Platform Account"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "Steam 版预计接入国际服账号体系——你现有的国际服账号（手机/Epic/PS5 上注册的）应该可以直接登录 Steam 版并保留所有进度、角色和抽卡记录。国服账号无法迁移到 Steam。具体登录方式以临近发售时的官方公告为准。详细的服务器区别参考国服 vs 国际服对比页。"
              : "The Steam version is expected to integrate with the global server account system — your existing global account (registered on mobile/Epic/PS5) should log into Steam directly, keeping all progress, characters, and gacha history. CN server accounts cannot migrate to Steam. Exact login flow will be confirmed closer to launch. See the CN vs Global page for server differences."}
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "Steam 版值得等吗？" : "Is the Steam Version Worth Waiting For?"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "值得等，如果……" : "Worth waiting if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你主力 PC 且偏好 Steam 生态" : "You're a PC main who prefers Steam"}</li>
                <li>{isZh ? "在意 Steam 成就、好友列表、创意工坊" : "You value achievements, friends, workshop"}</li>
                <li>{isZh ? "现在没急着想玩，等正式版更稳" : "You're not in a rush and want stability"}</li>
              </ul>
            </div>
            <div className="rounded-lg bg-sky-500/5 border border-sky-500/20 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "不用等，如果……" : "No need to wait if…"}</h3>
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
            { href: `/${lang}/changelog`, label: isZh ? "版本更新日志" : "Version Changelog" },
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
