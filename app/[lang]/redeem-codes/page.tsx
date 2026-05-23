import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
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
