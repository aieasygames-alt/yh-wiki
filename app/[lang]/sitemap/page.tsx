import { Metadata } from "next";
import Link from "next/link";
import { isZhLocale, Locale, hreflangAlternates, t, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  const title = isZhLocale(locale)
    ? (locale === "tw" ? "網站地圖" : "网站地图")
    : "Sitemap";

  return {
    title,
    description: isZhLocale(locale)
      ? "NTE Guide 网站地图 — 快速找到你需要的攻略、工具和资源。"
      : "NTE Guide sitemap — quickly find the guides, tools, and resources you need.",
    alternates: hreflangAlternates("sitemap", lang),
  };
}

const SECTIONS = [
  {
    key: "tools",
    items: [
      { href: "/{lang}/tier-list", zhLabel: "角色强度榜", enLabel: "Tier List" },
      { href: "/{lang}/calculator", zhLabel: "升级计算器", enLabel: "Leveling Calculator" },
      { href: "/{lang}/gacha", zhLabel: "抽卡模拟器", enLabel: "Gacha Simulator" },
      { href: "/{lang}/banners", zhLabel: "卡池时间表", enLabel: "Banner Schedule" },
      { href: "/{lang}/gacha-analyzer", zhLabel: "抽卡记录分析", enLabel: "Gacha Analyzer" },
      { href: "/{lang}/teams", zhLabel: "配队推荐", enLabel: "Team Builder" },
      { href: "/{lang}/map", zhLabel: "互动地图", enLabel: "Interactive Map" },
    ],
  },
  {
    key: "database",
    items: [
      { href: "/{lang}/characters", zhLabel: "角色数据库", enLabel: "Characters" },
      { href: "/{lang}/weapons", zhLabel: "武器数据库", enLabel: "Weapons" },
      { href: "/{lang}/vehicles", zhLabel: "载具数据库", enLabel: "Vehicles" },
      { href: "/{lang}/disk-sets", zhLabel: "碟片套装", enLabel: "Disk Sets" },
      { href: "/{lang}/materials", zhLabel: "材料图鉴", enLabel: "Materials" },
      { href: "/{lang}/bosses", zhLabel: "BOSS图鉴", enLabel: "Bosses" },
      { href: "/{lang}/anomalies", zhLabel: "异常区", enLabel: "Anomaly Zones" },
      { href: "/{lang}/locations", zhLabel: "地点图鉴", enLabel: "Locations" },
      { href: "/{lang}/lore", zhLabel: "世界观", enLabel: "Lore" },
    ],
  },
  {
    key: "guides",
    items: [
      { href: "/{lang}/guides/beginner-guide", zhLabel: "新手攻略", enLabel: "Beginner Guide" },
      { href: "/{lang}/guides/gacha-system", zhLabel: "抽卡系统", enLabel: "Gacha System" },
      { href: "/{lang}/guides/team-building", zhLabel: "配队攻略", enLabel: "Team Building" },
      { href: "/{lang}/guides/download-install-guide", zhLabel: "下载安装", enLabel: "Download & Install" },
      { href: "/{lang}/guides/vehicle-system-guide", zhLabel: "载具系统", enLabel: "Vehicle System" },
      { href: "/{lang}/guides/reroll-guide-detailed", zhLabel: "初始刷号", enLabel: "Reroll Guide" },
      { href: "/{lang}/guides/optimal-settings", zhLabel: "最佳设置", enLabel: "Optimal Settings" },
    ],
  },
  {
    key: "compare",
    items: [
      { href: "/{lang}/compare/nte-vs-genshin", zhLabel: "异环 vs 原神", enLabel: "NTE vs Genshin" },
      { href: "/{lang}/compare/nte-vs-wuthering-waves", zhLabel: "异环 vs 鸣潮", enLabel: "NTE vs WuWa" },
      { href: "/{lang}/compare/nte-vs-zzz", zhLabel: "异环 vs 绝区零", enLabel: "NTE vs ZZZ" },
      { href: "/{lang}/compare/nte-vs-ananta", zhLabel: "异环 vs 无限大", enLabel: "NTE vs Ananta" },
      { href: "/{lang}/compare/games-like-nte", zhLabel: "类似异环的游戏", enLabel: "Games Like NTE" },
    ],
  },
  {
    key: "blog",
    items: [
      { href: "/{lang}/blog", zhLabel: "攻略博客（全部）", enLabel: "Blog (All Posts)" },
      { href: "/{lang}/faq", zhLabel: "常见问题", enLabel: "FAQ" },
      { href: "/{lang}/redeem-codes", zhLabel: "兑换码大全", enLabel: "Redeem Codes" },
      { href: "/{lang}/changelog", zhLabel: "版本更新日志", enLabel: "Changelog" },
    ],
  },
  {
    key: "info",
    items: [
      { href: "/{lang}/about", zhLabel: "关于我们", enLabel: "About" },
      { href: "/{lang}/contact", zhLabel: "联系我们", enLabel: "Contact" },
      { href: "/{lang}/system-requirements", zhLabel: "配置要求", enLabel: "System Requirements" },
      { href: "/{lang}/troubleshooting", zhLabel: "故障排查", enLabel: "Troubleshooting" },
      { href: "/{lang}/privacy-policy", zhLabel: "隐私政策", enLabel: "Privacy Policy" },
      { href: "/{lang}/terms", zhLabel: "服务条款", enLabel: "Terms of Service" },
    ],
  },
];

const SECTION_TITLES: Record<string, { zh: string; en: string }> = {
  tools: { zh: "工具", en: "Tools" },
  database: { zh: "数据库", en: "Database" },
  guides: { zh: "攻略指南", en: "Guides" },
  compare: { zh: "游戏对比", en: "Game Comparisons" },
  blog: { zh: "内容", en: "Content" },
  info: { zh: "信息", en: "Information" },
};

export default async function SitemapPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: t(locale, "terms.breadcrumbHome"), href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "網站地圖" : "网站地图") : "Sitemap" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isZhLocale(locale) ? (locale === "tw" ? "網站地圖" : "网站地图") : "Sitemap"}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {isZhLocale(locale)
          ? "NTE Guide 所有页面一览，快速找到你需要的攻略和工具。"
          : "All pages on NTE Guide. Quickly find the guides and tools you need."}
      </p>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.key} className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {isZhLocale(locale) ? SECTION_TITLES[section.key].zh : SECTION_TITLES[section.key].en}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href.replace("{lang}", lang)}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors py-1"
                >
                  {isZhLocale(locale) ? item.zhLabel : item.enLabel}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 text-xs text-gray-600">
        {isZhLocale(locale)
          ? `共 ${SECTIONS.reduce((acc, s) => acc + s.items.length, 0)} 个页面 | 最后更新: 2026-05-12`
          : `${SECTIONS.reduce((acc, s) => acc + s.items.length, 0)} pages total | Last updated: 2026-05-12`}
      </div>
    </div>
  );
}
