import { notFound } from "next/navigation";
import { type Locale, LOCALES, isZhLocale, hreflangAlternates } from "../../../../../lib/i18n";
import RegionGuideClient from "./RegionGuideClient";
import mapData from "../../../../../data/map-markers.json";
import { completeMetaDescription, localizedText } from "../../../../../lib/seo-copy";

export const dynamic = "force-static";

const VALID_REGIONS = [
  "new-herland",
  "bridge-crossings",
  "unheard-shores",
  "miguel-district",
  "illusion-town",
  "fogden",
  "duskmoor",
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
      zh: "新赫兰德历史标记资料：记录中的谕石、收集品、Boss、商家与地图字段；当前坐标和可用性请以客户端为准。",
      tw: "新赫蘭德歷史標記資料：記錄中的諭石、收集品、Boss、商家與地圖欄位；目前座標和可用性請以客戶端為準。",
      en: "Historical New Herland marker reference for recorded Oracle Stones, collectibles, bosses, shops, and map fields. Verify current coordinates and availability in the client.",
    },
    "bridge-crossings": {
      zh: "桥间地历史标记资料：记录中的谕石、收集品、任务、商家与地图字段；当前坐标和可用性请以客户端为准。",
      tw: "橋間地歷史標記資料：記錄中的諭石、收集品、任務、商家與地圖欄位；目前座標和可用性請以客戶端為準。",
      en: "Historical Bridge Crossings marker reference for recorded Oracle Stones, collectibles, quests, shops, and map fields. Verify current coordinates and availability in the client.",
    },
    "unheard-shores": {
      zh: "未闻浦历史标记资料：记录中的谕石、收集品、Boss、景点与地图字段；当前坐标和可用性请以客户端为准。",
      tw: "未聞浦歷史標記資料：記錄中的諭石、收集品、Boss、景點與地圖欄位；目前座標和可用性請以客戶端為準。",
      en: "Historical Unheard Shores marker reference for recorded Oracle Stones, collectibles, bosses, viewpoints, and map fields. Verify current coordinates and availability in the client.",
    },
    "miguel-district": {
      zh: "米格尔区历史标记资料：记录中的谕石、收集品、Boss、商家与地图字段；当前坐标和可用性请以客户端为准。",
      tw: "米格爾區歷史標記資料：記錄中的諭石、收集品、Boss、商家與地圖欄位；目前座標和可用性請以客戶端為準。",
      en: "Historical Miguel District marker reference for recorded Oracle Stones, collectibles, bosses, shops, and map fields. Verify current coordinates and availability in the client.",
    },
    "illusion-town": {
      zh: "绘空町历史标记资料：记录中的谕石、收集品、Boss、商家与地图字段；当前坐标和可用性请以客户端为准。",
      tw: "繪空町歷史標記資料：記錄中的諭石、收集品、Boss、商家與地圖欄位；目前座標和可用性請以客戶端為準。",
      en: "Historical Illusion Town marker reference for recorded Oracle Stones, collectibles, bosses, shops, and map fields. Verify current coordinates and availability in the client.",
    },
    fogden: {
      zh: "Fogden历史区域资料：记录中的剧情、异象、活动与收集字段；当前版本状态请以客户端为准。",
      tw: "Fogden歷史區域資料：記錄中的劇情、異象、活動與收集欄位；目前版本狀態請以客戶端為準。",
      en: "Historical Fogden region reference for recorded story, anomaly, event, and collection fields. Verify current version status in the client.",
    },
    duskmoor: {
      zh: "Duskmoor历史区域资料：记录中的载具、活动与收集字段；当前版本状态请以客户端为准。",
      tw: "Duskmoor歷史區域資料：記錄中的載具、活動與收集欄位；目前版本狀態請以客戶端為準。",
      en: "Historical Duskmoor region reference for recorded vehicle, event, and collection fields. Verify current version status in the client.",
    },
  };

  const desc = completeMetaDescription(locale, descriptions[regionId]?.[lang] || descriptions[regionId]?.[isZh ? "zh" : "en"] || "");

  return {
    title: isZh
      ? localizedText(locale, `${regionName}历史标记资料 - 地图字段参考`, "")
      : `${regionName} Historical Marker Reference | Neverness to Everness`,
    description: desc,
    alternates: hreflangAlternates(`map/region/${regionId}`, lang),
    openGraph: {
      title: isZh
        ? localizedText(locale, `${regionName}历史标记资料`, "")
        : `${regionName} Historical Marker Reference`,
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
