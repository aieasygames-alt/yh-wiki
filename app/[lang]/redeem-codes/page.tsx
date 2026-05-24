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
    ? (locale === "tw" ? "異環兌換碼（2026年5月）— 1.1直播碼/國際服碼即時更新" : "异环兑换码（2026年5月）— 1.1直播码/国际服码实时更新")
    : "NTE Redeem Codes (May 2026) — All Active Codes & 1.1 Livestream Codes";
  const description = isZh
    ? (locale === "tw" ? "異環(NTE)最新兌換碼，包含1.1直播碼DREAMWALK0603等。國服和國際服即時更新，免費領取環石等獎勵。" : "异环(NTE)最新兑换码，包含1.1直播码DREAMWALK0603等。国服和国际服实时更新，免费领取环石等奖励。")
    : "All working Neverness to Everness redeem codes (May 2026) including 1.1 livestream codes DREAMWALK0603, TOMATO100 & RACENOLIMIT. Updated daily for Global & CN servers.";

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
        { question: "异环1.1直播兑换码有哪些？", questionZh: "异环1.1直播兑换码有哪些？", answer: "1.1前瞻直播公布了3个国际服兑换码：DREAMWALK0603、TOMATO100、RACENOLIMIT，有效期至2026年5月25日。请尽快兑换。", answerZh: "1.1前瞻直播公布了3个国际服兑换码：DREAMWALK0603、TOMATO100、RACENOLIMIT，有效期至2026年5月25日。请尽快兑换。" },
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
