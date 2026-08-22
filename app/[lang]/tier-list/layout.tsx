import { asLocale, hreflangAlternates, t } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = asLocale(lang);
  const title = locale === "en"
    ? "NTE Tier List (August 2026) - Best Characters, Builds & Teams"
    : t(locale, "tierList.seoTitle");
  const description = locale === "en"
    ? "Updated NTE tier list for Neverness to Everness: best characters by overall, Abyss, Anomaly, and Open World performance, with build and team links."
    : t(locale, "tierList.seoDescription");
  return {
    title,
    description,
    alternates: hreflangAlternates("tier-list", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function TierListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
