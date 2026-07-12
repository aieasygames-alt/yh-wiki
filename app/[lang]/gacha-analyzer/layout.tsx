import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const description = locale === "en"
    ? "Record NTE pulls, track pity across banner types, review 4-star and 5-star history, and export your gacha data to plan future pulls with less guesswork."
    : locale === "tw"
      ? "記錄異環抽卡結果、追蹤各卡池保底進度、回看四星與五星出貨歷史，並匯出資料輔助你規劃後續抽卡。"
      : "记录异环抽卡结果、追踪各卡池保底进度、回看四星与五星出货历史，并导出数据辅助你规划后续抽卡。";
  return {
    title: t(locale, "gachaAnalyzer.seoTitle"),
    description,
    alternates: hreflangAlternates("gacha-analyzer", lang),
    openGraph: {
      title: t(locale, "gachaAnalyzer.seoTitle"),
      description,
      type: "website",
    },
  };
}

export default function GachaAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
