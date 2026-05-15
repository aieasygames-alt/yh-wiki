import { hreflangAlternates, t, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "calculator.title"),
    description: t(locale, "calculator.description"),
    alternates: hreflangAlternates("calculator/leveling", lang),
  };
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
