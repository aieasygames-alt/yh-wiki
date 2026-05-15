import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "explorer.title"),
    description: t(locale, "explorer.description"),
    alternates: hreflangAlternates("explorer", lang),
    openGraph: {
      title: t(locale, "explorer.title"),
      description: t(locale, "explorer.description"),
      type: "website",
    },
  };
}

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
