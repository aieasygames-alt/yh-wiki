import { hreflangAlternates, t, Locale } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(
    locale,
    t(locale, "cityTycoon.seoTitle"),
    t(locale, "cityTycoon.seoTitle"),
    "異環都市大亨繁中攻略 - 免費S級小吱與經營獎勵"
  );
  const description = localizedText(
    locale,
    t(locale, "cityTycoon.seoDescription"),
    t(locale, "cityTycoon.seoDescription"),
    "異環都市大亨繁中攻略：Lv.30 免費取得S級小吱與專屬武器，整理經營升級、全等級獎勵、資源投入順序與每日收益技巧。"
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("city-tycoon", lang),
    openGraph: {
      title,
      description,
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
