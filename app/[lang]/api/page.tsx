import { Metadata } from "next";
import { isZhLocale, Locale, hreflangAlternates, t, LOCALES } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { localizedText } from "../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  const title = localizedText(locale, "API 文档", "API Documentation");

  return {
    title,
    description: localizedText(
      locale,
      "NTE Guide 公开 API 文档，提供角色、武器、材料、兑换码、搜索索引和站点地图等 JSON 数据接口，适合社区工具、攻略站与第三方应用接入。",
      "NTE Guide public API documentation for JSON data endpoints covering characters, weapons, materials, redeem codes, search index, and sitemaps for community tools and third-party apps."
    ),
    alternates: hreflangAlternates("api", lang),
  };
}

const ENDPOINTS = [
  {
    path: "/api/characters.json",
    zhDesc: "全角色数据库（41角色），含属性、稀有度、技能、Tier排名等",
    enDesc: "Full character database (41 chars) with attributes, rarity, skills, tier ranking",
    method: "GET",
  },
  {
    path: "/api/redeem-codes.json",
    zhDesc: "兑换码列表，含状态、奖励、过期时间、区服",
    enDesc: "Redeem codes list with status, rewards, expiry, and region",
    method: "GET",
  },
  {
    path: "/search-index.json",
    zhDesc: "全站搜索索引（角色、武器、攻略、FAQ等）",
    enDesc: "Site-wide search index (characters, weapons, guides, FAQs, etc.)",
    method: "GET",
  },
  {
    path: "/sitemap.xml",
    zhDesc: "XML 站点地图索引",
    enDesc: "XML sitemap index",
    method: "GET",
  },
];

export default async function ApiDocsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: t(locale, "terms.breadcrumbHome"), href: `/${lang}` },
          { label: isZhLocale(locale) ? "API 文档" : "API Docs" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {isZhLocale(locale) ? "API 文档" : "API Documentation"}
      </h1>
      <p className="text-gray-500 mb-2 text-sm">
        {isZhLocale(locale)
          ? "NTE Guide 提供公开的 JSON 数据接口，供社区工具和第三方应用使用。"
          : "NTE Guide provides public JSON data endpoints for community tools and third-party applications."}
      </p>
      <p className="text-gray-600 mb-8 text-xs">
        Base URL: <code className="text-primary-400">https://nteguide.com</code>
      </p>

      <div className="space-y-4">
        {ENDPOINTS.map((ep) => (
          <div
            key={ep.path}
            className="rounded-xl border border-gray-800 bg-gray-900/30 p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono">
                {ep.method}
              </span>
              <code className="text-sm text-primary-400 font-mono">{ep.path}</code>
            </div>
            <p className="text-sm text-gray-400">
              {isZhLocale(locale) ? ep.zhDesc : ep.enDesc}
            </p>
            <div className="mt-2">
              <a
                href={ep.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
              >
                {isZhLocale(locale) ? "查看示例 →" : "View example →"}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
        <h2 className="text-lg font-bold text-white mb-3">
          {isZhLocale(locale) ? "使用条款" : "Usage Terms"}
        </h2>
        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
          <li>
            {isZhLocale(locale)
              ? "所有数据仅供个人和非商业用途"
              : "All data is for personal and non-commercial use only"}
          </li>
          <li>
            {isZhLocale(locale)
              ? "请勿高频请求，建议本地缓存数据"
              : "Please avoid high-frequency requests; cache data locally"}
          </li>
          <li>
            {isZhLocale(locale)
              ? "数据版权归 Hotta Studio / Perfect World 所有"
              : "Game data is copyrighted by Hotta Studio / Perfect World"}
          </li>
          <li>
            {isZhLocale(locale)
              ? "引用时请注明来源 nteguide.com"
              : "Please credit nteguide.com when using our data"}
          </li>
        </ul>
      </div>

      <div className="mt-6 text-xs text-gray-600">
        {isZhLocale(locale)
          ? "有问题请联系 contact@nteguide.com"
          : "Questions? Contact contact@nteguide.com"}
      </div>
    </div>
  );
}
