import { hreflangAlternates, t, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "statsCalc.seoTitle"),
    description: t(locale, "statsCalc.seoDescription"),
    alternates: hreflangAlternates("calculator/stats", lang),
    openGraph: {
      title: t(locale, "statsCalc.seoTitle"),
      description: t(locale, "statsCalc.seoDescription"),
      type: "website",
    },
  };
}

export default function StatsCalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
