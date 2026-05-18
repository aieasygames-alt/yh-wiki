import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "teamBuilder.seoTitle"),
    description: t(locale, "teamBuilder.seoDescription"),
    alternates: hreflangAlternates("team-builder", lang),
    openGraph: {
      title: t(locale, "teamBuilder.seoTitle"),
      description: t(locale, "teamBuilder.seoDescription"),
      type: "website",
    },
  };
}

export default function TeamBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
