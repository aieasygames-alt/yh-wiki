import Link from "next/link";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { LOCALES, hreflangAlternates, isZhLocale, type Locale } from "../../../lib/i18n";
import { getLatestLiveChangelog, getUpcomingChangelogs, getVersionSpotlightContent } from "../../../lib/queries";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const current = getLatestLiveChangelog();
  const currentVersion = current?.version ?? "1.x";
  const title = isZhLocale(locale)
    ? locale === "tw"
      ? `異環版本中心：1.3 ${currentVersion} 追蹤中心`
      : `异环版本中心：1.3 ${currentVersion} 追踪中心`
    : `NTE Version Center: v${currentVersion} (1.3 Tracking Hub)`;
  const description = isZhLocale(locale)
    ? locale === "tw"
      ? `集中查看異環現行版本、更新日誌、版本攻略、熱門角色與後續版本動向。當前追蹤版本為 ${currentVersion}。`
      : `集中查看异环当前版本、更新日志、版本攻略、热门角色与后续版本动向。当前追踪版本为 ${currentVersion}。`
    : `Track the current Neverness to Everness version, patch notes, version-specific guides, hot banner topics, and upcoming update watchpoints in one place.`;
  return {
    title,
    description,
    alternates: hreflangAlternates("version-center", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default async function VersionCenterPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const current = getLatestLiveChangelog();
  const currentVersion = current?.version ?? "1.x";
  const upcoming = getUpcomingChangelogs()[0];
  const spotlight = current ? getVersionSpotlightContent(current.version, 6) : [];

  const typeClass = (type?: string) => {
    switch (type) {
      case "major":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "minor":
        return "border-sky-500/30 bg-sky-500/10 text-sky-300";
      default:
        return "border-gray-700 bg-gray-800/60 text-gray-300";
    }
  };

  const itemKindLabel = (kind: "changelog" | "guide" | "blog") => {
    if (isZhLocale(locale)) {
      if (kind === "changelog") return locale === "tw" ? "更新日誌" : "更新日志";
      if (kind === "guide") return locale === "tw" ? "攻略" : "攻略";
      return locale === "tw" ? "文章" : "文章";
    }
    if (kind === "changelog") return "Patch Notes";
    if (kind === "guide") return "Guide";
    return "Post";
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? (locale === "tw" ? "首頁" : "首页") : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? (locale === "tw" ? "版本中心" : "版本中心") : "Version Center" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300">
            {isZhLocale(locale) ? (locale === "tw" ? "版本追蹤中樞" : "版本追踪中枢") : "Patch Tracking Hub"}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold">
            {isZhLocale(locale)
              ? locale === "tw"
                ? `異環版本中心：1.3 ${currentVersion} 追蹤中`
                : `异环版本中心：1.3 ${currentVersion} 追踪中`
              : `Neverness to Everness Version Center: v${currentVersion} (1.3 Tracking Hub)`}
          </h1>
          <p className="mt-3 text-gray-400">
            {isZhLocale(locale)
              ? locale === "tw"
                ? "把 1.3 現行版本、熱門攻略、抽卡話題與下一版本觀察點集中到同一頁，方便你每次回站都能快速找到現在最值得看的內容。"
                : "把 1.3 当前版本、热门攻略、抽卡话题与下一版本观察点集中到同一页，方便你每次回站都能快速找到现在最值得看的内容。"
              : "A single hub for the live patch, hot guides, banner decisions, and the next version watchlist so returning players can reorient quickly."}
          </p>
        </div>

        {current && (
          <section className="mt-8 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${typeClass(current.type)}`}>
                {isZhLocale(locale) ? (locale === "tw" ? "現行正式版本" : "当前正式版本") : "Current Live Version"}
              </span>
              <span className="text-sm text-gray-400">{current.date}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              {isZhLocale(locale)
                ? `${current.version} · ${locale === "tw" ? current.versionName : current.versionName}`
                : `v${current.version} · ${current.versionNameEn}`}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(isZhLocale(locale) ? current.highlights : current.highlightsEn)?.slice(0, 6).map((item) => (
                <div key={item} className="rounded-xl border border-gray-800/80 bg-gray-950/40 p-3 text-sm text-gray-300">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/changelog/${current.version}`}
                className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-300 transition-colors"
              >
                {isZhLocale(locale) ? (locale === "tw" ? "查看完整更新日誌" : "查看完整更新日志") : "Read Full Patch Notes"}
              </Link>
              <Link
                href={`/${lang}/banners`}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
              >
                {isZhLocale(locale) ? (locale === "tw" ? "卡池與角色時間表" : "卡池与角色时间表") : "Banner & Character Schedule"}
              </Link>
            </div>
          </section>
        )}

        {upcoming && (
          <section className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${typeClass(upcoming.type)}`}>
                {isZhLocale(locale) ? (locale === "tw" ? "下一版本觀察" : "下一版本观察") : "Next Version Watch"}
              </span>
              <span className="text-sm text-gray-400">{upcoming.date}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold">
              {isZhLocale(locale)
                ? `${upcoming.version} · ${upcoming.versionName}`
                : `v${upcoming.version} · ${upcoming.versionNameEn}`}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isZhLocale(locale)
                ? locale === "tw"
                  ? "這裡優先追蹤測試服、前瞻、卡池輪替與可能影響資源規劃的變動。若日期仍是待定，代表站內目前把它視為預告而非已落地正式內容。"
                  : "这里优先追踪测试服、前瞻、卡池轮替与可能影响资源规划的变动。若日期仍是待定，代表站内目前把它视为预告而非已落地正式内容。"
                : "Use this block to track preview signals, banner rotations, and resource-planning risks before the next version is actually live."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(isZhLocale(locale) ? upcoming.highlights : upcoming.highlightsEn)?.slice(0, 4).map((item) => (
                <span key={item} className="rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {isZhLocale(locale) ? (locale === "tw" ? "當前版本重點內容" : "当前版本重点内容") : "Current Patch Reading List"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {isZhLocale(locale)
                  ? (locale === "tw" ? "自動聚合帶有當前版本標記的攻略與文章，方便快速補課。" : "自动聚合带有当前版本标记的攻略与文章，方便快速补课。")
                  : "Auto-collected guides and posts tagged for the current live patch."}
              </p>
            </div>
            <Link href={`/${lang}/blog`} className="text-sm text-primary-400 hover:text-primary-300">
              {isZhLocale(locale) ? (locale === "tw" ? "看更多文章" : "看更多文章") : "More Posts"} →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {spotlight.map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                href={`/${lang}${item.href}`}
                className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-500/15 px-2.5 py-1 text-xs text-primary-300">
                    {itemKindLabel(item.kind)}
                  </span>
                  <time className="text-xs text-gray-500" dateTime={item.date}>{item.date}</time>
                </div>
                <h3 className="mt-3 text-base font-semibold">
                  {locale === "tw" ? (item.titleTw || item.title) : isZhLocale(locale) ? item.title : item.titleEn}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-400">
                  {locale === "tw" ? (item.summaryTw || item.summary) : isZhLocale(locale) ? item.summary : item.summaryEn}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              href: `/${lang}/changelog`,
              title: isZhLocale(locale) ? (locale === "tw" ? "全部版本日誌" : "全部版本日志") : "All Patch Notes",
              desc: isZhLocale(locale)
                ? (locale === "tw" ? "回看 1.0 到現在的更新節奏、活動與平衡調整。" : "回看 1.0 到现在的更新节奏、活动与平衡调整。")
                : "Review the release cadence, events, and balance changes from v1.0 onward.",
            },
            {
              href: `/${lang}/guides`,
              title: isZhLocale(locale) ? (locale === "tw" ? "版本攻略庫" : "版本攻略库") : "Patch Guide Library",
              desc: isZhLocale(locale)
                ? (locale === "tw" ? "角色、玩法、資源、地圖與開荒攻略集中入口。" : "角色、玩法、资源、地图与开荒攻略集中入口。")
                : "Central access to character, gameplay, resource, map, and progression guides.",
            },
            {
              href: `/${lang}/version-center`,
              title: isZhLocale(locale) ? (locale === "tw" ? "把這頁當首頁回站點" : "把这页当首页回站点") : "Use This as Your Return Hub",
              desc: isZhLocale(locale)
                ? (locale === "tw" ? "每次回站先看版本中心，再決定去抽卡、開荒還是查配置問題。" : "每次回站先看版本中心，再决定去抽卡、开荒还是查配置问题。")
                : "Start here on return visits before deciding whether you need banner advice, progression help, or troubleshooting.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 hover:border-primary-500/30 hover:bg-gray-900/60 transition-colors"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
