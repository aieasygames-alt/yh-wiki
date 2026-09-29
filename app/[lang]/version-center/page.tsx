import Link from "next/link";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { LOCALES, hreflangAlternates, isZhLocale, type Locale } from "../../../lib/i18n";
import { getLatestLiveChangelog, getUpcomingChangelogs, getVersionSpotlightContent } from "../../../lib/queries";
import operations from "../../../data/version-operations.json";
import { ContentStatus, type VerificationStatus } from "../../../components/ContentStatus";
import freshnessReport from "../../../public/content-freshness.json";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const latestRecorded = getLatestLiveChangelog();
  const latestRecordedVersion = latestRecorded?.version ?? "1.x";
  const title = isZhLocale(locale)
    ? locale === "tw"
      ? `異環版本資料中心：最後記錄 v${latestRecordedVersion}`
      : `异环版本资料中心：最后记录 v${latestRecordedVersion}`
    : `NTE Version Archive: Last Recorded v${latestRecordedVersion}`;
  const description = isZhLocale(locale)
    ? locale === "tw"
      ? `瀏覽異環歷史版本記錄、更新日誌與關聯資料。本站最後記錄版本為 ${latestRecordedVersion}；目前狀態請以目標區服客戶端與官方公告為準。`
      : `浏览异环历史版本记录、更新日志与关联资料。本站最后记录版本为 ${latestRecordedVersion}；当前状态请以目标区服客户端与官方公告为准。`
    : `Browse historical NTE version records, patch notes, and related references. The last recorded version is ${latestRecordedVersion}; verify the current state in the target server's client and official notices.`;
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
  const latestRecorded = getLatestLiveChangelog();
  const upcoming = getUpcomingChangelogs()[0];
  const spotlight = latestRecorded ? getVersionSpotlightContent(latestRecorded.version, 6) : [];
  const weeklyQueue = freshnessReport.weeklyQueue.slice(0, 6);

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

  const itemKindLabel = (kind: string) => {
    if (isZhLocale(locale)) {
      if (kind === "changelog") return locale === "tw" ? "更新日誌" : "更新日志";
      if (kind === "guide") return locale === "tw" ? "攻略" : "攻略";
      return locale === "tw" ? "文章" : "文章";
    }
    if (kind === "changelog") return "Patch Notes";
    if (kind === "guide") return "Guide";
    return "Post";
  };

  const priorityLabel = (priority: string) => {
    if (isZhLocale(locale)) {
      return ({ high: "高风险", medium: "中风险", low: "低风险" } as Record<string, string>)[priority] || "待评估";
    }
    return ({ high: "High risk", medium: "Medium risk", low: "Low risk" } as Record<string, string>)[priority] || "Needs assessment";
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
            {isZhLocale(locale) ? (locale === "tw" ? "歷史版本資料中心" : "历史版本资料中心") : "Historical Version Archive"}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold">
            {isZhLocale(locale)
              ? locale === "tw"
                ? `異環版本資料中心：最後記錄 v${latestRecorded?.version ?? "1.x"}`
                : `异环版本资料中心：最后记录 v${latestRecorded?.version ?? "1.x"}`
              : `Neverness to Everness Version Archive: Last Recorded v${latestRecorded?.version ?? "1.x"}`}
          </h1>
          <p className="mt-3 text-gray-400">
            {isZhLocale(locale)
              ? locale === "tw"
                ? "此頁整理站內最後記錄的版本條目、關聯文章與復核工作；它不是即時版本面板，也不能用來確認當前卡池、活動或角色可用性。"
                : "此页整理站内最后记录的版本条目、关联文章与复核工作；它不是实时版本面板，也不能用来确认当前卡池、活动或角色可用性。"
              : "This page organizes the site's last recorded version entries, related articles, and review work. It is not a live patch dashboard and cannot confirm current banners, events, or character availability."}
          </p>
          <p className="mt-3 text-sm text-amber-200/80">
            {isZhLocale(locale)
              ? locale === "tw"
                ? "復核規則：僅以目標區服的官方公告與遊戲內內容確認目前版本。本站歷史條目、社群討論、截圖與推測均不能用來改寫當前卡池或資源決策。"
                : "复核规则：仅以目标区服的官方公告与游戏内内容确认当前版本。本站历史条目、社区讨论、截图与推测均不能用来改写当前卡池或资源决策。"
              : "Verification policy: confirm the current version only with the target server's official notices and in-game content. Historical site entries, community posts, screenshots, and predictions cannot update current banner or resource decisions."}
          </p>
        </div>

        {latestRecorded && (
          <section className="mt-8 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${typeClass(latestRecorded.type)}`}>
                {isZhLocale(locale) ? (locale === "tw" ? "站內最後記錄版本" : "站内最后记录版本") : "Last Recorded Site Version"}
              </span>
              <span className="text-sm text-gray-400">{latestRecorded.date}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              {isZhLocale(locale)
                ? `${latestRecorded.version} · ${locale === "tw" ? latestRecorded.versionName : latestRecorded.versionName}`
                : `v${latestRecorded.version} · ${latestRecorded.versionNameEn}`}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(isZhLocale(locale) ? latestRecorded.highlights : latestRecorded.highlightsEn)?.slice(0, 6).map((item) => (
                <div key={item} className="rounded-xl border border-gray-800/80 bg-gray-950/40 p-3 text-sm text-gray-300">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/changelog/${latestRecorded.version}`}
                className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-300 transition-colors"
              >
                {isZhLocale(locale) ? (locale === "tw" ? "查看歷史更新條目" : "查看历史更新条目") : "Read Historical Patch Entry"}
              </Link>
              <Link
                href={`/${lang}/banners`}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
              >
                {isZhLocale(locale) ? (locale === "tw" ? "卡池歷史資料" : "卡池历史资料") : "Banner Archive"}
              </Link>
            </div>
          </section>
        )}

        {upcoming && (
          <section className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${typeClass(upcoming.type)}`}>
                {isZhLocale(locale) ? (locale === "tw" ? "未驗證後續條目" : "未验证后续条目") : "Unverified Future Entry"}
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
                  ? "此區只保留站內未完成復核的後續資料，日期與內容不代表已公布或已實裝。請在決定抽卡、升級或儲值前，以目標區服官方公告和客戶端為準。"
                  : "此区只保留站内未完成复核的后续资料，日期与内容不代表已公布或已实装。请在决定抽卡、升级或充值前，以目标区服官方公告和客户端为准。"
                : "This block contains only site entries that have not completed verification. Its dates and content do not establish that anything was announced or released; use target-server official notices and the client before pulling, upgrading, or spending."}
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

        <section className="mt-6 rounded-xl border border-gray-800 bg-gray-900/35 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold">{isZhLocale(locale) ? (locale === "tw" ? "版本營運清單" : "版本运营清单") : "Patch Operations Checklist"}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {isZhLocale(locale)
                  ? (locale === "tw" ? "每次版本調整前先核對來源與狀態，避免把傳聞帶進抽卡或養成建議。" : "每次版本调整前先核对来源与状态，避免把传闻带进抽卡或养成建议。")
                  : "Verify sources and status before changing pull or progression advice."}
              </p>
            </div>
            <span className="text-xs text-gray-500">{isZhLocale(locale) ? `最后复核 ${operations.reviewedAt}` : `Reviewed ${operations.reviewedAt}`}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {operations.checklist.map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-800 bg-gray-950/35 p-4">
                <ContentStatus locale={locale} status={item.status as VerificationStatus} reviewedAt={operations.reviewedAt} />
                <h3 className="mt-3 font-medium">{isZhLocale(locale) ? item.titleZh : item.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold">{isZhLocale(locale) ? (locale === "tw" ? "本週內容復核重點" : "本周内容复核重点") : "This Week's Content Review Queue"}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {isZhLocale(locale)
                  ? "优先检查会影响卡池、资源、角色、平台或性能决策的陈旧内容。"
                  : "Prioritize aged content that can affect banners, resources, character, platform, or performance decisions."}
              </p>
            </div>
            <span className="text-xs text-gray-500">{isZhLocale(locale) ? `${freshnessReport.totals.needsReview} 项待复核` : `${freshnessReport.totals.needsReview} items need review`}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {weeklyQueue.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={`/${lang}${item.href}`}
                className="rounded-lg border border-gray-800 bg-gray-950/35 p-4 transition-colors hover:border-rose-400/50 hover:bg-gray-900/70"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="rounded-full bg-rose-500/15 px-2 py-1 text-rose-200">{itemKindLabel(item.type)}</span>
                  <span className="text-gray-500">{isZhLocale(locale) ? `${item.ageDays} 天未复核` : `${item.ageDays} days old`}</span>
                </div>
                <p className="mt-3 text-sm font-medium">{isZhLocale(locale) ? item.title : item.titleEn}</p>
                <p className="mt-2 text-xs text-rose-200/80">{priorityLabel(item.priority)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {isZhLocale(locale) ? (locale === "tw" ? "最後記錄版本的關聯資料" : "最后记录版本的关联资料") : "Last Recorded Version References"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {isZhLocale(locale)
                  ? (locale === "tw" ? "自動聚合帶有該歷史版本標記的攻略與文章，僅供回顧和術語查找。" : "自动聚合带有该历史版本标记的攻略与文章，仅供回顾和术语查找。")
                  : "Auto-collected guides and posts tagged to this historical version, for archive review and terminology lookup only."}
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
                ? (locale === "tw" ? "回看已收錄版本的更新節奏、活動與平衡調整。" : "回看已收录版本的更新节奏、活动与平衡调整。")
                : "Review the release cadence, events, and balance changes in recorded versions.",
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
              title: isZhLocale(locale) ? (locale === "tw" ? "目前版本請先查官方來源" : "当前版本请先查官方来源") : "Check Official Sources for Current Status",
              desc: isZhLocale(locale)
                ? (locale === "tw" ? "本站版本資料適合回顧；卡池、活動、角色與資源決策必須先回到目標區服的公告與客戶端核對。" : "本站版本资料适合回顾；卡池、活动、角色与资源决策必须先回到目标区服的公告与客户端核对。")
                : "This archive is useful for review; verify banners, events, characters, and resource decisions in the target server's notices and client first.",
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
