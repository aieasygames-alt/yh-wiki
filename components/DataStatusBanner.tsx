import type { Locale } from "../lib/i18n";

const messages: Record<Locale, string> = {
  zh: "以下数据基于测试版本整理，可能与正式版有所差异。",
  en: "Data below is based on the test version and may differ from the official release.",
};

export function DataStatusBanner({ locale }: { locale: Locale }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-4">
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-300">
        {messages[locale]}
      </div>
    </div>
  );
}
