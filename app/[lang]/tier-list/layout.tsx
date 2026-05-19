import { hreflangAlternates, t, LOCALES } from "../../../lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title: t(lang, "tierList.seoTitle"),
    description: t(lang, "tierList.seoDescription"),
    alternates: hreflangAlternates("tier-list", lang),
    openGraph: {
      title: t(lang, "tierList.seoTitle"),
      description: t(lang, "tierList.seoDescription"),
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
