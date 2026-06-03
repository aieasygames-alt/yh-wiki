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
    ? (locale === "tw" ? "異環兌換碼（2026年6月）— 國服/國際服禮包碼大全、前瞻直播碼即時更新" : "异环兑换码（2026年6月）— 国服/国际服礼包码大全、前瞻直播码实时更新")
    : "NTE Redeem Codes (June 2026) — All Active Codes, Livestream & Platform Codes";
  const description = isZh
    ? (locale === "tw" ? "異環(NTE)最新兌換碼與禮包碼即時更新（2026年6月）。國服和國際服所有有效碼，含B站/TapTap/抖音平台專屬碼，免費領取環石等獎勵。" : "异环(NTE)最新兑换码与礼包码实时更新（2026年6月）。国服和国际服所有有效码，含B站/TapTap/抖音平台专属码，免费领取环石等奖励。")
    : "All working Neverness to Everness redeem codes (June 2026) including platform codes for Bilibili, TapTap, Douyin. Updated daily for Global & CN servers.";

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
        { question: "异环最新兑换码有哪些？", questionZh: "异环最新兑换码有哪些？", answer: "当前有效兑换码包括平台专属码（YHBILIBILI0423、YHTAPTAP0423、YHDOUYIN0423）和通用码（NTEFREE、RHWMKHRWQ等）。具体奖励和过期时间请查看上方列表。", answerZh: "当前有效兑换码包括平台专属码（YHBILIBILI0423、YHTAPTAP0423、YHDOUYIN0423）和通用码（NTEFREE、RHWMKHRWQ等）。具体奖励和过期时间请查看上方列表。" },
        { question: "异环兑换码在哪里输入？", questionZh: "异环兑换码在哪里输入？", answer: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效兑换码即可领取奖励。", answerZh: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效兑换码即可领取奖励。" },
      ]
    : [
        { question: "What are the NTE 1.1 livestream redeem codes?", questionZh: "What are the NTE 1.1 livestream redeem codes?", answer: "The 1.1 livestream revealed 3 Global codes: DREAMWALK0603, TOMATO100, and RACENOLIMIT. They expire May 25, 2026 — redeem them now.", answerZh: "The 1.1 livestream revealed 3 Global codes: DREAMWALK0603, TOMATO100, and RACENOLIMIT. They expire May 25, 2026 — redeem them now." },
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
            ? (locale === "tw" ? "最後檢查：2026年5月24日" : "最后检查：2026年5月24日")
            : "Last checked: May 24, 2026"}
        </p>
      </div>
      <RedeemCodesClient lang={lang} />
    </>
  );
}
