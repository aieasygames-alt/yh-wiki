import { hreflangAlternates, isZhLocale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title:
      isZhLocale(lang)
        ? "异环抽卡记录分析器 — 保底追踪、运气统计 | NTE Wiki"
        : "NTE Gacha Pull Tracker — Pity Counter, Luck Stats | NTE Guide",
    description:
      isZhLocale(lang)
        ? "记录你的异环真实抽卡结果，追踪每个卡池的保底进度，统计分析你的运气指数和投入成本。"
        : "Track your Neverness to Everness gacha pulls, monitor pity counters per banner, and analyze your luck stats and spending.",
    alternates: hreflangAlternates("gacha-analyzer", lang),
    openGraph: {
      title:
        isZhLocale(lang)
          ? "异环抽卡记录分析器 | NTE Wiki"
          : "NTE Gacha Pull Tracker | NTE Guide",
      description:
        isZhLocale(lang)
          ? "记录抽卡结果，追踪保底进度，分析运气指数"
          : "Record pulls, track pity, analyze your luck",
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
