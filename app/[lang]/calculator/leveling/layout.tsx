import { hreflangAlternates, t, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "calculator.seoTitle"),
    description: t(locale, "calculator.seoDescription"),
    alternates: hreflangAlternates("calculator/leveling", lang),
    openGraph: {
      title: t(locale, "calculator.seoTitle"),
      description: t(locale, "calculator.seoDescription"),
      type: "website",
    },
  };
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
