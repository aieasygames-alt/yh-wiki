import { t, type Locale } from "../lib/i18n";

interface CharacterSummaryProps {
  name: string;
  nameTw?: string;
  nameEn: string;
  role: string;
  roleEn: string;
  attribute: string;
  rank: string;
  weapon?: string;
  weaponEn?: string;
  faction?: string;
  description?: string;
  descriptionEn?: string;
  cvZh?: string;
  cvJp?: string;
  cvJpEn?: string;
  locale: Locale;
}

export function CharacterSummary({ name, nameTw, nameEn, role, roleEn, attribute, rank, weapon, weaponEn, faction, cvZh, cvJp, cvJpEn, locale }: CharacterSummaryProps) {
  const displayName = locale === "en" ? nameEn : (locale === "tw" ? (nameTw || name) : name);
  const rows = [
    { key: t(locale, "common.name"), val: locale === "en" ? `${nameEn} (${name})` : `${displayName} (${nameEn})` },
    { key: t(locale, "common.role"), val: locale === "en" ? roleEn : role },
    { key: t(locale, "common.element"), val: attribute },
    { key: t(locale, "common.rarity"), val: `${rank}-Rank` },
    ...(weapon && weapon !== "TBD" ? [{ key: t(locale, "common.weaponType"), val: locale === "en" ? weaponEn : weapon }] : []),
    ...(faction ? [{ key: t(locale, "common.faction"), val: faction }] : []),
    ...(cvZh ? [{ key: t(locale, "characterSummary.vaCn"), val: cvZh }] : []),
    ...(cvJp ? [{ key: t(locale, "characterSummary.vaJp"), val: locale === "en" ? `${cvJpEn || cvJp}` : cvJp }] : []),
  ];

  return (
    <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8" aria-label={t(locale, "characterSummary.title")}>
      <h2 className="text-lg font-bold mb-3">{t(locale, "characterSummary.title")}</h2>
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
