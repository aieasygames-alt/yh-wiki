import Link from "next/link";
import { GameImage } from "./GameImage";
import type { Locale } from "../lib/i18n";
import { isZhLocale } from "../lib/i18n";

const TYPE_LABELS: Record<Locale, Record<string, string>> = {
  zh: {
    "摩托车": "摩托车",
    "越野车": "越野车",
    "轿车": "轿车",
    "跑车": "跑车",
    "SUV": "SUV",
  },
  tw: {
    "摩托车": "摩托车",
    "越野车": "越野车",
    "轿车": "轿车",
    "跑车": "跑车",
    "SUV": "SUV",
  },
  en: {
    "Motorcycle": "Motorcycle",
    "Off-road Vehicle": "Off-road",
    "Sedan": "Sedan",
    "Sports Car": "Sports",
    "SUV": "SUV",
  },
};

const TYPE_COLORS: Record<string, string> = {
  "摩托车": "bg-red-500/20 text-red-400 border-red-500/30",
  "越野车": "bg-green-500/20 text-green-400 border-green-500/30",
  "轿车": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "跑车": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "SUV": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Motorcycle": "bg-red-500/20 text-red-400 border-red-500/30",
  "Off-road Vehicle": "bg-green-500/20 text-green-400 border-green-500/30",
  "Sedan": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Sports Car": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

interface VehicleCardProps {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  rarity: number;
  locale: Locale;
}

export function VehicleCard({ id, name, nameEn, type, typeEn, rarity, locale }: VehicleCardProps) {
  const typeLabel = isZhLocale(locale) ? type : typeEn;
  const colorClass = TYPE_COLORS[type] || TYPE_COLORS[typeEn] || "bg-gray-800 text-gray-400";
  const labelKey = TYPE_LABELS[locale][type] || TYPE_LABELS[locale][typeEn] || typeLabel;

  return (
    <Link
      href={`/${locale}/vehicles/${id}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
    >
      <GameImage
        type="vehicle"
        id={id}
        name={name}
        className="w-full aspect-[3/2] rounded-lg mb-3"
      />
      <h3 className="font-medium text-sm truncate">{name}</h3>
      <p className="text-xs text-gray-500 truncate">{nameEn}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs px-2 py-0.5 rounded border ${colorClass}`}>
          {labelKey}
        </span>
        {rarity >= 5 && (
          <span className="text-xs font-bold text-yellow-400">★</span>
        )}
      </div>
    </Link>
  );
}
