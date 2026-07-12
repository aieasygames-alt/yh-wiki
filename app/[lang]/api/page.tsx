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
  const endpointCount = ENDPOINTS.length;
  const description = localizedText(
    locale,
    `NTE Guide 公开 API 文档，当前提供 ${endpointCount} 个 JSON 数据入口，覆盖角色、兑换码、搜索索引与站点地图，适合社区工具、攻略站和第三方应用接入。`,
    `NTE Guide public API docs with ${endpointCount} JSON endpoints covering characters, redeem codes, search index, and sitemap resources for community tools and third-party apps.`
  );

  return {
    title,
    description,
    alternates: hreflangAlternates("api", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
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
  const endpointCount = ENDPOINTS.length;

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
          ? `NTE Guide 提供 ${endpointCount} 个公开 JSON 数据接口，供社区工具和第三方应用使用。`
          : `NTE Guide provides ${endpointCount} public JSON data endpoints for community tools and third-party applications.`}
      </p>
      <p className="text-gray-600 mb-8 text-xs">
        Base URL: <code className="text-primary-400">https://nteguide.com</code>
      </p>

      <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
        <h2 className="text-lg font-semibold text-white">
          {localizedText(locale, "这页 API 文档最适合怎么用？", "How should you use this API docs page?")}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-300">
          {localizedText(
            locale,
            "先确认你要接入的是角色、兑换码、搜索还是站点结构数据，再按接口用途选择缓存策略。这个页面最适合快速确认公开字段入口和使用范围，不适合把它当成完整的 SDK 或实时服务说明。",
            "Start by deciding whether you need character, redeem-code, search, or sitemap data, then choose a caching strategy per endpoint. This page is best for confirming public data entry points and usage scope, not for treating as a full SDK or real-time service spec."
          )}
        </p>
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-base font-semibold text-white">
            {localizedText(locale, "接入前先看什么", "What should you check before integrating?")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{localizedText(locale, "先确认你的工具需要静态快照数据还是需要高频刷新的状态数据。", "Confirm whether your tool needs snapshot-style static data or frequently refreshed state data.")}</li>
            <li>{localizedText(locale, "公开接口更适合内容站、索引工具和轻量查询，不适合高并发实时依赖。", "Public endpoints are better for content sites, indexes, and lightweight lookup than for high-concurrency real-time dependencies.")}</li>
            <li>{localizedText(locale, "上线前建议先做本地缓存与降级兜底，避免源站更新节奏影响你的产品。", "Add local caching and fallback handling before launch so upstream refresh cycles do not break your product.")}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-base font-semibold text-white">
            {localizedText(locale, "常见误区", "Common mistakes")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{localizedText(locale, "把公开 JSON 文档页当成稳定版本化 API，而不自己做字段兼容处理。", "Treating public JSON feeds like a versioned enterprise API without your own compatibility layer.")}</li>
            <li>{localizedText(locale, "不缓存搜索索引和角色数据，结果重复请求过多。", "Skipping caching for search or character data and sending unnecessary repeated requests.")}</li>
            <li>{localizedText(locale, "只看接口路径，不核对内容用途与更新频率。", "Checking endpoint paths without validating content purpose or refresh expectations.")}</li>
          </ul>
        </div>
      </section>

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
