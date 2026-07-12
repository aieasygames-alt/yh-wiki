import { hreflangAlternates, t, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "buildCalculator.seoTitle"),
    description: t(locale, "buildCalculator.seoDescription"),
    alternates: hreflangAlternates("calculator/build", lang),
    openGraph: {
      title: t(locale, "buildCalculator.seoTitle"),
      description: t(locale, "buildCalculator.seoDescription"),
      type: "website",
    },
  };
}

export default function BuildCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
