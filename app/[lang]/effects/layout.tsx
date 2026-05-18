import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "effects.seoTitle"),
    description: t(locale, "effects.seoDescription"),
    alternates: hreflangAlternates("effects", lang),
    openGraph: {
      title: t(locale, "effects.seoTitle"),
      description: t(locale, "effects.seoDescription"),
      type: "website",
    },
  };
}

export default function EffectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
