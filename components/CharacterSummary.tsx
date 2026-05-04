import { t, isZhLocale, type Locale } from "../lib/i18n";

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
  const displayName = locale === "zh" ? name : (locale === "tw" ? (nameTw || name) : nameEn);
  const rows = [
    { key: t(locale, "common.name"), val: isZhLocale(locale) ? `${displayName} (${nameEn})` : `${nameEn} (${name})` },
    { key: t(locale, "common.role"), val: isZhLocale(locale) ? role : roleEn },
    { key: t(locale, "common.element"), val: attribute },
    { key: t(locale, "common.rarity"), val: `${rank}-Rank` },
    ...(weapon && weapon !== "TBD" ? [{ key: t(locale, "common.weaponType"), val: isZhLocale(locale) ? weapon : weaponEn }] : []),
    ...(faction ? [{ key: t(locale, "common.faction"), val: faction }] : []),
    ...(cvZh ? [{ key: t(locale, "characterSummary.vaCn"), val: cvZh }] : []),
    ...(cvJp ? [{ key: t(locale, "characterSummary.vaJp"), val: isZhLocale(locale) ? cvJp : `${cvJpEn || cvJp}` }] : []),
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
