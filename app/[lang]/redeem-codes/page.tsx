import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { FaqPageJsonLd } from "../../../components/JsonLd";
import { RedeemCodesClient } from "./RedeemCodesClient";

const FAQ_DATA = {
  zh: [
    { q: "异环兑换码在哪里输入？怎么用？", a: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效的兑换码即可领取奖励。" },
    { q: "异环国际服兑换码有哪些？", a: "目前国际服有效兑换码包括 NTENOWTOENJOY、NTENANALLYGO、NTE0429 等，有效期至2026年5月。" },
    { q: "异环兑换码过期了怎么办？", a: "兑换码有使用期限，过期后无法使用。请关注官方直播和社群活动获取新兑换码。" },
    { q: "异环前瞻直播兑换码有哪些？", a: "公测前瞻直播公布了国服和国际服兑换码，后续直播活动可能发布更多兑换码。" },
  ],
  tw: [
    { q: "異環兌換碼怎麼用？在哪裡輸入？", a: "進入遊戲後，點擊右上角頭像 → 設定 → 兌換碼輸入框，輸入有效的兌換碼即可領取獎勵。" },
    { q: "異環國際服兌換碼有哪些？", a: "目前國際服有效兌換碼包括 NTENOWTOENJOY、NTENANALLYGO、NTE0429 等，有效期至2026年5月。" },
    { q: "異環兌換碼過期了怎麼辦？", a: "兌換碼有使用期限，過期後無法使用。請關注官方直播和社群活動獲取新兌換碼。" },
    { q: "異環前瞻直播兌換碼有哪些？", a: "公測前瞻直播公布了國服和國際服兌換碼，後續直播活動可能發布更多兌換碼。" },
  ],
  en: [
    { q: "How to redeem codes in Neverness to Everness?", a: "Launch the game, tap your profile icon (top-right) → Settings → enter the code in the Redeem Code field." },
    { q: "What are the active NTE redeem codes for Global server?", a: "Active Global codes include NTENOWTOENJOY, NTENANALLYGO, and NTE0429, valid through May 2026." },
    { q: "Do NTE redeem codes expire?", a: "Yes, all redeem codes have expiration dates. Redeem them as soon as possible." },
    { q: "Where do I find new NTE redeem codes?", a: "New codes are announced during official livestreams and social media events. This page is updated in real-time." },
  ],
};

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
    ? (locale === "tw" ? "異環兌換碼（2026年5月）— 所有可用兌換碼即時更新" : "异环兑换码（2026年5月）— 所有可用兑换码实时更新")
    : "NTE Redeem Codes (May 2026) — All Active Codes Updated Daily";
  const description = isZh
    ? (locale === "tw" ? "異環(NTE)最新兌換碼，包含國服和國際服。即時更新，免費領取環石、攻略等獎勵。" : "异环(NTE)最新兑换码，包含国服和国际服。实时更新，免费领取环石、攻略等奖励。")
    : "All working Neverness to Everness redeem codes (May 2026). Updated daily with new codes for Global & CN servers. Free Ring Stones, guides, and more.";

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

  const faqSource = isZhLocale(locale)
    ? (locale === "tw" ? FAQ_DATA.tw : FAQ_DATA.zh)
    : FAQ_DATA.en;

  return (
    <>
      <FaqPageJsonLd
        faqs={faqSource.map((f) => ({
          question: f.q,
          answer: f.a,
          questionEn: f.q,
          answerEn: f.a,
        }))}
        lang={locale}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.redeemCodes") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-1">
        <p className="text-xs text-gray-500">
          {isZhLocale(locale)
            ? (locale === "tw" ? "最後檢查：2026年5月23日" : "最后检查：2026年5月23日")
            : "Last checked: May 23, 2026"}
        </p>
      </div>
      <RedeemCodesClient lang={lang} />
    </>
  );
}
