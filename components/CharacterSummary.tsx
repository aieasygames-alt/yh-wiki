import type { Locale } from "../lib/i18n";
import { isZhLocale } from "../lib/i18n";

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

export function CharacterSummary({ name, nameTw, nameEn, role, roleEn, attribute, rank, weapon, weaponEn, faction, description, descriptionEn, cvZh, cvJp, cvJpEn, locale }: CharacterSummaryProps) {
  const displayName = locale === "en" ? nameEn : (locale === "tw" ? (nameTw || name) : name);
  const rows = [
    { key: locale === "en" ? "Name" : (locale === "tw" ? "名稱" : "名称"), val: locale === "en" ? `${nameEn} (${name})` : `${displayName} (${nameEn})` },
    { key: locale === "en" ? "Role" : (locale === "tw" ? "定位" : "定位"), val: locale === "en" ? roleEn : role },
    { key: locale === "en" ? "Element" : (locale === "tw" ? "屬性" : "属性"), val: attribute },
    { key: locale === "en" ? "Rarity" : (locale === "tw" ? "稀有度" : "稀有度"), val: `${rank}-Rank` },
    ...(weapon && weapon !== "TBD" ? [{ key: locale === "en" ? "Weapon Type" : (locale === "tw" ? "武器類型" : "武器类型"), val: locale === "en" ? weaponEn : weapon }] : []),
    ...(faction ? [{ key: locale === "en" ? "Faction" : (locale === "tw" ? "陣營" : "阵营"), val: faction }] : []),
    ...(cvZh ? [{ key: locale === "en" ? "VA (CN)" : (locale === "tw" ? "中文配音" : "中文配音"), val: cvZh }] : []),
    ...(cvJp ? [{ key: locale === "en" ? "VA (JP)" : (locale === "tw" ? "日文配音" : "日文配音"), val: locale === "en" ? `${cvJpEn || cvJp}` : cvJp }] : []),
  ];

  return (
    <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8" aria-label={locale === "en" ? "Character Summary" : (locale === "tw" ? "角色摘要" : "角色摘要")}>
      <h2 className="text-lg font-bold mb-3">{locale === "en" ? "Quick Stats" : (locale === "tw" ? "角色概覽" : "角色概览")}</h2>
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
