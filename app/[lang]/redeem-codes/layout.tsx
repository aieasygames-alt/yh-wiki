import { t, hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: t(locale, "redeemCodes.title"),
    description: t(locale, "redeemCodes.description"),
    alternates: hreflangAlternates("redeem-codes"),
    openGraph: {
      title: t(locale, "redeemCodes.title"),
      description: t(locale, "redeemCodes.description"),
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
