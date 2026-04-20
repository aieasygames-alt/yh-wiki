import type { Locale } from "../lib/i18n";

interface TierBadgeProps {
  rank: string;
  tierRank?: string;
  tierReason?: string;
  tierReasonZh?: string;
  locale: Locale;
}

export function TierBadge({
  rank,
  tierRank,
  tierReason,
  tierReasonZh,
  locale,
}: TierBadgeProps) {
  const effectiveTier = tierRank || rank;

  const colorMap: Record<string, string> = {
    S: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
    A: "bg-blue-400/20 text-blue-400 border-blue-400/30",
    B: "bg-green-400/20 text-green-400 border-green-400/30",
  };

  const badgeColor = colorMap[effectiveTier] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const reason =
    locale === "en" ? tierReason : tierReasonZh;

  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-sm font-bold ${badgeColor}`}
      >
        {effectiveTier}
      </span>
      {reason && (
        <p className="text-sm text-gray-400">{reason}</p>
      )}
    </div>
  );
}
