import type { Locale } from "../lib/i18n";

const messages: Record<string, Record<Locale, string>> = {
  available: {
    zh: "以下数据基于 1.0 公测版本整理，如有偏差请反馈。",
    tw: "以下數據基於 1.0 公測版本整理，如有偏差請回饋。",
    en: "Data below is based on the 1.0 launch version. Please report any discrepancies.",
  },
  upcoming: {
    zh: "该角色尚未在当前版本实装，数据基于测试版本，可能有所变更。",
    tw: "該角色尚未在當前版本實裝，數據基於測試版本，可能有所變更。",
    en: "This character is not yet available in the current version. Data is based on beta and may change.",
  },
  rumored: {
    zh: "该角色信息来源于数据挖掘，未经官方确认，数据可能不准确。",
    tw: "該角色資訊來源於數據挖掘，未經官方確認，數據可能不準確。",
    en: "This character's info is from data mining and is unconfirmed. Data may be inaccurate.",
  },
  default: {
    zh: "以下数据基于测试版本整理，可能与正式版有所差异。",
    tw: "以下數據基於測試版本整理，可能與正式版有所差異。",
    en: "Data below is based on the test version and may differ from the official release.",
  },
};

export function DataStatusBanner({
  locale,
  status,
}: {
  locale: Locale;
  status?: string;
}) {
  const msg = (status && messages[status]) ? messages[status] : messages.default;
  return (
    <div className="max-w-4xl mx-auto px-4 pt-4">
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-300">
        {msg[locale]}
      </div>
    </div>
  );
}
