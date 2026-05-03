import { t, type Locale } from "../lib/i18n";
import { ARC_TYPE_LABELS, ARC_RANK_LABELS, SUBSTAT_LABELS } from "../lib/attributes";

interface WeaponSummaryProps {
  name: string;
  nameTw: string;
  nameEn: string;
  rank: string;
  type: string;
  baseAtk: number;
  substat: string;
  substatValue: string;
  howToObtain: string;
  howToObtainZh: string;
  howToObtainEn: string;
  relatedCharacters: { name: string; nameTw: string; nameEn: string }[];
  locale: Locale;
}

export function WeaponSummary({ name, nameTw, nameEn, rank, type, baseAtk, substat, substatValue, howToObtainZh, howToObtainEn, relatedCharacters, locale }: WeaponSummaryProps) {
  const displayName = locale === "en" ? nameEn : (locale === "tw" ? (nameTw || name) : name);
  const altName = locale === "en" ? name : nameEn;
  const rankLabel = ARC_RANK_LABELS[rank]?.[locale] || rank;
  const typeLabel = ARC_TYPE_LABELS[type]?.[locale] || type;
  const substatLabel = SUBSTAT_LABELS[substat]?.[locale] || substat;
  const rows = [
    { key: t(locale, "common.name"), val: `${displayName} (${altName})` },
    { key: t(locale, "common.rank"), val: rankLabel },
    { key: t(locale, "common.type"), val: typeLabel },
    { key: "ATK", val: String(baseAtk) },
    { key: substatLabel, val: substatValue },
    { key: t(locale, "weaponSummary.obtain"), val: locale === "en" ? howToObtainEn : howToObtainZh },
  ];

  if (relatedCharacters.length > 0) {
    const charNames = relatedCharacters.map(c => locale === "en" ? c.nameEn : (locale === "tw" ? (c.nameTw || c.name) : c.name)).join(", ");
    rows.push({ key: t(locale, "weaponSummary.bestFor"), val: charNames });
  }

  return (
    <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8" aria-label={t(locale, "weaponSummary.title")}>
      <h2 className="text-lg font-bold mb-3">{t(locale, "weaponSummary.title")}</h2>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-gray-800/50 last:border-0">
              <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{row.key}</td>
              <td className="py-2 text-gray-300">{row.val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
