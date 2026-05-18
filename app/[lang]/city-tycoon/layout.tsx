import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "cityTycoon.seoTitle"),
    description: t(locale, "cityTycoon.seoDescription"),
    alternates: hreflangAlternates("city-tycoon", lang),
    openGraph: {
      title: t(locale, "cityTycoon.seoTitle"),
      description: t(locale, "cityTycoon.seoDescription"),
      type: "website",
    },
  };
}

export default function CityTycoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
