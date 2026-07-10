import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
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
      <RedeemCodesClient lang={lang} />
    </>
  );
}
