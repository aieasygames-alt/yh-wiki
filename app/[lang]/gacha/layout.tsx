import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "gacha.seoTitle"),
    description: t(locale, "gacha.seoDescription"),
    alternates: hreflangAlternates("gacha", lang),
    openGraph: {
      title: t(locale, "gacha.seoTitle"),
      description: t(locale, "gacha.seoDescription"),
      type: "website",
    },
  };
}

export default function GachaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
