"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { t, type Locale } from "../../../lib/i18n";
import redeemCodesData from "../../../data/redeem-codes.json";

interface RedeemCode {
  code: string;
  reward: string;
  rewardEn: string;
  status: "active" | "expired" | "unknown";
  expiresAt: string;
  source: string;
}

const codes = redeemCodesData as RedeemCode[];

const STATUS_CONFIG = {
  active: {
    label: { zh: "有效", en: "Active" },
    dot: "bg-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  expired: {
    label: { zh: "已过期", en: "Expired" },
    dot: "bg-gray-500",
    border: "border-gray-700",
    bg: "bg-gray-800/30 opacity-50",
  },
  unknown: {
    label: { zh: "未知", en: "Unknown" },
    dot: "bg-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
};

export default function RedeemCodesPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }, []);

  const filteredCodes = filter === "all" ? codes : codes.filter((c) => c.status === filter);
  const activeCount = codes.filter((c) => c.status === "active").length;
  const expiredCount = codes.filter((c) => c.status === "expired").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t(lang, "redeemCodes.title")}</h1>
      <p className="text-sm text-gray-500 mb-2">{t(lang, "redeemCodes.description")}</p>
      <p className="text-xs text-gray-600 mb-8">
        {t(lang, "redeemCodes.lastUpdate")}: 2026-04-09
      </p>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "redeemCodes.total")}</p>
          <p className="text-lg font-bold text-gray-300">{codes.length}</p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
          <p className="text-xs text-gray-500">{t(lang, "redeemCodes.active")}</p>
          <p className="text-lg font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500">{t(lang, "redeemCodes.expired")}</p>
          <p className="text-lg font-bold text-gray-500">{expiredCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              filter === f
                ? "bg-primary-500/20 text-primary-400 border-primary-500/30"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {t(lang, `redeemCodes.filter_${f}`)}
          </button>
        ))}
      </div>

      {/* Codes List */}
      <div className="space-y-3">
        {filteredCodes.map((code) => {
          const config = STATUS_CONFIG[code.status] || STATUS_CONFIG.unknown;
          const reward = lang === "zh" ? code.reward : code.rewardEn;
          const isExpired = code.status === "expired";

          return (
            <div
              key={code.code}
              className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-colors`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <code className={`text-sm font-mono font-bold ${isExpired ? "text-gray-500 line-through" : "text-gray-200"}`}>
                      {code.code}
                    </code>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      code.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700/50 text-gray-500"
                    }`}>
                      {config.label[lang]}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 ${isExpired ? "text-gray-600" : "text-gray-300"}`}>
                    {t(lang, "redeemCodes.reward")}: {reward}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      {t(lang, "redeemCodes.expires")}: {code.expiresAt}
                    </span>
                    {code.source && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">
                        {code.source}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => !isExpired && handleCopy(code.code)}
                  disabled={isExpired}
                  className={`shrink-0 px-3 py-2 text-xs rounded-lg border transition-all ${
                    copiedCode === code.code
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : isExpired
                      ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-primary-500/50 hover:text-primary-400"
                  }`}
                >
                  {copiedCode === code.code
                    ? t(lang, "redeemCodes.copied")
                    : t(lang, "redeemCodes.copy")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Redeem */}
      <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-lg font-bold mb-4">{t(lang, "redeemCodes.howToTitle")}</h2>
        <ol className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">1.</span>
            <span>{t(lang, "redeemCodes.step1")}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">2.</span>
            <span>{t(lang, "redeemCodes.step2")}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400 font-bold">3.</span>
            <span>{t(lang, "redeemCodes.step3")}</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
