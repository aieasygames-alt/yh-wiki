import { hreflangAlternates, t, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "buildCalculator.title"),
    description: t(locale, "buildCalculator.description"),
    alternates: hreflangAlternates("calculator/build", lang),
  };
}

export default function BuildCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
