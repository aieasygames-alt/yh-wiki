import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { RedeemCodesClient } from "./RedeemCodesClient";

const FAQ_DATA = {
  zh: [
    { q: "异环兑换码在哪里输入？怎么用？", a: "进入游戏后，点击右上角头像 → 设置 → 兑换码输入框，输入有效的兑换码即可领取奖励。" },
    { q: "异环1.1前瞻直播兑换码有哪些？", a: "1.1版本前瞻直播（5月23日）公布了3个兑换码：DREAMWALK0603、TOMATO100、RACENOLIMIT，有效期至5月25日23:59。" },
    { q: "异环公测兑换码还能用吗？", a: "公测期兑换码（NTENOWTOENJOY、NTENANALLYGO、NTE0429等）已全部过期。请关注后续直播和活动获取新码。" },
    { q: "异环新兑换码在哪里获取？", a: "新兑换码通常在官方前瞻直播中公布，也会通过社交媒体活动和合作渠道发放。本页面会第一时间更新。" },
  ],
  tw: [
    { q: "異環兌換碼怎麼用？在哪裡輸入？", a: "進入遊戲後，點擊右上角頭像 → 設定 → 兌換碼輸入框，輸入有效的兌換碼即可領取獎勵。" },
    { q: "異環1.1前瞻直播兌換碼有哪些？", a: "1.1版本前瞻直播（5月23日）公布了3個兌換碼：DREAMWALK0603、TOMATO100、RACENOLIMIT，有效期至5月25日23:59。" },
    { q: "異環公測兌換碼還能用嗎？", a: "公測期兌換碼（NTENOWTOENJOY、NTENANALLYGO、NTE0429等）已全部過期。請關注後續直播和活動獲取新碼。" },
    { q: "異環新兌換碼在哪裡獲取？", a: "新兌換碼通常在官方前瞻直播中公布，也會透過社群媒體活動和合作管道發放。本頁面會第一時間更新。" },
  ],
  en: [
    { q: "How to redeem codes in Neverness to Everness?", a: "Launch the game, tap your profile icon (top-right) → Settings → enter the code in the Redeem Code field." },
    { q: "What are the latest NTE redeem codes from the 1.1 livestream?", a: "The 1.1 livestream (May 23) released 3 codes: DREAMWALK0603, TOMATO100, and RACENOLIMIT, valid until May 25 23:59." },
    { q: "Do NTE redeem codes expire?", a: "Yes, all redeem codes have expiration dates. Launch-era codes have expired. New codes are released during livestreams." },
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
