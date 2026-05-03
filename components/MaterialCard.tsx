import Link from "next/link";
import { GameImage } from "./GameImage";
import { t, type Locale } from "../lib/i18n";

const TYPE_I18N_KEYS: Record<string, string> = {
  resonance: "types.resonance",
  nucleus: "types.nucleus",
  permit: "types.permit",
  drop: "types.drop",
  currency: "types.currency",
  domain: "types.domain",
  manual: "types.manual",
};

interface MaterialCardProps {
  id: string;
  name: string;
  nameEn: string;
  rarity: number;
  type: string;
  locale: Locale;
  showType?: boolean;
}

export function MaterialCard({
  id,
  name,
  nameEn,
  rarity,
  type,
  locale,
  showType = false,
}: MaterialCardProps) {
  return (
    <Link
      href={`/${locale}/materials/${id}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
    >
      <GameImage
        type="material"
        id={id}
        name={name}
        className="w-full aspect-square rounded-lg mb-3"
      />
      <h3 className="font-medium text-sm truncate">{name}</h3>
      <p className="text-xs text-gray-500 truncate">{nameEn}</p>
      {showType ? (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
            {TYPE_I18N_KEYS[type] ? t(locale, TYPE_I18N_KEYS[type]) : type}
          </span>
          <span className="text-xs text-yellow-500">
            {"★".repeat(rarity)}
          </span>
        </div>
      ) : (
        <p className="text-xs text-yellow-500 mt-1">
          {"★".repeat(rarity)}
        </p>
      )}
    </Link>
  );
}
