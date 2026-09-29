import { isZhLocale, type Locale } from "../lib/i18n";

export type VerificationStatus = "confirmed" | "live" | "watch" | "historical";

const styles: Record<VerificationStatus, string> = {
  confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  live: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  watch: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  historical: "border-gray-600 bg-gray-800/70 text-gray-300",
};

export function ContentStatus({ locale, status, reviewedAt, sourceUrl }: { locale: Locale; status: VerificationStatus; reviewedAt?: string; sourceUrl?: string }) {
  const isZh = isZhLocale(locale);
  const label = isZh
    ? ({ confirmed: "官方确认", live: "正式服实测", watch: "待官方确认", historical: "历史资料" } as const)[status]
    : ({ confirmed: "Officially confirmed", live: "Live verified", watch: "Watchlist", historical: "Historical reference" } as const)[status];

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-xs ${styles[status]}`}>
      <span className="font-semibold">{label}</span>
      {reviewedAt && <span className="opacity-80">{isZh ? `最后复核 ${reviewedAt}` : `Reviewed ${reviewedAt}`}</span>}
      {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">{isZh ? "查看来源" : "View source"}</a>}
    </div>
  );
}
