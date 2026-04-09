import Link from "next/link";
import type { Locale } from "../lib/i18n";

const TYPE_LABELS: Record<Locale, Record<string, string>> = {
  zh: {
    melee: "近战",
    ranged: "远程",
    magic: "异能",
    companion: "伴生体",
    summon: "召唤",
    support: "辅助",
  },
  en: {
    melee: "Melee",
    ranged: "Ranged",
    magic: "Esper",
    companion: "Companion",
    summon: "Summon",
    support: "Support",
  },
};

const TYPE_COLORS: Record<string, string> = {
  melee: "bg-red-500/20 text-red-400 border-red-500/30",
  ranged: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  magic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  companion: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  summon: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  support: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

interface WeaponCardProps {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  locale: Locale;
}

export function WeaponCard({ id, name, nameEn, type, locale }: WeaponCardProps) {
  return (
    <Link
      href={`/${locale}/weapons/${id}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
    >
      <div className="w-full aspect-square rounded-lg mb-3 bg-gray-800 flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-600 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      <h3 className="font-medium text-sm truncate">{name}</h3>
      <p className="text-xs text-gray-500 truncate">{nameEn}</p>
      <div className="mt-2">
        <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_COLORS[type] || "bg-gray-800 text-gray-400"}`}>
          {TYPE_LABELS[locale][type] || type}
        </span>
      </div>
    </Link>
  );
}
