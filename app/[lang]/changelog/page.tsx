import { getAllChangelogs } from "../../../lib/queries";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { Breadcrumb } from "../../../components/Breadcrumb";
import Link from "next/link";
import { ContentStatus, type VerificationStatus } from "../../../components/ContentStatus";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const changelogs = getAllChangelogs();
  const latestRecorded = changelogs[0];
  const title = t(locale, "changelog.seoTitle");
  const description = locale === "tw"
    ? `異環歷史版本記錄彙整，收錄 ${changelogs.length} 次站內版本資料，涵蓋角色、卡池、活動、平衡與修復欄位；最後記錄為 ${latestRecorded?.version ?? "1.x"}，目前狀態請以客戶端為準。`
    : locale === "zh"
    ? `异环历史版本记录汇总，收录 ${changelogs.length} 次站内版本资料，涵盖角色、卡池、活动、平衡与修复字段；最后记录为 ${latestRecorded?.version ?? "1.x"}，当前状态请以客户端为准。`
    : `Historical NTE version-record hub with ${changelogs.length} site entries covering character, banner, event, balance, and fix fields. Last recorded version: ${latestRecorded?.version ?? "1.x"}; verify current status in the client.`;
  return {
    title,
    description,
    alternates: hreflangAlternates("changelog", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default async function ChangelogListPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const changelogs = getAllChangelogs();

  const typeColors: Record<string, string> = {
    major: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    minor: "bg-primary-500/20 text-primary-400 border-primary-500/30",
    fix: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "changelog.title") },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">{t(locale, "changelog.title")}</h1>
        <p className="text-gray-400 mb-8">{t(locale, "changelog.description")}</p>
        <p className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
          {isZhLocale(locale)
            ? (locale === "tw" ? "歷史版本資料復核：2026-09-29。所有日期、角色、卡池、活動、平衡、修復與補償條目都不驗證目前版本；請以目標區服客戶端和官方公告確認現況。" : "历史版本资料复核：2026-09-29。所有日期、角色、卡池、活动、平衡、修复与补偿条目都不验证当前版本；请以目标区服客户端和官方公告确认现况。")
            : "Historical version records reviewed September 29, 2026. Dates, characters, banners, events, balance changes, fixes, and compensation entries do not verify the current version; confirm the current state in the target server’s client and official notices."}
        </p>

        <div className="space-y-6">
          {changelogs.map((cl) => {
            const dateStr = locale === "en" && cl.dateGlobal ? cl.dateGlobal : cl.date;
            const highlights = isZhLocale(locale) ? cl.highlights : cl.highlightsEn;
            const versionName = isZhLocale(locale) ? cl.versionName : cl.versionNameEn;
            const typeLabel = cl.type === "major"
              ? t(locale, "changelogDetails.major")
              : cl.type === "minor"
              ? t(locale, "changelogDetails.minor")
              : t(locale, "changelogDetails.fix");

            return (
              <Link
                key={cl.id}
                href={`/${lang}/changelog/${cl.version}`}
                className="block rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-primary-400">v{cl.version}</span>
                  <span className="text-sm text-gray-400">{versionName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[cl.type] || typeColors.fix}`}>
                    {typeLabel}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">{dateStr}</span>
                </div>
                <ContentStatus
                  locale={locale}
                  status={(cl.verificationStatus || "historical") as VerificationStatus}
                  reviewedAt={cl.reviewedAt}
                />
                <ul className="space-y-1">
                  {highlights?.slice(0, 4).map((h, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
                {cl.sections && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cl.sections.map((s) => (
                      <span key={s.title} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500">
                        {isZhLocale(locale) ? s.title : s.titleEn}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { href: `/${lang}/cn-vs-global`, label: isZhLocale(locale) ? "国服 vs 国际服" : "CN vs Global" },
            { href: `/${lang}/steam`, label: isZhLocale(locale) ? "Steam 版发售" : "Steam Version" },
            { href: `/${lang}/banners`, label: isZhLocale(locale) ? "卡池时间表" : "Banner Schedule" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 text-sm text-gray-300 hover:border-primary-500/40 hover:text-primary-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
