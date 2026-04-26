import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nteguide.com"),
  title: {
    default: "Neverness to Everness Wiki & Calculator - Characters, Guides, Tools",
    template: "%s | NTE Guide",
  },
  description:
    "Neverness to Everness (NTE) Wiki & tools. Character builds, tier lists, leveling calculator, guides, and redeem codes. Complete resource for NTE players.",
  keywords: [
    "Neverness to Everness", "NTE", "NTE guide", "NTE wiki",
    "NTE characters", "NTE tier list", "NTE calculator",
    "NTE redeem codes", "NTE builds", "NTE download",
    "异环", "异环游戏", "异环攻略", "异环角色", "异环强度榜",
    "异环兑换码", "异环抽卡", "异环配队", "异环Wiki", "异环官网",
    "异环国际服", "异环下载", "异环地图工具", "异环官网下载",
    "異環", "異環攻略", "異環兌換碼", "異環Wiki",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  other: {
    "msvalidate.01": "1FDBEDECCADE86F6C58D3B85E9492A14",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
