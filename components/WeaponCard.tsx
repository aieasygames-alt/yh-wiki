import Link from "next/link";
import { GameImage } from "./GameImage";
import type { Locale } from "../lib/i18n";
import { ARC_TYPE_LABELS, SUBSTAT_LABELS } from "../lib/attributes";

const TYPE_COLORS: Record<string, string> = {
  gas: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  liquid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  plasma: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  solid: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  synthesis: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const RANK_COLORS: Record<string, string> = {
  S: "text-yellow-400",
  A: "text-purple-400",
  B: "text-blue-400",
};

interface WeaponCardProps {
  id: string;
  name: string;
  nameTw: string;
  nameEn: string;
  rank: string;
  type: string;
  baseAtk: number;
  substat: string;
  substatValue: string;
  locale: Locale;
}

export function WeaponCard({ id, name, nameTw, nameEn, rank, type, baseAtk, substat, substatValue, locale }: WeaponCardProps) {
  const displayName = locale === "en" ? nameEn : (locale === "tw" ? (nameTw || name) : name);
  const subLabel = locale === "en" ? nameEn : (locale === "tw" ? name : nameEn);
  const typeLabel = ARC_TYPE_LABELS[type]?.[locale] || type;
  const substatLabel = SUBSTAT_LABELS[substat]?.[locale] || substat;

  return (
    <Link
      href={`/${locale}/weapons/${id}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
    >
      <div className="relative">
        <GameImage
          type="weapon"
          id={id}
          name={name}
          className="w-full aspect-square rounded-lg mb-3"
        />
        <span className={`absolute top-1 right-1 text-xs font-bold px-1.5 py-0.5 rounded bg-gray-900/80 ${RANK_COLORS[rank] || "text-gray-400"}`}>
          {rank}
        </span>
      </div>
      <h3 className="font-medium text-sm truncate">{displayName}</h3>
      <p className="text-xs text-gray-500 truncate">{subLabel}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_COLORS[type] || "bg-gray-800 text-gray-400"}`}>
          {typeLabel}
        </span>
        <span className="text-xs text-gray-500">ATK {baseAtk}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{substatLabel} {substatValue}</p>
    </Link>
  );
}
