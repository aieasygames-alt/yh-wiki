import { t, type Locale } from "../lib/i18n";

const STATUS_I18N_KEYS: Record<string, string> = {
  available: "dataStatus.live",
  upcoming: "dataStatus.upcoming",
  rumored: "dataStatus.leaked",
  leaked: "dataStatus.leaked",
  beta: "dataStatus.beta",
};

export function DataStatusBanner({
  locale,
  status,
}: {
  locale: Locale;
  status?: string;
}) {
  if (!status || status === "available") return null;
  const i18nKey = STATUS_I18N_KEYS[status] || "dataStatus.beta";
  const msg = t(locale, i18nKey);
  return (
    <div className="max-w-4xl mx-auto px-4 pt-4">
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-300">
        {msg}
      </div>
    </div>
  );
}
