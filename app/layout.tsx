import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nteguide.com"),
  title: {
    default: "异环 Wiki - 角色数据库 · 材料查询 · 养成计算器",
    template: "%s | 异环 Wiki",
  },
  description:
    "异环游戏数据库和工具站，提供角色升级材料查询、养成计算器等实用工具。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
