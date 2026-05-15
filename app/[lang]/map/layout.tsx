import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "mapPage.seoTitle"),
    description: t(locale, "mapPage.seoDescription"),
    alternates: hreflangAlternates("map", lang),
    openGraph: {
      title: t(locale, "mapPage.seoTitle"),
      description: t(locale, "mapPage.seoDescription"),
      type: "website",
    },
  };
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
