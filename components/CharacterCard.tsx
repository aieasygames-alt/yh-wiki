import Link from "next/link";
import { GameImage } from "./GameImage";
import { getAttributeColor, getAttributeLabel } from "../lib/attributes";
import type { Locale } from "../lib/i18n";

interface CharacterCardProps {
  id: string;
  name: string;
  nameEn: string;
  attribute: string;
  rank: string;
  locale: Locale;
}

export function CharacterCard({
  id,
  name,
  nameEn,
  attribute,
  rank,
  locale,
}: CharacterCardProps) {
  return (
    <Link
      href={`/${locale}/characters/${id}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
    >
      <GameImage
        type="character"
        id={id}
        name={name}
        className="w-full aspect-square rounded-lg mb-3"
      />
      <h3 className="font-medium text-sm truncate">{name}</h3>
      <p className="text-xs text-gray-500 truncate">{nameEn}</p>
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
