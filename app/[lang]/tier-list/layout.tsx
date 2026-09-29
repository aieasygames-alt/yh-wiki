import { asLocale, hreflangAlternates, isZhLocale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = asLocale(lang);
  const title = isZhLocale(locale)
    ? (locale === "tw" ? "異環角色對比檔案｜歷史場景評級" : "异环角色对比档案｜历史场景评级")
    : "NTE Character Comparison Archive | Historical Tier Context";
  const description = isZhLocale(locale)
    ? (locale === "tw"
      ? "異環角色歷史場景評級資料，整理綜合、深淵、異象與大世界對照。抽取或投入前請以目標區服客戶端為準。"
      : "异环角色历史场景评级资料，整理综合、深渊、异象与大世界对照。抽取或投入前请以目标区服客户端为准。")
    : "Historical NTE character comparison across overall, Abyss, Anomaly, and Open World contexts. Verify the target server's client before pulling or investing.";
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
