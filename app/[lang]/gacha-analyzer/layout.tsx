import { hreflangAlternates, t, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const description = locale === "en"
    ? "Record your own NTE pull results and export local data. This tool does not verify current pity, rates, carry-over, or banner pools; use the target server's in-game details and official notices."
    : locale === "tw"
      ? "記錄自己的異環抽卡結果並匯出本地資料；本工具不驗證目前保底、機率、繼承或卡池，請以目標區服遊戲內詳情和官方公告為準。"
      : "记录自己的异环抽卡结果并导出本地数据；本工具不验证当前保底、概率、继承或卡池，请以目标区服游戏内详情和官方公告为准。";
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
