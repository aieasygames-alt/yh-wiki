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
    "NTE redeem codes", "NTE builds",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
