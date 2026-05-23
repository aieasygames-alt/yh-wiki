import { isZhLocale } from "../lib/i18n";

interface QuickAnswerItem {
  label: string;
  value: string;
}

interface QuickAnswerCardProps {
  locale: string;
  items: QuickAnswerItem[];
  footer?: string;
}

/**
 * GEO-optimized Quick Answer card.
 * Renders a structured summary block at the top of content pages
 * for AI engines / Google Featured Snippets.
 */
export function QuickAnswerCard({ locale, items, footer }: QuickAnswerCardProps) {
  return (
    <div className="mb-6 rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 sm:p-5">
      <h2 className="text-sm font-bold text-primary-400 mb-2.5 flex items-center gap-1.5">
        <span>⚡</span>
        {isZhLocale(locale)
          ? (locale === "tw" ? "快速回答" : "快速回答")
          : "Quick Answer"}
      </h2>
      <div className="text-sm text-gray-300 space-y-1.5">
        {items.map((item, i) => (
          <p key={i}>
            <strong className="text-gray-200">{item.label}</strong> {item.value}
          </p>
        ))}
      </div>
      {footer && (
        <p className="mt-2.5 text-xs text-gray-500">{footer}</p>
      )}
    </div>
  );
}
