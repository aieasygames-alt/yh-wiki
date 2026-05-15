import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "gachaAnalyzer.seoTitle"),
    description: t(locale, "gachaAnalyzer.seoDescription"),
    alternates: hreflangAlternates("gacha-analyzer", lang),
    openGraph: {
      title: t(locale, "gachaAnalyzer.seoTitle"),
      description: t(locale, "gachaAnalyzer.seoDescription"),
      type: "website",
    },
  };
}

export default function GachaAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
