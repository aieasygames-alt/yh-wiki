import Link from "next/link";
import type { Metadata } from "next";
import { t, isZhLocale, type Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { QuickAnswerCard } from "../../../components/QuickAnswerCard";
import { FaqSection } from "../../../components/FaqSection";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? "异环国服 vs 国际服区别对比：上线时间、卡池顺序、定价、评分全解析（2026）"
    : "NTE CN vs Global Server: Launch Dates, Banner Order, Pricing & Ratings Compared (2026)";
  const description = isZhLocale(locale)
    ? "异环国服和国际服（全球服）有什么区别？本文对比两个服务器的上线时间差、卡池顺序、定价、TapTap评分（7.0 vs 9.0）、内容差异，帮你决定玩哪个服。"
    : "What's the difference between NTE's CN server and global server? This guide compares launch dates, banner order, pricing, TapTap ratings (7.0 vs 9.0), and content differences to help you pick a server.";
  return {
    title,
    description,
    alternates: hreflangAlternates("cn-vs-global", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function CnVsGlobalPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);

  const faqs = [
    {
      question: "Which server should I play NTE on, CN or global?",
      questionZh: "异环玩国服还是国际服好？",
      answer: "If you read Chinese and want the earliest content updates, play CN — patches land about 8 days earlier. If you prefer English UI, lower review-score pressure, or play with non-CN friends, pick global. Both servers have the same gacha system (no 50/50, 90-pull pity).",
      answerZh: "看得懂中文、想最早体验新内容建议玩国服——每个版本比全球服早约8天上线。偏好英文界面、不太在意评分压力、或和朋友一起玩的建议选国际服。两个服务器的抽卡机制完全一致（无50/50、90抽保底）。",
    },
    {
      question: "Why did NTE CN launch later than global?",
      questionZh: "异环国服为什么比国际服晚上线？",
      answer: "NTE's global server launched April 29, 2026, while the CN server launched April 23 — actually CN went first for the 1.0 launch. The 8-day gap from 1.1 onward is due to separate review and operations cadences between Hotta Studio's two publishing tracks.",
      answerZh: "其实1.0公测时国服（4月23日）比全球服（4月29日）早上线。从1.1开始全球服反而更早，约8天时差，原因是完美世界 Hotta Studio 两条发行线的审核和运营节奏不同。",
    },
    {
      question: "Is NTE CN server rating really lower than global?",
      questionZh: "异环国服评分真的比国际服低吗？",
      answer: "Yes. As of mid-2026, TapTap CN scores NTE at 7.0 (55k+ ratings) while the global server sits at 9.0 (660+ ratings). CN players are notably harsher on mobile optimization, the AI-art controversy, and the 'rabbit hole bug' enforcement double standard. Global players have been more forgiving overall.",
      answerZh: "是的。截至2026年中，TapTap国服评分7.0（5.6万+评价），国际服9.0（661+评价）。国服玩家对移动端优化、AI素材争议、兔子洞BUG执法双标等问题更苛刻，国际服玩家整体更宽容。",
    },
    {
      question: "Can I transfer my NTE account between CN and global?",
      questionZh: "异环国服和国际服账号能互通吗？",
      answer: "No. CN and global are separate servers with separate accounts, separate gacha history, and separate data. You cannot transfer progress, characters, or purchases between them. Pick one server and stick with it.",
      answerZh: "不能。国服和国际服是完全独立的服务器，账号、抽卡记录、数据都不互通，无法转移进度、角色或充值。选好一个服务器就长期玩下去。",
    },
  ];

  return (
    <>
      <ArticleJsonLd
        title={isZh ? "异环国服 vs 国际服区别对比" : "NTE CN vs Global Server Comparison"}
        description={isZh ? "上线时间、卡池、定价、评分差异" : "Launch dates, banners, pricing, ratings"}
        url={`https://nteguide.com/${lang}/cn-vs-global`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "国服 vs 国际服" : "CN vs Global" },
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-primary-400 mb-3">
            {isZh ? "2026-06-19 更新" : "Updated June 19, 2026"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? "异环国服 vs 国际服：到底有什么区别？" : "NTE CN vs Global Server: What's the Difference?"}
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            {isZh
              ? "异环同时运营国服（完美世界发行）和国际服两个独立服务器。新玩家最常问的就是该选哪个服。本文从上线时间、卡池顺序、定价、评分、内容差异五个维度完整对比，帮你做出选择。"
              : "Neverness to Everness runs two separate servers — CN (published by Perfect World) and global. New players' most common question is which server to pick. This guide compares them across launch dates, banner order, pricing, ratings, and content differences so you can decide."}
          </p>
        </section>

        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZh ? "1.0 公测：" : "1.0 Launch:",
              value: isZh ? "国服 4/23，全球服 4/29（国服先开）" : "CN Apr 23, Global Apr 29 (CN first)",
            },
            {
              label: isZh ? "1.1+ 时差：" : "1.1+ Gap:",
              value: isZh ? "全球服比国服早约 8 天" : "Global ~8 days ahead of CN",
            },
            {
              label: isZh ? "TapTap 评分：" : "TapTap Rating:",
              value: isZh ? "国服 7.0（5.6万+）vs 国际服 9.0（661+）" : "CN 7.0 (55k+) vs Global 9.0 (660+)",
            },
            {
              label: isZh ? "账号互通：" : "Account Shared:",
              value: isZh ? "不互通，无法转移" : "No — separate, non-transferable",
            },
          ]}
        />

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "一、上线时间对比" : "1. Launch Dates"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="text-left p-3">{isZh ? "版本" : "Version"}</th>
                  <th className="text-left p-3">{isZh ? "国服" : "CN Server"}</th>
                  <th className="text-left p-3">{isZh ? "国际服" : "Global Server"}</th>
                  <th className="text-left p-3">{isZh ? "时差" : "Gap"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="p-3">1.0 公测</td><td className="p-3">2026-04-23</td><td className="p-3">2026-04-29</td><td className="p-3 text-amber-400">{isZh ? "国服早6天" : "CN 6d earlier"}</td></tr>
                <tr><td className="p-3">1.1 游梦洄廊</td><td className="p-3">2026-05-28</td><td className="p-3">2026-06-03</td><td className="p-3 text-amber-400">{isZh ? "国服早6天" : "CN 6d earlier"}</td></tr>
                <tr><td className="p-3">1.2 九百九十九夜</td><td className="p-3">2026-07-02</td><td className="p-3">2026-07-09</td><td className="p-3 text-amber-400">{isZh ? "国服早约1周" : "CN ~1wk earlier"}</td></tr>
                <tr><td className="p-3">1.3（预计）</td><td className="p-3">2026-07 上旬</td><td className="p-3">2026-07 中旬</td><td className="p-3 text-gray-500">{isZh ? "待定" : "TBD"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {isZh
              ? "注意：1.0 时国服先开，但从 1.2 开始全球服反超先开。推测是两个发行线的审核节奏差异。"
              : "Note: CN launched first for 1.0, but from 1.2 onward global leads. Likely due to different review cadences between the two publishing tracks."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "二、卡池顺序与日期" : "2. Banner Schedule"}</h2>
          <p className="text-gray-400 mb-3 leading-relaxed">
            {isZh
              ? "两个服务器的卡池角色顺序基本一致，但因为版本上线时间错开，具体日期会相差约 8 天。以 1.2 为例："
              : "Both servers run the same banner character order, but dates shift ~8 days due to staggered version launches. Version 1.2 example:"}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="text-left p-3">{isZh ? "卡池" : "Banner"}</th>
                  <th className="text-left p-3">{isZh ? "国服日期" : "CN Dates"}</th>
                  <th className="text-left p-3">{isZh ? "国际服日期" : "Global Dates"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="p-3">{isZh ? "上半：伊洛伊" : "Phase 1: Illica"}</td><td className="p-3">6/11 – 6/25</td><td className="p-3">6/3 – 6/17</td></tr>
                <tr><td className="p-3">{isZh ? "下半：真红" : "Phase 2: Zhenhong"}</td><td className="p-3">6/25 – 7/15</td><td className="p-3">6/17 – 7/1</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            <Link href={`/${lang}/banners`} className="text-primary-400 hover:text-primary-300">
              {isZh ? "→ 查看完整卡池时间表" : "→ Full banner schedule"}
            </Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "三、评分差异：为什么国服更严苛？" : "3. Rating Gap: Why Is CN Harsher?"}</h2>
          <p className="text-gray-400 mb-3 leading-relaxed">
            {isZh
              ? "TapTap 评分是两个服务器最直观的差异——国服 7.0 vs 国际服 9.0，落差超过 2 分。这种差异主要来自三方面："
              : "TapTap ratings show the most visible server gap — CN 7.0 vs global 9.0, a 2-point chasm. The gap comes from three main factors:"}
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="pl-4 border-l-2 border-primary-500/40">
              <strong className="text-gray-200">{isZh ? "移动端优化反馈更集中" : "Mobile optimization complaints concentrate on CN"}</strong>
              <p className="text-sm mt-1">{isZh ? "国服移动端玩家占比更高，闪退/掉帧/发热问题反馈更密集。" : "CN has a higher mobile player share, so crash/lag/heat complaints are denser."}</p>
            </li>
            <li className="pl-4 border-l-2 border-primary-500/40">
              <strong className="text-gray-200">{isZh ? "AI 素材争议国际影响更大" : "AI-art controversy hit global harder internationally"}</strong>
              <p className="text-sm mt-1">{isZh ? "但在国服被本地化为对'诚意'的质疑，评分冲击更直接。" : "But locally translated into a 'sincerity' question on CN, hitting scores directly."}</p>
            </li>
            <li className="pl-4 border-l-2 border-primary-500/40">
              <strong className="text-gray-200">{isZh ? "「兔子洞」BUG 执法双标" : "'Rabbit Hole' bug enforcement double standard"}</strong>
              <p className="text-sm mt-1">{isZh ? "5月国服最大公关危机，选择性回收被指执法不一，重创口碑。" : "CN's biggest PR crisis in May — selective rollbacks seen as inconsistent enforcement, damaging reputation."}</p>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "四、定价与付费" : "4. Pricing & Payments"}</h2>
          <p className="text-gray-400 leading-relaxed">
            {isZh
              ? "抽卡机制两个服务器完全一致（无 50/50、90 抽保底、限定池保底继承）。定价方面国服按人民币定价，国际服按美元/欧元/日元等本地货币定价，月卡和通行证的实际汇率换算后差异通常在 5% 以内。两个服务器的氪金强度档位一致。"
              : "The gacha system is identical on both servers (no 50/50, 90-pull pity, limited banner pity carries over). Pricing: CN is in CNY, global in USD/EUR/JPY etc. Monthly passes and battle passes convert within ~5% after FX. Spend tiers match across servers."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "五、内容差异" : "5. Content Differences"}</h2>
          <ul className="space-y-2 text-gray-400">
            <li>{isZh ? "✅ 核心玩法、角色、剧情、地图 — 两个服务器完全一致" : "✅ Core gameplay, characters, story, maps — identical on both"}</li>
            <li>{isZh ? "✅ 联动活动 — 基本同步（如保时捷 918 联动）" : "✅ Collaborations — mostly synced (e.g. Porsche 918)"}</li>
            <li>{isZh ? "⚠️ 部分支线/文本本地化细节 — 因审核要求有细微差异" : "⚠️ Some side quests / text localization — minor differences due to review requirements"}</li>
            <li>{isZh ? "⚠️ 兑换码 — 国服和国际服码不通用，需分别领取" : "⚠️ Redeem codes — CN and global codes are NOT shared; claim separately"}</li>
            <li>{isZh ? "❌ 账号、数据、好友 — 完全不互通" : "❌ Accounts, data, friends — completely separate"}</li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "选择建议" : "Which to Pick?"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
              <h3 className="font-semibold text-emerald-300 mb-2">{isZh ? "选国服，如果……" : "Pick CN if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你看懂中文，偏好中文社区" : "You read Chinese and prefer CN communities"}</li>
                <li>{isZh ? "想最早体验新版本内容" : "You want content earliest"}</li>
                <li>{isZh ? "朋友在国服" : "Friends play CN"}</li>
                <li>{isZh ? "习惯人民币付费" : "You prefer CNY pricing"}</li>
              </ul>
            </div>
            <div className="rounded-lg bg-sky-500/5 border border-sky-500/20 p-4">
              <h3 className="font-semibold text-sky-300 mb-2">{isZh ? "选国际服，如果……" : "Pick Global if…"}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>{isZh ? "你偏好英文界面或非中文社区" : "You prefer English UI / non-CN communities"}</li>
                <li>{isZh ? "不太在意 TapTap 评分压力" : "TapTap CN rating pressure doesn't bother you"}</li>
                <li>{isZh ? "朋友在国际服" : "Friends play global"}</li>
                <li>{isZh ? "习惯美元/欧元等本地货币付费" : "You prefer USD/EUR/local currency pricing"}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            { href: `/${lang}/banners`, label: isZh ? "卡池时间表" : "Banner Schedule" },
            { href: `/${lang}/redeem-codes`, label: isZh ? "兑换码（区分服）" : "Redeem Codes (by server)" },
            { href: `/${lang}/changelog`, label: isZh ? "版本更新日志" : "Version Changelog" },
            { href: `/${lang}/steam`, label: isZh ? "Steam 版发售" : "Steam Version" },
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
