import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import redeemCodesData from "../../../data/redeem-codes.json";
import charactersData from "../../../data/characters.json";
import blogData from "../../../data/blog.json";
import { RedeemCodesClient } from "./RedeemCodesClient";

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
  const isZh = isZhLocale(locale);
  const title = isZh
    ? (locale === "tw" ? "異環兌換碼（2026年7月）— 999 Nights、Shinku與國際服禮包碼" : "异环兑换码（2026年7月）— 999 Nights、Shinku与国际服礼包码")
    : "NTE Redeem Codes (July 2026) — 999 Nights, Shinku & All Active Codes";
  const description = isZh
    ? (locale === "tw" ? "異環(NTE) 2026年7月可用兌換碼彙總，包含999NIGHTS、SHINKU0708、IROI0729、LACRIMOSA0603等活動碼與常駐碼，整理獎勵、伺服器與兌換入口。" : "异环(NTE) 2026年7月可用兑换码汇总，包含999NIGHTS、SHINKU0708、IROI0729、LACRIMOSA0603等活动码与常驻码，整理奖励、服务器与兑换入口。")
    : "All working NTE redeem codes for July 2026, including 999NIGHTS, SHINKU0708, IROI0729, LACRIMOSA0603, permanent codes, rewards, regions, and redemption steps.";

  return {
    title,
    description,
    alternates: hreflangAlternates("redeem-codes", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function RedeemCodesPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const codes = redeemCodesData as Array<{
    code: string;
    reward: string;
    rewardEn: string;
    status: "active" | "expired" | "unknown";
    expiresAt: string;
    source: string;
    region: "cn" | "global";
    revealedAt?: string;
  }>;
  const topChars = (charactersData as Array<{
    id: string;
    name: string;
    nameEn: string;
    attribute: string;
    tierRank?: string;
    image?: string;
  }>).filter((character) => character.tierRank === "SS" || character.tierRank === "S+").slice(0, 8);
  const latestPosts = [...(blogData as Array<{
    id: string;
    title: string;
    titleEn: string;
    summary: string;
    summaryEn: string;
    category: string;
    categoryEn: string;
    date: string;
  }>)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const faqs = isZhLocale(locale)
    ? [
        { question: "异环7月最新兑换码有哪些？", questionZh: "异环7月最新兑换码有哪些？", answer: "当前重点可用码包括999NIGHTS、SHINKU0708、IROI0729、LACRIMOSA0603、NTEFREE、NTEWINFONS、NTEFUNGAME和NTENENE。部分旧平台码已过期，建议优先兑换7月活动码。", answerZh: "当前重点可用码包括999NIGHTS、SHINKU0708、IROI0729、LACRIMOSA0603、NTEFREE、NTEWINFONS、NTEFUNGAME和NTENENE。部分旧平台码已过期，建议优先兑换7月活动码。" },
        { question: "异环兑换码在哪里输入？", questionZh: "异环兑换码在哪里输入？", answer: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效兑换码即可领取奖励。", answerZh: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效兑换码即可领取奖励。" },
      ]
    : [
        { question: "What are the active NTE codes for July 2026?", questionZh: "What are the active NTE codes for July 2026?", answer: "Priority July codes include 999NIGHTS, SHINKU0708, IROI0729, LACRIMOSA0603, plus permanent codes such as NTEFREE, NTEWINFONS, NTEFUNGAME, and NTENENE. Redeem event codes first in case they expire without notice.", answerZh: "Priority July codes include 999NIGHTS, SHINKU0708, IROI0729, LACRIMOSA0603, plus permanent codes such as NTEFREE, NTEWINFONS, NTEFUNGAME, and NTENENE. Redeem event codes first in case they expire without notice." },
        { question: "How to redeem codes in Neverness to Everness?", questionZh: "How to redeem codes in Neverness to Everness?", answer: "Launch the game, tap your profile icon → Settings → enter the code in the Redeem Code field. Redeem immediately to avoid expiration.", answerZh: "Launch the game, tap your profile icon → Settings → enter the code in the Redeem Code field. Redeem immediately to avoid expiration." },
      ];

  return (
    <>
      <ArticleJsonLd
        title={isZhLocale(locale) ? "异环兑换码" : "NTE Redeem Codes — All Active Codes Updated Daily"}
        description={isZhLocale(locale) ? "异环最新兑换码实时更新" : "All working Neverness to Everness redeem codes, updated daily"}
        url={`https://nteguide.com/${lang}/redeem-codes`}
      />
      <FaqPageJsonLd faqs={faqs} lang={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.redeemCodes") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-1">
        <p className="text-xs text-gray-500">
          {isZhLocale(locale)
            ? (locale === "tw" ? "最後檢查：2026年7月10日" : "最后检查：2026年7月10日")
            : "Last checked: July 10, 2026"}
        </p>
      </div>
      <section className="max-w-4xl mx-auto px-4 pb-4">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? "這頁兌換碼怎麼看最快？" : "这页兑换码怎么看最快？")
              : "What is the fastest way to use this codes page?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(locale)
              ? (locale === "tw"
                ? "先看有效碼，再按國際服或國服篩選，最後優先兌換活動碼和近期公開的新碼。這樣比逐條手動試更省時間，也更不容易把已過期或不同伺服器的禮包碼混在一起。"
                : "先看有效码，再按国际服或国服筛选，最后优先兑换活动码和近期公开的新码。这样比逐条手动试更省时间，也更不容易把已过期或不同服务器的礼包码混在一起。")
              : "Start with active codes, then filter by Global or CN server, and redeem event or recently revealed codes first. This is much faster than testing everything manually and helps you avoid mixing expired or wrong-region rewards."}
          </p>
        </div>
      </section>
      <RedeemCodesClient lang={lang} codes={codes} topChars={topChars} latestPosts={latestPosts} />
      <section className="max-w-4xl mx-auto px-4 pb-12 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "兌換前先確認" : "兑换前先确认")
                : "Check this before redeeming"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "伺服器對不對，很多碼只限特定區服。" : "服务器对不对，很多码只限特定区服。") : "Make sure the server matches, because many codes are region-specific."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "活動碼通常比常駐碼更容易先過期。" : "活动码通常比常驻码更容易先过期。") : "Event codes usually expire earlier than permanent ones."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "如果遊戲內提示失敗，先排除大小寫和多餘空格。" : "如果游戏内提示失败，先排除大小写和多余空格。") : "If redemption fails, rule out capitalization and extra spaces first."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(locale)
                ? (locale === "tw" ? "常見誤區" : "常见误区")
                : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(locale) ? (locale === "tw" ? "只看社群轉發，不核對最後檢查時間。" : "只看社群转发，不核对最后检查时间。") : "Using reposted social posts without checking the last verification date."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "把同名角色活動和不同區服碼混為一談。" : "把同名角色活动和不同区服码混为一谈。") : "Mixing event promotions with codes from another server region."}</li>
              <li>{isZhLocale(locale) ? (locale === "tw" ? "看到過期就忽略獎勵規律，錯過下一輪活動判斷。" : "看到过期就忽略奖励规律，错过下一轮活动判断。") : "Ignoring expired-code patterns and missing clues for the next campaign drop."}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
