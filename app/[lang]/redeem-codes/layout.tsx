import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title:
      isZhLocale(lang)
        ? "异环兑换码大全(2026年4月) - 最新兑换码 | NTE Guide"
        : "Neverness to Everness Redeem Codes (April 2026) - NTE Guide",
    description:
      isZhLocale(lang)
        ? "异环最新可用兑换码汇总（2026年4月更新），持续更新中。"
        : "Neverness to Everness redeem codes (April 2026). All active codes with rewards. Updated regularly.",
    alternates: hreflangAlternates("redeem-codes", lang),
    openGraph: {
      title:
        isZhLocale(lang)
          ? "异环兑换码大全(2026年4月)"
          : "NTE Redeem Codes (April 2026)",
      description:
        isZhLocale(lang)
          ? "异环最新可用兑换码汇总"
          : "All active Neverness to Everness redeem codes",
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
