import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const isTw = locale === "tw";

  const title = isTw
    ? "異環兌換碼大全（2026年4月）— 最新禮包碼/序號 | NTE Guide"
    : isZh
      ? "异环兑换码大全（2026年4月）— 最新礼包码实时更新 | NTE Guide"
      : "Neverness to Everness Redeem Codes (April 2026) - NTE Guide";
  const description = isTw
    ? "異環(NTE)最新可用兌換碼/禮包碼/序號匯總（2026年4月更新），包含國服和國際服。持續更新中。"
    : isZh
      ? "异环(NTE)最新可用兑换码汇总（2026年4月更新），国服和国际服礼包码实时更新，含兑换方法和奖励详情。"
      : "Neverness to Everness redeem codes (April 2026). All active codes with rewards for CN & Global servers. Updated regularly.";

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

export default function RedeemCodesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
