import { notFound } from "next/navigation";
import { type Locale, LOCALES, isZhLocale, hreflangAlternates } from "../../../../../lib/i18n";
import RegionGuideClient from "./RegionGuideClient";
import mapData from "../../../../../data/map-markers.json";
import { localizedText } from "../../../../../lib/seo-copy";

export const dynamic = "force-static";

const VALID_REGIONS = [
  "new-herland",
  "bridge-crossings",
  "unheard-shores",
  "miguel-district",
  "illusion-town",
];

export function generateStaticParams() {
  return VALID_REGIONS.flatMap((region) => LOCALES.map((lang) => ({ lang, region })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; region: string };
}) {
  const { lang, region: regionId } = await params;
  if (!VALID_REGIONS.includes(regionId)) return {};

  const regionInfo = (mapData as { regions: Record<string, { zh: string; en: string }> }).regions[regionId];
  const isZh = isZhLocale(lang);
  const locale = lang as Locale;
  const regionName = localizedText(locale, regionInfo.zh, regionInfo.en);

  const descriptions: Record<string, Record<string, string>> = {
    "new-herland": {
      zh: "新赫兰德完整探索攻略：全谕石位置、收集品分布、BOSS挑战、商家一览，附详细标记地图。",
      tw: "新赫蘭德完整探索攻略：全諭石位置、收集品分佈、BOSS挑戰、商家一覽，附詳細標記地圖。",
      en: "Complete New Herland exploration guide: all Oracle Stone locations, collectibles, bosses, shops, with detailed marker map.",
    },
    "bridge-crossings": {
      zh: "桥间地完整探索攻略：全谕石位置、收集品分布、任务指引、商家一览，附详细标记地图。",
      tw: "橋間地完整探索攻略：全諭石位置、收集品分佈、任務指引、商家一覽，附詳細標記地圖。",
      en: "Complete Bridge Crossings exploration guide: all Oracle Stone locations, collectibles, quests, shops, with detailed marker map.",
    },
    "unheard-shores": {
      zh: "未闻浦完整探索攻略：全谕石位置、收集品分布、BOSS挑战、景点打卡，附详细标记地图。",
      tw: "未聞浦完整探索攻略：全諭石位置、收集品分佈、BOSS挑戰、景點打卡，附詳細標記地圖。",
      en: "Complete Unheard Shores exploration guide: all Oracle Stone locations, collectibles, bosses, viewpoints, with detailed marker map.",
    },
    "miguel-district": {
      zh: "米格尔区完整探索攻略：全谕石位置、收集品分布、BOSS挑战、商家一览，附详细标记地图。",
      tw: "米格爾區完整探索攻略：全諭石位置、收集品分佈、BOSS挑戰、商家一覽，附詳細標記地圖。",
      en: "Complete Miguel District exploration guide: all Oracle Stone locations, collectibles, bosses, shops, with detailed marker map.",
    },
    "illusion-town": {
      zh: "绘空町完整探索攻略：全谕石位置、收集品分布、BOSS挑战、商家一览，附详细标记地图。",
      tw: "繪空町完整探索攻略：全諭石位置、收集品分佈、BOSS挑戰、商家一覽，附詳細標記地圖。",
      en: "Complete Illusion Town exploration guide: all Oracle Stone locations, collectibles, bosses, shops, with detailed marker map.",
    },
  };

  const desc = descriptions[regionId]?.[lang] || descriptions[regionId]?.[isZh ? "zh" : "en"] || "";

  return {
    title: isZh
      ? localizedText(locale, `${regionName}探索攻略 - 全资源标记地图`, "")
      : `${regionName} Exploration Guide - All Resource Map | Neverness to Everness`,
    description: desc,
    alternates: hreflangAlternates(`map/region/${regionId}`, lang),
    openGraph: {
      title: isZh
        ? localizedText(locale, `${regionName}探索攻略 - 全标记地图`, "")
        : `${regionName} Exploration Guide - All Marker Map`,
      description: desc,
      type: "article",
    },
  };
}

export default async function RegionGuidePage({
  params,
}: {
  params: { lang: string; region: string };
}) {
  const { lang, region: regionId } = await params;

  if (!VALID_REGIONS.includes(regionId)) {
    notFound();
  }

  return <RegionGuideClient lang={(lang || "zh") as Locale} regionId={regionId} />;
}
