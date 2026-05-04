import Link from "next/link";
import { GameImage } from "./GameImage";
import { getAttributeColor, getAttributeLabel } from "../lib/attributes";
import { t, type Locale } from "../lib/i18n";

interface CharacterCardProps {
  id: string;
  name: string;
  nameTw?: string;
  nameEn: string;
  attribute: string;
  rank: string;
  status?: string;
  image?: string;
  locale: Locale;
}

const STATUS_KEYS: Record<string, string> = {
  upcoming: "status.upcoming",
  rumored: "status.rumored",
};

export function CharacterCard({
  id,
  name,
  nameTw,
  nameEn,
  attribute,
  rank,
  status,
  image,
  locale,
}: CharacterCardProps) {
  const displayName = locale === "zh" ? name : (locale === "tw" ? (nameTw || name) : nameEn);
  const subName = locale === "en" ? name : nameEn;
  const isUnavailable = status === "upcoming" || status === "rumored";
  const statusLabel = status ? (STATUS_KEYS[status] ? t(locale, STATUS_KEYS[status]) : null) : null;
  const statusColor =
    status === "upcoming"
      ? "bg-orange-500/80 text-white"
      : "bg-gray-500/80 text-gray-200";

  return (
    <Link
      href={`/${locale}/characters/${id}`}
      className={`group block rounded-xl border bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5 relative ${
        isUnavailable
          ? "border-gray-700/50 opacity-60"
          : "border-gray-800"
      }`}
    >
      {statusLabel && (
        <span
          className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded font-medium z-10 ${statusColor}`}
        >
          {statusLabel}
        </span>
      )}
      <GameImage
        type="character"
        id={id}
        name={name}
        src={image}
        className="w-full aspect-square rounded-lg mb-3"
      />
      <h3 className="font-medium text-sm truncate">{displayName}</h3>
      <p className="text-xs text-gray-500 truncate">{subName}</p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(attribute)}`}
        >
          {getAttributeLabel(attribute, locale)}
        </span>
        <span
          className={`text-xs font-bold ${rank === "S" ? "text-yellow-400" : "text-blue-400"}`}
        >
          {rank}
        </span>
      </div>
    </Link>
  );
}
