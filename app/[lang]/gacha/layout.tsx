import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title: t(locale, "gacha.title"),
    description: t(locale, "gacha.description"),
    alternates: hreflangAlternates("gacha", lang),
  };
}

export default function GachaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
