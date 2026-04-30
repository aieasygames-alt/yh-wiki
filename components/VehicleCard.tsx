import Link from "next/link";
import { GameImage } from "./GameImage";
import type { Locale } from "../lib/i18n";
import { isZhLocale } from "../lib/i18n";

const TYPE_LABELS: Record<Locale, Record<string, string>> = {
  zh: {
    "轿车": "轿车",
    "摩托车": "摩托车",
    "小型摩托": "小型摩托",
    "卡丁车": "卡丁车",
  },
  tw: {
    "轿车": "轎車",
    "摩托车": "摩托車",
    "小型摩托": "小型摩托",
    "卡丁车": "卡丁車",
  },
  en: {
    "Car": "Car",
    "Motorcycle": "Motorcycle",
    "Scooter": "Scooter",
    "Kart": "Kart",
  },
};

const TYPE_COLORS: Record<string, string> = {
  "轿车": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "摩托车": "bg-red-500/20 text-red-400 border-red-500/30",
  "小型摩托": "bg-green-500/20 text-green-400 border-green-500/30",
  "卡丁车": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Car": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Motorcycle": "bg-red-500/20 text-red-400 border-red-500/30",
  "Scooter": "bg-green-500/20 text-green-400 border-green-500/30",
  "Kart": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

interface VehicleCardProps {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  topSpeed: number;
  price: number | null;
  brand: string;
  brandEn: string;
  locale: Locale;
}

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return `${price}`;
}

export function VehicleCard({ id, name, nameEn, type, typeEn, topSpeed, price, brand, brandEn, locale }: VehicleCardProps) {
  const typeLabel = isZhLocale(locale) ? type : typeEn;
  const colorClass = TYPE_COLORS[type] || TYPE_COLORS[typeEn] || "bg-gray-800 text-gray-400";
  const labelKey = TYPE_LABELS[locale][type] || TYPE_LABELS[locale][typeEn] || typeLabel;
  const brandLabel = isZhLocale(locale) ? brand : brandEn;

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
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded border ${colorClass}`}>
          {labelKey}
        </span>
        <span className="text-xs text-gray-500">{topSpeed} km/h</span>
        {price !== null && (
          <span className="text-xs text-primary-400">{formatPrice(price)} Fons</span>
        )}
      </div>
      {brandLabel && (
        <p className="text-xs text-gray-600 mt-1">{brandLabel}</p>
      )}
    </Link>
  );
}
